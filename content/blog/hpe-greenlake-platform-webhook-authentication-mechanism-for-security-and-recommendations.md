---
title: HPE GreenLake Platform Webhook authentication mechanism for security and
  recommendations
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

Have you ever built an integration that receives webhook events, only to realize you have no way to verify the payload actually came from the source you trust — and not a malicious third party? Or perhaps you've needed to rotate your webhook secret without any downtime, leaving a window where events could be missed or rejected? Securing webhook endpoints is one of those challenges that looks simple on the surface but quickly becomes complex when you factor in authentication, payload integrity, key rotation, and endpoint verification.

In this blog post, I'll walk you through how HPE GreenLake Events API approaches webhook security end-to-end — from registering a webhook with HMAC-SHA256 signature verification, to supporting multiple authentication schemes (OAuth 2.0, API Key, and no-auth), to performing zero-downtime secret rotation using a dual-secret model. By the end, you'll have a clear understanding of how to register, authenticate, and verify webhooks securely, and how to rotate secrets in production without dropping a single event.

## Table of Contents

- [Setting Up Webhook Authentication on HPE GreenLake Events API](#setting-up-webhook-authentication-on-hpe-greenlake-events-api)
- [Prerequisites](#prerequisites)
- [Step 1 — Choose Your Authentication Type](#step-1--choose-your-authentication-type)
- [Step 2 — Register a Webhook with HMAC Secret](#step-2--register-a-webhook-with-hmac-secret)
- [Step 3 — Handle the Challenge Verification Request](#step-3--handle-the-challenge-verification-request)
- [Step 4 — Register a Webhook with OAuth 2.0 Authentication](#step-4--register-a-webhook-with-oauth-20-authentication)
- [Step 5 — Register a Webhook with API Key Authentication](#step-5--register-a-webhook-with-api-key-authentication)
- [Step 6 — Verifying Payload Signatures on Every Delivery](#step-6--verifying-payload-signatures-on-every-delivery)
- [Step 7 — Zero-Downtime Secret Rotation with secondarySecret](#step-7--zero-downtime-secret-rotation-with-secondarysecret)
- [Step 8 — Manually Re-trigger Verification](#step-8--manually-re-trigger-verification)
- [Summary](#summary)

## Setting Up Webhook Authentication on HPE GreenLake Events API

### Prerequisites

Before you begin, make sure you have:

1. An active HPE GreenLake account with a workspace
2. A publicly accessible HTTPS endpoint to receive webhook events (your destination URL)
3. An access token for API authentication (obtained via the HPE GreenLake IAM service)
4. curl or any HTTP client (Postman, etc.) for making API calls

### Step 1 — Choose Your Authentication Type

The HPE GreenLake Events API supports three outbound authentication modes that control how the service authenticates itself when delivering events to your endpoint:

|   AuthType  |  When to Use |
|----------|-------------|
| `""` (empty)   |     Your endpoint is open or handles auth independently |
| `"APIKey"` | Your endpoint expects a static key in the Authorization header |
| `"Oauth"` | Your endpoint is protected by an OAuth 2.0 client credentials flow |

> **Note:** Regardless of authType, all webhooks use HMAC-SHA256 signatures so your endpoint can verify payload integrity. authType only governs how the delivery service authenticates outbound requests to your URL.

### Step 2 — Register a Webhook with HMAC Secret

Every webhook requires a secret — a shared key used to compute HMAC-SHA256 signatures over event payloads. Your endpoint uses this secret to independently verify that each delivery is authentic.

**Request:**

```bash
curl -X POST https://global.api.greenlake.hpe.com/events/v1beta1/workspaces/{workspaceId}/webhooks \
  -H "Authorization: Bearer <your-access-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "my-webhook",
    "destination": "https://your-endpoint.example.com/events",
    "secret": "my-super-secret-hmac-key",
    "authType": "",
    "challengeRequestEnabled": true
  }'
```

**Key fields:**

- **secret** — Your HMAC signing key. Store this securely; it is encrypted at rest using AES-CBC on the server side and never returned in plain text after creation.
- **challengeRequestEnabled** — When true (the default), the service immediately sends a challenge verification request to your destination URL to confirm it is reachable and correctly configured before activating the webhook.
- **destination** — Must be an HTTPS URL. Private/internal IP ranges are blocked.

**Successful response (201 Created):**

```json
{
  "id": "a1b2c3d4-...",
  "name": "my-webhook",
  "destination": "https://your-endpoint.example.com/events",
  "authType": "",
  "status": "pending_verification",
  "challengeRequestEnabled": true,
  "createdAt": "2026-04-20T10:00:00Z"
}
```

### Step 3 — Handle the Challenge Verification Request

When `challengeRequestEnabled` is true, the service immediately sends a CloudEvents-formatted verification request to your destination URL. Your endpoint must respond correctly or the webhook will remain in `pending_verification` status and no events will be delivered.

**What your endpoint receives (POST):**

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

**What your endpoint must respond:**

Compute an HMAC-SHA256 over the `challengeRequest` value using your secret, then return it:

```json
{
  "verification": "<hmac-sha256-hex-of-challengeRequest>"
}
```

**Example implementation (Go):**

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

**Example implementation (Python):**

```python
import hmac, hashlib

def compute_hmac(data: str, secret: str) -> str:
    return hmac.new(
        secret.encode(), data.encode(), hashlib.sha256
    ).hexdigest()
```

Once the service receives a matching HMAC response, the webhook status transitions to **active** and event delivery begins.

### Step 4 — Register a Webhook with OAuth 2.0 Authentication

If your endpoint is protected by OAuth 2.0, provide the client credentials so the service can obtain a bearer token before each delivery batch:

```bash
curl -X POST https://global.api.greenlake.hpe.com/events/v1beta1/workspaces/{workspaceId}/webhooks \
  -H "Authorization: Bearer <your-access-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "my-oauth-webhook",
    "destination": "https://your-endpoint.example.com/events",
    "secret": "my-hmac-secret",
    "authType": "Oauth",
    "clientId": "your-client-id",
    "clientSecret": "your-client-secret",
    "issuerUrl": "https://your-auth-server.example.com/oauth2/token",
    "challengeRequestEnabled": true
  }'
```

1. The service performs a `client_credentials` grant against your `issuerUrl` to obtain a bearer token.
2. The token is cached (keyed by webhook ID) and reused until expiry, minimising token requests.
3. The `clientSecret` is encrypted at rest using AES-CBC — it is never stored in plain text.
4. On delivery, the request to your endpoint includes: `Authorization: Bearer <access_token>`

### Step 5 — Register a Webhook with API Key Authentication

For simpler endpoints that use a static API key:

```bash
curl -X POST https://global.api.greenlake.hpe.com/events/v1beta1/workspaces/{workspaceId}/webhooks \
  -H "Authorization: Bearer <your-access-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "my-apikey-webhook",
    "destination": "https://your-endpoint.example.com/events",
    "secret": "my-hmac-secret",
    "authType": "APIKey",
    "apiKey": "your-static-api-key",
    "challengeRequestEnabled": true
  }'
```

- The `apiKey` value is sent as `Authorization: <api-key-value>` on every delivery request.
- The `apiKey` is encrypted at rest using AES-CBC.

### Step 6 — Verifying Payload Signatures on Every Delivery

Beyond challenge verification, every event delivery is signed with HMAC-SHA256. Your endpoint should always validate the signature on incoming requests to guard against spoofed payloads.

**How it works:**

1. The service computes `HMAC-SHA256(payload, secret)` and includes it in the delivery request header.
2. Your endpoint independently computes the same HMAC and compares.
3. If signatures match — the payload is authentic.

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

> **Security tip:** Always use a constant-time comparison (e.g., `hmac.Equal` in Go, `hmac.compare_digest` in Python) to prevent timing side-channel attacks.

### Step 7 — Zero-Downtime Secret Rotation with secondarySecret

When you need to rotate your HMAC secret without dropping events, use the dual-secret model:

#### Phase 1 — Add the new secret as secondarySecret:

```bash
curl -X PATCH https://global.api.greenlake.hpe.com/events/v1beta1/workspaces/{workspaceId}/webhooks/{webhookId} \
  -H "Authorization: Bearer <your-access-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "secondarySecret": "my-new-hmac-secret"
  }'
```

During this phase, the service accepts challenge/HMAC responses signed with either the old primary secret or the new secondary secret. Deploy your endpoint changes to start accepting both.

#### Phase 2 — Promote the new secret to primary:

```bash
curl -X PATCH https://global.api.greenlake.hpe.com/events/v1beta1/workspaces/{workspaceId}/webhooks/{webhookId} \
  -H "Authorization: Bearer <your-access-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "secret": "my-new-hmac-secret",
    "secondarySecret": ""
  }'
```

Once `secondarySecret` is cleared, only the new primary secret is accepted. The old secret is fully retired with zero downtime and no missed events.

### Step 8 — Manually Re-trigger Verification

If your endpoint was temporarily unavailable during initial registration, you can manually re-trigger the challenge verification at any time:

```bash
curl -X POST https://global.api.greenlake.hpe.com/events/v1beta1/workspaces/{workspaceId}/webhooks/{webhookId}/verify \
  -H "Authorization: Bearer <your-access-token>"
```

This re-sends the challenge CloudEvent to your destination URL and transitions the webhook back to **active** upon success.

## Summary

### Key Takeaways

Securing webhooks isn't just about locking the front door — it's about verifying who's knocking, confirming the message wasn't tampered with, and being able to change the locks without anyone noticing. Here's what we covered:

- **HMAC-SHA256 signatures** are the foundation of webhook payload integrity on HPE GreenLake Events API — every webhook requires a secret, and every delivery is signed with it.
- **Challenge verification** ensures your endpoint is reachable and correctly configured before a single real event is ever delivered — no silent failures.
- **Three outbound auth modes** — No Auth, API Key, and OAuth 2.0 — give you flexibility to match whatever security model your receiving endpoint requires.
- **All secrets are encrypted at rest** (AES-CBC) and never returned in plain text after registration.
- **Zero-downtime secret rotation** is a first-class feature: use `secondarySecret` to run old and new keys in parallel, then promote and retire cleanly.
- **Always use constant-time comparison** (`hmac.Equal`, `hmac.compare_digest`) when validating signatures on your endpoint to prevent timing attacks.

Webhook security done right protects your integrations, your customers, and your data. With HPE GreenLake Events API, the building blocks are already there — you just need to wire them up correctly.
