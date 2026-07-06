# SawaFlix OTP Verification — Frontend Integration Guide

> **Audience:** Frontend developers building the `/verify-otp` page and any page that triggers email verification.
> **Last updated:** 2026-02-23

---

## Overview

OTP verification is a **two-endpoint flow**. The backend handles all OTP generation, email delivery, rate limiting, and user status transitions. The frontend only needs to:

1. Call **Send OTP** → show a code input to the user
2. Call **Verify OTP** → handle the response and redirect accordingly

```
[Sign Up / Login] → [Send OTP] → [/verify-otp page] → [Verify OTP] → [Redirect by role]
```

> [!IMPORTANT]
> Both endpoints are **public** (no auth header needed). They are excluded from middleware route protection intentionally — the user may not have a session yet when they verify.

---

## Endpoint 1 — Send OTP

### `POST /api/otp/send`

Generates a 6-digit OTP, stores it in Redis for 5 minutes, and emails it to the user via SendGrid.

#### Request

```json
{
  "email": "user@example.com"
}
```

#### Success Response — `200 OK`

```json
{
  "message": "OTP sent to your email successfully",
  "debug_otp": "382941"
}
```

> [!NOTE]
> `debug_otp` is **only present in `NODE_ENV=development`**. In production this field is absent — never rely on it.

#### Error Responses

| HTTP Status | `error` field | What to show the user |
|---|---|---|
| `400` | `"Email is required"` | "Please enter your email address." |
| `429` | `"Too many OTP requests. Try again in 15 minutes."` | Show a countdown or the exact error string |
| `400` | `"Invalid email address"` | "That doesn't look like a valid email." |
| `500` | `"Failed to send OTP. Please try again."` | "Something went wrong. Please try again." |

#### Rate Limit
- **5 requests per 15 minutes** per email address
- After the 5th, requests return `429` until the window resets

#### UI Recommendations
- Show a **"Resend Code"** button, disabled for at least 60 seconds after each send
- On `429`, show: *"Too many attempts. Please wait 15 minutes before requesting a new code."*
- On success, move the user to the OTP input step immediately

---

## Endpoint 2 — Verify OTP

### `POST /api/otp/verify`

Validates the code, walks the user through the DB state machine, and determines final status based on their **role**.

#### Request

```json
{
  "email": "user@example.com",
  "code": "382941"
}
```

#### Success Responses

There are **two distinct success states** — you MUST handle both:

##### ✅ Viewer verified (auto-approved)

```json
{
  "message": "User verified successfully",
  "verified": true
}
```

→ **Redirect to `/dashboard`**

---

##### ⏳ Creator email confirmed (pending admin review)

```json
{
  "message": "Email verified. Your creator account is pending admin approval.",
  "verified": false,
  "pendingReview": true
}
```

→ **Redirect to `/creator/verify`** — do NOT redirect to dashboard  
→ Show: *"Your email is confirmed! Our team is reviewing your creator application."*

---

##### ℹ️ Already verified (idempotent)

```json
{
  "message": "User already verified",
  "verified": true
}
```

→ Treat the same as the viewer success case — redirect to `/dashboard`

---

#### Error Responses

| HTTP Status | `error` field | What to show the user |
|---|---|---|
| `400` | `"Email and code are required"` | Validation — ensure both fields are filled |
| `400` | `"Invalid OTP"` | "That code is incorrect. Please try again." |
| `400` | `"OTP expired or not found. Request a new code."` | "Your code has expired. Request a new one." + trigger resend |
| `404` | `"User not found. Please sign up first."` | "We couldn't find your account. Please sign up." |
| `429` | `"Too many verification attempts. Try again in 15 minutes."` | Show the exact string — user is blocked |
| `500` | `"Verification failed. Please try again."` | "Something went wrong on our end. Please try again." |

#### Rate Limit
- **10 wrong attempts per 15 minutes** per email address
- After the 10th, requests return `429` even with the correct code until the window resets
- Codes are **not deleted on wrong attempts** — the OTP is still valid until it expires or is used correctly

---

## Complete Decision Tree — `verify/route.ts` Logic

