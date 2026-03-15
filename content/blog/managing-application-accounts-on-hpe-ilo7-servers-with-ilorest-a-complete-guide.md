---
title: Managing Application Accounts on HPE iLO7+ Servers with ilorest — A
  Complete Guide
date: 2026-03-15T14:32:16.161Z
featuredBlog: true
author: Rajeev Kallur
authorimage: /img/rajeev_new.jpg
disable: false
tags:
  - appaccount
  - ilorest
  - application account
  - iLO7
  - ilorest 7.x
---

## Introduction

Starting with **iLO7**, HPE introduced a new security paradigm for host-based applications that need to communicate with the Integrated Lights-Out (iLO) management processor: **Application Accounts** (appaccounts). Unlike traditional iLO user accounts that humans use to log in via the iLO web GUI or SSH, application accounts are purpose-built credentials that allow *software running on the host OS* to authenticate with iLO securely — with the secret material stored inside the server's **Trusted Platform Module (TPM)**.

The `ilorest` command-line tool provides a dedicated `appaccount` command that lets administrators create, delete, check the existence of, view details of, and reactivate these application accounts. This guide walks through every capability in depth, with real-world examples and explanations of the internal mechanics.

---

## Terminology: Application Account vs. Application Token

Before diving in, it's important to understand two related but distinct concepts:

| Term                                   | What It Is                                                                                         | Where It Lives        | Lifecycle                                  |
|:---------------------------------------|:---------------------------------------------------------------------------------------------------|:----------------------|:-------------------------------------------|
| **Application Account** (appaccount)   | The application's identity record in iLO. Includes app name, ID, and authorization configuration.  | **iLO** (Redfish API) | Created / deleted explicitly by the admin  |
| **Application Token** (apptoken)       | The cryptographic secret the application uses to authenticate. Has a **defined lifespan**.          | **TPM** (hardware)    | Created with the account; expires and is renewed via `reactivate` |

**When to use which term:**

- Use **`appaccount create`** / **`appaccount delete`** when you're managing the *full lifecycle* of an application's registration — creating or removing it from both TPM and iLO.
- Use **`appaccount reactivate`** when the *token has expired* but the account itself is still valid — you're renewing the secret, not recreating the account.
- Use **`appaccount exists`** / **`appaccount details`** to inspect the state of accounts and their tokens across both stores.

Think of it this way: the **appaccount** is the "identity card" and the **apptoken** is the "password" on that card. The card persists, but the password expires and needs periodic renewal.

---

## Which Applications Are Supported?

> **Important:** As of today, application accounts can only be created for the following HPE-recognized applications:
>
> | Application                      | Description                                    |
> |:---------------------------------|:-----------------------------------------------|
> | **SUM** (Smart Update Manager)   | HPE's firmware and driver update tool          |
> | **SUT** (Smart Update Tools)     | Automated OS-level update agent                |
> | **AMS** (Agentless Mgmt Service) | Collects host OS information for iLO           |
> | **iLORest** (self-registered)    | HPE's RESTful Interface Tool itself            |
>
> **Custom or third-party applications are not yet supported.** You cannot register an arbitrary application with its own `hostappid` / `hostappname` / `salt` unless it is one of the recognized HPE tools listed above. If you attempt to create an account for an unrecognized application, the operation will be rejected.
>
> When using the `--self` flag, ilorest creates a self-registered account with the reserved ID prefix `00b5`, which is exclusively allocated to ilorest's own self-registration mechanism.

---

## Prerequisites

Before running any `appaccount` command, ensure the following:

1. **iLO7 or later firmware** is installed on the server. The command explicitly checks the iLO generation and will fail with an `IncompatibleiLOVersionError` on iLO5 or iLO6.
2. **Virtual NIC (VNIC) is enabled** in iLO. All appaccount operations communicate with iLO over the internal VNIC interface at `https://16.1.15.1`. If VNIC is not enabled or misconfigured, you will see a `VnicExistsError`.
3. **Root or Administrator privileges** are required on the host OS. The command checks for `root` on Linux and `Administrator` on Windows; unprivileged users are blocked with a `UserNotAdminError`.
4. **iLO Administrator credentials** (`-u` / `-p`) are required for create, reactivate, and delete operations. Even for self-registered account deletion, credentials are strongly recommended to ensure the account is fully removed from both TPM and iLO (see the detailed explanation under the Delete section).

