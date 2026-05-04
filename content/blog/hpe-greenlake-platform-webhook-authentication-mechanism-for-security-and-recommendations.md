---
title: GreenLake Webhook authentication mechanism for security and recommendations
date: 2026-04-27T07:20:58.618Z
priority: 0
author: "Santhosh S and Chethan B "
authorimage: /img/santhosh.png
disable: false
tags:
  - webhooks
  - authentication
  - events
  - integrity
  - verification
---
## Introduction

In this blog post, we will walk you through how GreenLake webhook approaches webhook security end-to-end — from registering a webhook with HMAC-SHA256 signature verification, to supporting multiple authentication schemes (OAuth 2.0, API Key, and no-auth), to performing zero-downtime secret rotation using a dual-secret model. By the end, you'll have a clear understanding of how to register, authenticate, and verify webhooks securely, and how to rotate secrets in production without dropping a single event.

## Setting up webhook authentication on GreenLake webhooks

### Prerequisites

Before you begin, make sure you have:

1. An active GreenLake account with a workspace
2. A publicly accessible HTTPS endpoint to receive webhook events (your destination URL)
3. An access token for API authentication (obtained via the GreenLake IAM service)
4. cURL or any HTTP client (for example, Postman) for making API calls

### Choose your authentication type

GreenLake webhooks supports three outbound authentication modes. These modes control how the service authenticates itself when delivering events to your endpoint:

|   `authType` |  When to use |
|----------|-------------|
| `"APIKey"` | Your endpoint expects a static key in the Authorization header |
| `"Oauth"` | Your endpoint is protected by an OAuth 2.0 client credentials flow |
| `NoAuth` (empty) NotRecommended  |     Your endpoint is open or handles authentication independently |

> **Note:** Regardless of `authType`, all webhooks use HMAC-SHA256 signatures so your endpoint can verify payload integrity. The `authType` only governs how the delivery service authenticates outbound requests to your URL.

### Register a webhook with HMAC secret

Every webhook requires a secret—a shared key used to compute HMAC-SHA256 signatures over event payloads. Your endpoint uses this secret to independently verify that each delivery is authentic. The webhook secret length can be from 4 characters to maximum 100 characters. The webhook secret length can be from 4 characters to maximum 100 characters.

>**Note:** Choose a secret with special characters and maximum of 20 characters.

The following is an example request. Anything between `<` and `>` denotes a placeholder, and you need to provide the specific values. For example, replace `<my-webhook>` with the name of your webhook.

```bash
curl -X POST https://global.api.greenlake.hpe.com/events/v1beta1/webhooks \
  -H "Authorization: Bearer <your-access-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "<your-webhook-name>",
    "destination": "https://your-endpoint.example.com/events",
    "secret": "<your-super-secret-hmac-key>",
    "authType": "",
    "challengeRequestEnabled": true
  }'
```

The key fields are:

- `secret` — Your HMAC signing key. Store this securely; it is encrypted at rest using AES-CBC on the server side and never returned in plain text after creation.
- `challengeRequestEnabled` — When true (the default), the service immediately sends a challenge verification request to your destination URL to confirm it is reachable and correctly configured before activating the webhook.
- `destination` — Must be an HTTPS URL. Private/internal IP ranges are blocked.

> **NOTE**—Imagine that the already registered destination later resolves to private IPs during delivery of events. The events will be dropped. Ensure that the domain name always resolves to a public IP.

A successful response returns 201 Created. For example:

```json
{
  "id": "a1b2c3d4-...",
  "name": "my-webhook",
  "destination": "https://your-endpoint.example.com/events",
  "authType": "",
  "status": "pending",
  "challengeRequestEnabled": true,
  "createdAt": "2026-04-20T10:00:00Z"
}
```

### Handling the challenge verification request

When `challengeRequestEnabled` is true, the service immediately sends a CloudEvents-formatted verification request to your destination URL. Your endpoint must respond correctly or the webhook will remain in `pending` status and no events will be delivered.

What your endpoint receives (`POST`):

```json
{
  "specversion": "1.0",
  "type": "com.hpe.greenlake.events.v1beta1.webhooks.verification",
  "source": "https://global.api.greenlake.hpe.com/events",
  "id": "<uuid>",
  "time": "2026-04-20T10:00:01Z",
  "datacontenttype": "application/json",
  "subject": "<workspaceId>",
  "data": {
    "challengeRequest": "550e8400-e29b-41d4-a716-446655440000"
  }
}
```

What your endpoint must respond:

Your endpoint must respond by computing an HMAC-SHA256 over the `challengeRequest` value using your secret, and then return it. For example:

```json
{
  "verification": "<hmac-sha256-hex-of-challengeRequest>"
}
```

Example implementation (Go):

```go
import (
    "crypto/hmac"
    "crypto/sha256"
    "encoding/hex"
)

func computeHMAC(data, secret string) string {
    h := hmac.New(sha256.New, []byte(secret))
    h.Write([]byte(data))
    return hex.EncodeToString(h.Sum(nil))
}

// In your HTTP handler:
verification := computeHMAC(challengeRequest, yourSecret)
// Return: {"verification": "<verification>"}
```

Example implementation (Python):

```python
import hmac, hashlib

def compute_hmac(data: str, secret: str) -> str:
    return hmac.new(
        secret.encode(), data.encode(), hashlib.sha256
    ).hexdigest()
```

Once the service receives a matching HMAC response, the webhook status transitions to the `active` status and event delivery begins.

### Register a webhook with OAuth 2.0 authentication