```
POST /api/otp/verify
        │
        ├─ Missing email or code?  →  400 "Email and code are required"
        │
        ├─ Rate limit exceeded?  →  429 "Too many verification attempts..."
        │
        ├─ OTP not in Redis?  →  400 "OTP expired or not found..."
        │
        ├─ OTP wrong?  →  400 "Invalid OTP"  (code NOT deleted)
        │
        └─ OTP correct  →  DELETE from Redis
                │
                ├─ User not found in DB?  →  404
                │
                ├─ Already 'approved'?  →  200 { verified: true }  (no DB write)
                │
                ├─ Status 'unverified'?  →  DB: unverified → pending (Step 1)
                │
                └─ Check role:
                        │
                        ├─ role = 'creator'  →  STOP at pending
                        │                       200 { verified: false, pendingReview: true }
                        │
                        └─ role = 'viewer'   →  DB: pending → approved (Step 2)
                                                DB trigger sets is_verified = true
                                                200 { verified: true }
```

---

## Middleware Routing Reference

The middleware automatically redirects users based on their `role` and `verification_status`. This affects where users land **after** OTP verification.

| User state | Tries to visit | Redirected to |
|---|---|---|
| Not logged in | Any protected route | `/login` |
| Logged in, any role | `/verify-otp` (already approved) | `/dashboard` or `/creator/dashboard` |
| Viewer, unverified | `/dashboard` | `/verify-otp` |
| Creator, any status | `/dashboard` | `/verify-otp` (dashboard is for viewers) |
| Creator, not approved | `/creator/dashboard` | `/creator/verify` |
| Creator, approved | `/creator/verify` | `/creator/dashboard` |
| Non-creator | `/creator/*` | `/` |
| Non-admin | `/admin/*` | `/` |
| Admin | `/login` or `/sign-up` | `/admin` |
| Creator (approved) | `/login` or `/sign-up` | `/creator/dashboard` |
| Viewer (approved) | `/login` or `/sign-up` | `/dashboard` |

---

## Suggested `/verify-otp` Page Structure

```
┌─────────────────────────────────────────┐
│  🔐 Check your inbox                    │
│  We sent a 6-digit code to             │
│  u***@example.com                       │
│                                         │
│  [ _ ] [ _ ] [ _ ] [ _ ] [ _ ] [ _ ]   │  ← 6 separate inputs or one text field
│                                         │
│  [     Verify Code     ]                │
│                                         │
│  Didn't receive it?                     │
│  [Resend Code] ← disabled for 60s      │
│                                         │
│  ⚠️  Error message area                 │
└─────────────────────────────────────────┘
```

### State Machine for the Page

```
initial
  └─ [on mount] → call /api/otp/send with email from query params or context
        │
  sending → success → show code input
        │
  error → show error + "try again" button

code input
  └─ [on submit] → call /api/otp/verify
        │
        ├─ { verified: true }         → router.push('/dashboard')
        ├─ { pendingReview: true }    → router.push('/creator/verify')
        ├─ error.status === 400       → show error inline, keep form active
        ├─ error.status === 429       → show lockout message, hide submit button
        └─ error.status === 500       → show generic error, allow retry
```

---

## Environment Variables (Backend — do not expose to frontend)

| Variable | Purpose |
|---|---|
| `SENDGRID_API_KEY` | SendGrid API key for sending emails |
| `SENDGRID_FROM_EMAIL` | Verified sender address (`ngamsabastine@gmail.com`) |
| `UPSTASH_REDIS_REST_URL` | Redis instance URL for OTP storage |
| `UPSTASH_REDIS_REST_TOKEN` | Redis auth token |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key — used server-side only, NEVER expose to client |

> [!CAUTION]
> `SUPABASE_SERVICE_ROLE_KEY` bypasses all Row Level Security. It must only ever be used in server-side API routes. Never import it into a client component or expose it via `NEXT_PUBLIC_*`.

---

## Quick Reference — Response Handling Snippet

```jsx
async function verifyOtp(email, code) {
  const res = await fetch('/api/otp/verify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, code }),
  });

  const data = await res.json();

  if (!res.ok) {
    // All errors have an 'error' string field
    if (res.status === 429) {
      showLockoutMessage(data.error); // disable form
    } else {
      showInlineError(data.error); // keep form active
    }
    return;
  }

  // Success — check which kind
  if (data.pendingReview) {
    router.push('/creator/verify'); // creator awaiting admin
  } else if (data.verified) {
    router.push('/dashboard'); // viewer fully approved
  }
}
```