> **Note on CHIF vs. VNIC:** The CHIF (Channel Interface) driver used in iLO5 and iLO6 is **not exposed in iLO7**. All host-to-iLO communication on iLO7 is performed exclusively through the **VNIC (Virtual NIC)** interface. The appaccount command uses the VNIC for both local TPM operations and iLO REST API calls.

---

## Understanding Dual Storage: TPM + iLO

Every application account lives in **two places simultaneously**:

| Storage                     | What It Holds                                                                        | Access Mechanism                                    |
|:----------------------------|:-------------------------------------------------------------------------------------|:----------------------------------------------------|
| **TPM** (Trusted Platform Module) | The **apptoken** — cryptographic secret for authentication. Has an expiry lifecycle. | VNIC driver call from the host OS (no REST auth needed) |
| **iLO** (Redfish REST API)  | The **appaccount** — identity record iLO uses to authorize REST API requests.        | Authenticated REST session (username + password)    |

This distinction is critical: **TPM operations are local VNIC driver calls** that don't require iLO REST authentication, while **iLO-side operations always require a valid authenticated REST session**. This has real implications for commands like `delete --self`, as explained below.

When everything is in sync, both locations agree. But situations like a **TPM clear** can cause the two to go out of sync — the appaccount still exists in iLO but the apptoken is no longer in TPM. The `appaccount` command handles these **orphaned accounts** transparently during the `create` workflow.

---

## Subcommands at a Glance

| Subcommand     | Purpose                                                                                  | Requires `-u` / `-p`?                            |
|:---------------|:-----------------------------------------------------------------------------------------|:--------------------------------------------------|
| `create`       | Create a new appaccount (apptoken in TPM + appaccount in iLO). Silently cleans up orphans. | **Yes** — always                                |
| `delete`       | Remove an appaccount from both TPM and iLO                                               | **Yes** — always recommended                      |
| `exists`       | Check whether an appaccount / apptoken exists in TPM or iLO                              | No                                                |
| `details`      | List all appaccounts with their TPM / iLO presence status                                | No (more complete with credentials)               |
| `reactivate`   | Renew an **expired apptoken** in TPM (token rotation). Does **not** handle orphans.      | **Yes** — always                                  |

> **Note on `delete --self`:** The CLI allows running `delete --self` without credentials, but this is **not recommended**. Without credentials, only the TPM token is deleted. The iLO-side account **cannot** be removed without an authenticated REST session, leaving an **orphaned account in iLO**. Always provide `-u` and `-p` for a complete deletion.

---

## 1. Creating an Application Account (`appaccount create`)

### What It Does

The `create` subcommand generates a new apptoken and saves it in TPM, while simultaneously registering the corresponding appaccount in iLO. This is the primary way to set up application-level authentication.

Behind the scenes, the command:

1. **Validates prerequisites** — checks for root/admin, VNIC access, iLO7+.
2. **Silently handles orphans** — if a previous account with the same ID exists in iLO but *not* in TPM (e.g., after a TPM clear), the command **automatically and silently cleans up** the stale iLO account, then proceeds to create a fresh account in both stores as if nothing happened. The user sees only the success message — no extra steps are required.
3. **Generates and saves** — calls `generate_save_token()` to create the apptoken in TPM and register the appaccount in iLO in a single operation.

### Why `create` Is the Recommended Recovery Path After TPM Clear

After a TPM clear, all apptokens are wiped but the corresponding appaccounts remain in iLO (orphaned). Rather than requiring a manual delete-then-create sequence, the `create` command detects this situation automatically:

```
TPM clear occurs → apptokens wiped → appaccounts remain in iLO (orphaned)
                                        ↓
         ilorest appaccount create (with same parameters)
                                        ↓
         Orphaned iLO account silently deleted → fresh account created in both TPM and iLO
                                        ↓
         "Application account has been generated and saved successfully."
```

The user doesn't need to know about the orphan — `create` handles it transparently.

### Syntax

There are two modes:

#### Mode 1: Named Application (for SUM, SUT, or AMS)

```
ilorest appaccount create --hostappname <name> --hostappid <id> --salt <salt> -u <ilo_user> -p <ilo_password>
```

All three parameters (`--hostappname`, `--hostappid`, `--salt`) are **mandatory** in this mode. They must correspond to one of the recognized HPE applications (SUM, SUT, AMS). The `hostappid` is a hex string of 4 or more characters that uniquely identifies the application.