If your endpoint is protected by OAuth 2.0, provide the client credentials so the service can obtain a bearer token before each delivery batch. For example:

```bash
curl -X POST https://global.api.greenlake.hpe.com/events/v1beta1/webhooks \
  -H "Authorization: Bearer <your-access-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "<your-oauth-webhook>",
    "destination": "<https://your-endpoint.example.com/events>",
    "secret": "<your-hmac-secret>",
    "authType": "Oauth",
    "clientId": "<your-client-id>",
    "clientSecret": "<your-client-secret>",
    "issuerUrl": "<https://your-auth-server.example.com/oauth2/token>",
    "challengeRequestEnabled": true
  }'
```

1. The service performs a `client_credentials` grant against your `issuerUrl` to obtain a bearer token.
2. The token is cached (keyed by webhook ID) and reused until expiry, minimising token requests.
3. The `clientSecret` is encrypted at rest using AES-CBC — it is never stored in plain text.
4. On delivery, the request to your endpoint includes: `Authorization: Bearer <access_token>`

### Register a webhook with API key authentication

For simpler endpoints that use a static API key:

```bash
curl -X POST https://global.api.greenlake.hpe.com/events/v1beta1/webhooks \
  -H "Authorization: Bearer <your-access-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "<your-apikey-webhook>",
    "destination": "<https://your-endpoint.example.com/events>",
    "secret": "<your-hmac-secret>",
    "authType": "APIKey",
    "apiKey": "<your-static-api-key>",
    "challengeRequestEnabled": true
  }'
```

- The `apiKey` value is sent as `Authorization: <api-key-value>` on every delivery request.
- The `apiKey` is encrypted at rest using AES-CBC.

### Verifying payload signatures on every delivery

Beyond challenge verification, every event delivery is signed with HMAC-SHA256. Your endpoint should always validate the signature on incoming requests to guard against spoofed payloads.

How it works:

1. The service computes `HMAC-SHA256(payload, secret)` and includes it in the delivery request header.
2. Your endpoint independently computes the same HMAC and compares.
3. If signatures match—the payload is authentic.

**Validation logic (Go):**

```go
func isValidSignature(payload []byte, receivedSig, secret string) bool {
    h := hmac.New(sha256.New, []byte(secret))
    h.Write(payload)
    expected := hex.EncodeToString(h.Sum(nil))
    // Use hmac.Equal to prevent timing attacks
    return hmac.Equal([]byte(expected), []byte(receivedSig))
}
```

> **Security tip:** Always use a constant-time comparison (for example, `hmac.Equal` in Go, `hmac.compare_digest` in Python) to prevent timing side-channel attacks.

### Zero-Downtime secret rotation with secondarySecret

When you need to rotate your HMAC secret without dropping events, use the dual-secret model.

#### Add the new secret as secondarySecret

To add a secondary secret, use the `PATCH /events/v1beta1/webhooks/{webhookId}`. For example:

```bash
curl -X PATCH https://global.api.greenlake.hpe.com/events/v1beta1/webhooks/{webhookId} \
  -H "Authorization: Bearer <your-access-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "secondarySecret": "<your-new-hmac-secret>"
  }'
```

During this phase, the service accepts challenge/HMAC responses signed with both the old primary secret and the new secondary secret. Deploy your endpoint changes to start accepting both. First it will validate primary if its not valid then it will fallback to new secondary.

>**Note:** Choose a secret with special characters and with maximum of 20 characters. Please reuse the secret used for secondary in the below step.

#### Promote the new secret to primary

```bash
curl -X PATCH https://global.api.greenlake.hpe.com/events/v1beta1/webhooks/{webhookId} \
  -H "Authorization: Bearer <your-access-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "secret": "<your-secondary-hmac-secret>",
    "secondarySecret": ""
  }'
```

Once `secondarySecret` is cleared, only the new primary secret is accepted. The old secret is fully retired with zero downtime and no missed events.

### Manually retrigger verification

If your endpoint was temporarily unavailable during initial registration, you can manually retrigger the challenge verification at any time using the 
`POST events/v1beta1/webhooks/{webhookId}/verify` endpoint. For example:

```bash
curl -X POST https://global.api.greenlake.hpe.com/events/v1beta1/webhooks/{webhookId}/verify \
  -H "Authorization: Bearer <your-access-token>"
```

This resends the challenge CloudEvent to your destination URL and transitions the webhook back to `active` upon success.

## Summary

### Key takeaways

Securing webhooks isn't just about locking the front door — it's about verifying who's knocking, confirming the message wasn't tampered with, and being able to change the locks without anyone noticing. Here's what we covered:

- **HMAC-SHA256 signatures** are the foundation of webhook payload integrity on GreenLake Events API—every webhook requires a secret, and every delivery is signed with it.
- **Challenge verification** ensures your endpoint is reachable and correctly configured before a single real event is ever delivered — no silent failures.
- **Three outbound auth modes**—No Auth, API Key, and OAuth 2.0—give you flexibility to match whatever security model your receiving endpoint requires.
- **All secrets are encrypted at rest** (AES-CBC) and never returned in plain text after registration.
- **Zero-downtime secret rotation** is a first-class feature: use `secondarySecret` to run old and new keys in parallel, then promote and retire cleanly.
- **Always use constant-time comparison** (`hmac.Equal`, `hmac.compare_digest`) when validating signatures on your endpoint to prevent timing attacks.

Webhook security done right protects your integrations, your customers, and your data. With GreenLake webhooks, the building blocks are already there — you just need to wire them up correctly.