**Example — Creating an account for SUM:**

```shell
ilorest appaccount create --hostappname SUM --hostappid a1b2c3d4 --salt sumsecret -u admin -p iLOpassw0rd
```

**Expected output:**
```
Application account has been generated and saved successfully.
```

#### Mode 2: Self-Registration (for ilorest itself)

```
ilorest appaccount create --self -u <ilo_user> -p <ilo_password>
```

The `--self` flag tells ilorest to create an account for *itself*, using the reserved ID prefix `00b5`. You **cannot** combine `--self` with `--hostappname`, `--hostappid`, or `--salt` — doing so will produce an error.

**Example — Self-registering ilorest:**

```shell
ilorest appaccount create --self -u admin -p iLOpassw0rd
```

**Expected output:**
```
Application account has been generated and saved successfully.
```

### What If the Account Already Exists?

If you try to create an account that already exists in both TPM and iLO, the command does **not** fail — it simply informs you:

```
Application account already exists for the specified host application.
```

### Error Scenarios

| Error                          | Meaning                                                                  |
|:-------------------------------|:-------------------------------------------------------------------------|
| `SavinginTPMError`             | The apptoken could not be written to TPM. Delete the account and retry.  |
| `SavinginiLOError`             | The appaccount could not be registered in iLO. Delete and retry.         |
| `InvalidCredentialsError`      | The iLO username / password is wrong.                                    |
| `GenerateAndSaveAccountError`  | A general failure occurred during generation. Retry later.               |

In all failure cases, the error message also suggests: *"Alternatively, you can use the `--no_app_account` option in the Login Command to log in using your iLO user account credentials."*

---

## 2. Deleting an Application Account (`appaccount delete`)

### What It Does

The `delete` subcommand removes an application account from **both** TPM (the apptoken) and iLO (the appaccount). The command follows a two-step process:

1. **Delete the apptoken from TPM** — removes the cryptographic secret via a VNIC driver call. This does **not** require iLO REST authentication.
2. **Delete the appaccount from iLO** — removes the account via an authenticated `DELETE` call to `/redfish/v1/AccountService/Oem/Hpe/AppAccounts/<id>`. This **requires a valid iLO REST session**.

If the account exists in only one location (e.g., iLO but not TPM after a TPM clear), the command still succeeds as long as it was removed from at least one.

### Why Credentials Are Always Recommended

iLO does not allow any modifications to its REST API resources without authentication. This means:

- **TPM deletion** (apptoken) works without credentials — it's a local VNIC driver operation.
- **iLO deletion** (appaccount) requires credentials to create a REST session, query the account list, and perform the DELETE call.

If you run `delete --self` without `-u` / `-p`, the command will:
1. ✅ Successfully delete the apptoken from TPM.
2. ❌ **Silently skip** the iLO-side appaccount deletion (no REST session available).
3. ✅ Report "success" because the TPM deletion succeeded.

**The result is an orphaned appaccount left in iLO.** While this orphan is harmless (it can't be used without the matching TPM token) and will be silently cleaned up by a subsequent `create`, it clutters the account list. To ensure a **clean, immediate deletion**, always provide credentials.

### Credential Rules

- **Deleting another application's account** (e.g., SUM, SUT, AMS): iLO Administrator credentials (`-u` and `-p`) are **mandatory**. The command will reject the request without them.
- **Deleting your own self-registered account** (`--self` or ID containing `00b5`): Credentials are not enforced by the CLI, but are **strongly recommended** for a complete deletion.

### Short ID Expansion

When you provide a 4-character `hostappid`, the command automatically expands it to the full ID using the `ExpandAppId()` function. This makes it convenient to use the short IDs shown in the `details` output.

### Examples

**Delete a SUT account (credentials required):**

```shell
ilorest appaccount delete --hostappid a1b2 -u admin -p iLOpassw0rd
```

**Delete the ilorest self-registered account (credentials recommended):**

```shell
ilorest appaccount delete --self -u admin -p iLOpassw0rd
```

**Expected output on success:**
```
Application account has been deleted successfully.
```

**If the account does not exist:**
```
The application account you are trying to delete does not exist.
```

---

## 3. Checking If an Application Account Exists (`appaccount exists`)

### What It Does

The `exists` subcommand checks whether an appaccount/apptoken is present in **either** TPM or iLO (or both). It is a read-only operation.

Internally, it:

1. Expands a short (4-char) `hostappid` to the full ID if possible.
2. Checks for the apptoken in **TPM** (this also detects *expired/inactive* tokens — they still "exist").
3. Checks for the appaccount in **iLO** by querying the REST API (requires credentials for a complete check).

If found in either location, the account is reported as existing.

> **Note:** Without credentials, only the TPM check is performed. Provide `-u` / `-p` for a complete existence check across both stores.

### Examples

**Check by application ID:**

```shell
ilorest appaccount exists --hostappid a1b2
```

**Check the self-registered ilorest account:**

```shell
ilorest appaccount exists --self
```

**Output when found:**
```
Application account exists for this host application.
```

**Output when not found:**
```
Application account does not exist for this hostapp.
```

The command returns a distinct exit code (`ACCOUNT_DOES_NOT_EXIST_ERROR`) when the account is not found, which is useful for scripting and automation.

---

## 4. Viewing Application Account Details (`appaccount details`)

### What It Does

The `details` subcommand provides a **consolidated view** of all application accounts, showing which ones have apptokens in TPM, appaccounts in iLO, or both. This is the most powerful diagnostic tool for understanding the state of appaccounts on a server.

Internally, the command:

1. Calls `ListAppIds()` to enumerate all apptokens known to TPM.
2. Queries the iLO REST API at `/redfish/v1/AccountService/Oem/Hpe/AppAccounts/` to find accounts registered in iLO.
3. **Merges** the two lists — any appaccount found only in iLO (orphaned after a TPM clear) is included with `ExistsInTPM: no`.

> **Note:** Without credentials, only TPM-side data is returned. Providing `-u` / `-p` enables the iLO REST query, giving you the complete picture.

### Viewing All Accounts

```shell
ilorest appaccount details --hostappid all -u admin -p iLOpassw0rd
```

**Sample output (table format):**
```
Application Name: SUM
Application Id: **c3d4
App account exists in TPM: yes
App account exists in iLO: yes

Application Name: SUT
Application Id: **e5f6
App account exists in TPM: yes
App account exists in iLO: yes

Application Name: ilorest
Application Id: **00b5
App account exists in TPM: yes
App account exists in iLO: yes
```

> **Security note:** Application IDs are **masked** — only the last 4 characters are shown, prefixed with `**`.

### JSON Output (for scripting and automation)

```shell
ilorest appaccount details --hostappid all --json -u admin -p iLOpassw0rd
```

**Sample JSON output:**
```json
[
  {
    "ApplicationName": "SUM",
    "ApplicationID": "**c3d4",
    "ExistsInTPM": true,
    "ExistsIniLO": true
  },
  {
    "ApplicationName": "SUT",
    "ApplicationID": "**e5f6",
    "ExistsInTPM": true,
    "ExistsIniLO": true
  }
]
```

### Filtering: TPM-Only or iLO-Only

**Show only apptoken (TPM) status:**
```shell
ilorest appaccount details --hostappid all --only_token
```

**Show only appaccount (iLO) status:**
```shell
ilorest appaccount details --hostappid all --only_account -u admin -p iLOpassw0rd
```

### Viewing a Specific Account

```shell
ilorest appaccount details --hostappid a1b2
```

Supports both 4-char short IDs and full IDs.

### Viewing the Self-Registered Account

```shell
ilorest appaccount details --self
```

If no self-registered account exists:
```
No self-registered iLORest app account found.
Use 'appaccount details --hostappid all' to see all app accounts.
```

### Detecting Orphaned Accounts

After a TPM clear, you might see:

```
Application Name: SUM
Application Id: **c3d4
App account exists in TPM: no
App account exists in iLO: yes
```

This tells you the SUM apptoken has been wiped from TPM but the appaccount persists in iLO. To restore it, simply run `appaccount create` with the same parameters — the orphaned iLO account will be cleaned up automatically and silently.

---

## 5. Reactivating an Expired Token (`appaccount reactivate`)

### What It Does

The `reactivate` subcommand is designed **exclusively** for renewing **expired or inactive apptokens** as part of the token **expiry and rotation** lifecycle. Application tokens stored in TPM have a defined lifespan. When a token expires, the application can no longer authenticate with iLO. The `reactivate` command renews the token in place without requiring a full delete-and-recreate cycle.

### What Reactivate Does NOT Do

- ❌ **Does not handle orphaned accounts.** If the apptoken has been removed from TPM entirely (e.g., after a TPM clear), `reactivate` will fail with an error. Use `appaccount create` instead — it handles orphan cleanup automatically and silently.
- ❌ **Does not create new accounts.** It only renews existing, expired tokens.
- ❌ **Does not modify the iLO-side appaccount.** Only the TPM-side apptoken is renewed.

### When to Use Reactivate vs. Create

| Scenario                              | What Happened                                 | Recommended Command                                       |
|:--------------------------------------|:----------------------------------------------|:----------------------------------------------------------|
| Token expired (still in TPM)          | Apptoken's lifespan has elapsed               | `appaccount reactivate`                                   |
| Periodic token rotation               | Scheduled credential renewal                  | `appaccount reactivate`                                   |
| TPM was cleared (orphan in iLO)       | Apptoken wiped; appaccount remains in iLO     | `appaccount create` (silently cleans up the orphan)       |
| Account does not exist at all         | Fresh setup                                   | `appaccount create`                                       |
| Account needs to be removed           | Decommissioning an application                | `appaccount delete`                                       |

### How It Works Internally

1. Checks whether the apptoken exists in TPM. The `_check_exists_in_tpm()` function returns `True` for both active and inactive/expired tokens — an expired token still *exists*, it's just no longer valid for authentication.
2. If the token does **not** exist in TPM at all (it was wiped, not just expired), the command raises an error and directs the user to use `create` instead.
3. If the token exists but is expired/inactive, it calls `reactivate_token()` to renew it in place.

### Syntax

```
ilorest appaccount reactivate --hostappname <name> --hostappid <id> --salt <salt> -u <ilo_user> -p <ilo_password>
```

Or for self-registered:

```
ilorest appaccount reactivate --self -u <ilo_user> -p <ilo_password>
```

iLO Administrator credentials are **always** required — no exceptions.

### Examples

**Reactivate an expired SUM token:**

```shell
ilorest appaccount reactivate --hostappname SUM --hostappid a1b2c3d4 --salt sumsecret -u admin -p iLOpassw0rd
```

**Output on success:**
```
Application account has been reactivated successfully.
```

**If the token doesn't exist in TPM (e.g., after TPM clear):**
```
The application account you are trying to reactivate does not exist.
If the account was orphaned after a TPM clear, please use 'appaccount delete' followed by 'appaccount create' to recreate it.
```

> **Tip:** If you see this error after a TPM clear, just run `appaccount create` with the same parameters. It will silently clean up the orphaned iLO account and create everything fresh.

---

## Orphaned Accounts: What They Are and How They're Handled

### What Is an Orphaned Account?

An orphaned account is one where the **appaccount exists in iLO** but the **apptoken is missing from TPM**. The account can't be used for authentication because the secret is gone.

### How Orphans Occur

| Trigger                                 | Result                                                                       |
|:----------------------------------------|:-----------------------------------------------------------------------------|
| TPM clear (via BIOS or iLO)            | All apptokens wiped from TPM; appaccounts remain in iLO                      |
| Failed creation (partial write)         | Apptoken may exist in TPM but not in iLO, or vice versa                      |
| Deleting `--self` without credentials   | Apptoken removed from TPM; appaccount left in iLO (no REST session)          |

### How the Tool Handles Orphans

The `create` command is the **primary and recommended recovery mechanism** for orphaned accounts. When you run `create` for an application that has an orphaned account:

1. It detects that the appaccount exists in iLO but the apptoken is missing from TPM.
2. It **silently deletes** the orphaned appaccount from iLO.
3. It creates a fresh apptoken in TPM and a fresh appaccount in iLO.
4. The user sees only: `"Application account has been generated and saved successfully."`

**No manual cleanup is required.** The entire orphan recovery is invisible to the user.

### Summary by Subcommand

| Subcommand     | Orphan Behavior                                                                                                     |
|:---------------|:--------------------------------------------------------------------------------------------------------------------|
| `create`       | **Silently cleans up** the orphaned iLO account, then creates fresh in both stores. User sees a normal success message. |
| `delete`       | Attempts deletion from both TPM and iLO independently. Succeeds if removed from at least one.                       |
| `details`      | Shows orphans clearly — `ExistsInTPM: no` alongside `ExistsIniLO: yes`.                                            |
| `exists`       | Reports the account as existing if found in either store.                                                           |
| `reactivate`   | **Does not handle orphans.** Fails if the apptoken is missing from TPM. Only works on expired tokens still in TPM.  |

---

## Credential Encoding Support

For security-sensitive automation pipelines, the `appaccount` command supports **encoded credentials**. When the `--encode` flag is active, the provided `-u` (username) and `-p` (password) values are treated as encoded strings and decoded internally using the `Encryption.decode_credentials()` utility before use.

This prevents plaintext passwords from appearing in process listings, shell history, or CI/CD logs.

---

## Session Management Under the Hood

The `appaccount` command communicates with iLO in two fundamentally different ways:

### 1. VNIC Driver Calls (for TPM operations)

Operations like `generate_save_token`, `delete_token`, `token_exists`, `reactivate_token`, and `ListAppIds` are performed through the **VNIC driver** — a direct host-to-iLO channel that does not go through the REST API. These calls do not require REST authentication.

> **Note:** In iLO7, the CHIF (Channel Interface) driver used in iLO5/iLO6 is **not available**. All host-to-iLO communication is through VNIC exclusively.

### 2. Redfish REST API over VNIC (for iLO account operations)

Querying, creating, and deleting appaccounts in iLO is done via the Redfish REST API at `https://16.1.15.1` (the VNIC IP). **iLO requires authentication for all REST API operations** — both reads and writes.

Since `appaccount` runs without a prior `ilorest login` session, it creates **temporary REST sessions** on demand:

- `_create_ilo_session()` — POSTs to `/redfish/v1/SessionService/Sessions/` with the provided credentials, obtaining an `X-Auth-Token`.
- `_delete_ilo_session()` — DELETEs the session when done.

These temporary sessions are always cleaned up in a `finally` block, even if an error occurs — preventing session exhaustion on iLO.

> **Key takeaway:** Any operation that touches the iLO REST API (create, delete from iLO, details with iLO data, orphan cleanup) requires credentials. Operations that only touch TPM (token existence check, token deletion, token reactivation) use the VNIC driver and don't need REST credentials — though the CLI still requires them for create and reactivate to ensure the full operation succeeds.

---

## Quick Reference: Common Workflows

### Workflow 1: First-Time Setup of ilorest Self-Registration

```shell
# Create the self-registered account (credentials required)
ilorest appaccount create --self -u admin -p iLOpassw0rd

# Verify it was created
ilorest appaccount exists --self

# View the details
ilorest appaccount details --self
```

### Workflow 2: Recovery After TPM Clear

No manual cleanup needed — just re-run `create`. Orphans are handled silently.

```shell
# Simply recreate the account (orphaned iLO account is cleaned up automatically)
ilorest appaccount create --hostappname SUM --hostappid a1b2c3d4 --salt sumsecret -u admin -p iLOpassw0rd

# Verify recovery
ilorest appaccount details --hostappid a1b2 -u admin -p iLOpassw0rd
```

### Workflow 3: Token Expiry — Reactivating an Expired Token

```shell
# Reactivate the expired token (token must still exist in TPM, just expired)
ilorest appaccount reactivate --hostappname SUM --hostappid a1b2c3d4 --salt sumsecret -u admin -p iLOpassw0rd

# Verify the account is active
ilorest appaccount exists --hostappid a1b2
```

### Workflow 4: Audit and Cleanup

```shell
# List all accounts in JSON (credentials enable iLO-side data)
ilorest appaccount details --hostappid all --json -u admin -p iLOpassw0rd

# Delete a stale account (credentials required for iLO-side removal)
ilorest appaccount delete --hostappid e5f6 -u admin -p iLOpassw0rd

# Confirm deletion
ilorest appaccount exists --hostappid e5f6
```

### Workflow 5: Deleting the Self-Registered Account

```shell
# Always provide credentials for a complete deletion from both TPM and iLO
ilorest appaccount delete --self -u admin -p iLOpassw0rd

# Verify
ilorest appaccount exists --self
```

> ⚠️ **Reminder:** Running `delete --self` without credentials only removes the apptoken from TPM. The appaccount in iLO will remain as an orphan until the next `create --self` silently cleans it up. Always include credentials for an immediate, complete deletion.

---

## Error Reference

| Error                              | Cause                                                       | Resolution                                              |
|:-----------------------------------|:------------------------------------------------------------|:--------------------------------------------------------|
| `IncompatibleiLOVersionError`      | Running on iLO5 or iLO6                                    | Upgrade to iLO7 firmware                                |
| `VnicExistsError`                  | VNIC not enabled or misconfigured                           | Enable VNIC in iLO settings; verify host OS NIC config  |
| `UserNotAdminError`                | Not running as root / Administrator                         | Use `sudo` (Linux) or run as Administrator (Windows)    |
| `UsernamePasswordRequiredError`    | Missing `-u` or `-p` for a command that requires them       | Provide iLO admin credentials                           |
| `InvalidCommandLineError`         | Wrong flag combination (e.g., `--self` with `--hostappid`)  | Check syntax; use `-h` for help                         |
| `NoAppAccountError`               | Account / token not found for the given ID                  | Verify `hostappid`; use `create` if the token was wiped |
| `SavinginTPMError`                | TPM write failed during creation                            | Delete the account and retry                            |
| `SavinginiLOError`                | iLO REST API write failed during creation                   | Delete the account and retry                            |
| `AppAccountExistsError`           | Account already exists (create) or ID not found (details)   | Use `exists` to verify; delete first if needed          |
| `ReactivateAppAccountTokenError`  | Token reactivation failed                                   | Retry; check iLO logs for details                       |
| `GenBeforeLoginError`             | Cannot determine iLO version                                | Ensure VNIC is enabled on the iLO7 server               |

---

## Security Best Practices

1. **Always provide iLO credentials** for create, delete, and reactivate operations to ensure both TPM and iLO stay in sync.
2. **Never embed plaintext credentials in scripts.** Use the `--encode` flag or integrate with a secrets manager.
3. **Audit appaccounts regularly.** Use `appaccount details --hostappid all --json -u admin -p <password>` and feed the output into your SIEM or compliance tools.
4. **Clean up unused accounts.** If an application (e.g., SUM) is no longer deployed on a server, delete its appaccount with credentials.
5. **After TPM clear, just re-run `create`.** The command silently handles orphaned iLO accounts — no manual cleanup needed.
6. **Monitor token expiry.** When an application suddenly fails to authenticate with iLO, check if its apptoken has expired using `appaccount details` and reactivate if needed.
7. **Restrict iLO admin credentials.** Only users who manage appaccounts should have iLO admin access.

---

## Conclusion

The `appaccount` command in ilorest is a powerful, security-first tool for managing application-level authentication on iLO7+ servers. By leveraging dual storage — **apptokens in TPM** for hardware-backed secret security and **appaccounts in iLO** for REST API authorization — it provides a robust foundation for automated server management.

Key strengths of the design include:

- **Transparent orphan recovery** — the `create` command silently cleans up stale iLO accounts after a TPM clear, requiring no manual intervention.
- **Token lifecycle management** — the `reactivate` command handles token expiry and rotation without disrupting the account.
- **Comprehensive diagnostics** — the `details` command provides a unified view of both stores, making it easy to spot inconsistencies.

Currently limited to **SUM, SUT, AMS, and ilorest** (with custom application support not yet available), it covers the core HPE management stack comprehensively. Whether you're automating firmware updates with SUM, collecting host data with AMS, or scripting iLO configuration with ilorest, the `appaccount` command ensures your application credentials are secure, auditable, and recoverable.

---

## Get Started Today

Ready to secure your iLO7 application authentication? Here's how to take the first step:

1. **Verify your environment** — Confirm that your server is running iLO7 firmware and that VNIC is enabled.
2. **Create your first appaccount** — Run `ilorest appaccount create --self -u <admin> -p <password>` to register ilorest itself.
3. **Audit your existing accounts** — Run `ilorest appaccount details --hostappid all --json -u <admin> -p <password>` to see what's already registered.
4. **Integrate into your automation** — Add appaccount create/delete steps to your provisioning scripts and CI/CD pipelines so every server is configured consistently.
5. **Bookmark this guide** — Refer back to the [Workflows](#quick-reference-common-workflows) and [Error Reference](#error-reference) sections when troubleshooting.

Have questions or running into issues? Reach out to your HPE support representative or visit [ilorest documentation](https://servermanagementportal.ext.hpe.com/docs/redfishclients/ilorest-userguide) for additional resources.


