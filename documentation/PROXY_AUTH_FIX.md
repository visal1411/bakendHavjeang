# Proxy & Authentication Fix — 2026-02-28

## Overview

The frontend was unable to communicate with the backend API for authentication (login, register, check-session). Multiple configuration issues were identified and resolved.

---

## Issues Found

### 1. ❌ `API_BASE_URL` was `undefined` (Critical)

**File:** `frontend/src/services/api.js`

The axios base URL was never assigned a value — the line after `=` was entirely a comment:

```javascript
// ❌ BEFORE (broken)
const API_BASE_URL =
 // import.meta.env.VITE_API_URL || "http://localhost:5173/api";
```

This caused `API_BASE_URL` to be `undefined`, meaning all API requests from the frontend were sent to incorrect URLs, and every authentication call failed.

**Fix:**

```javascript
// ✅ AFTER (fixed)
const API_BASE_URL = "/api";
```

Setting the base URL to `"/api"` ensures requests like `POST /api/auth/login` are made as relative URLs, which the Vite dev server proxy intercepts and forwards to `http://localhost:8080`.

---

### 2. ❌ JWT_SECRET Mismatch in Auth Middleware (Critical)

**File:** `backend/src/middleware/authMiddleware.js`

The middleware used a hardcoded fallback secret that differed from the actual secret used to sign tokens:

```javascript
// ❌ BEFORE (broken) — fallback "supersecretkey" differs from .env value
const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";
```

- **Signing** (in `authController.js`): Used `process.env.JWT_SECRET` → `"your-super-secret-jwt-key-change-this-in-production"`
- **Verifying** (in `authMiddleware.js`): If env var wasn't loaded, fell back to `"supersecretkey"`

This secret mismatch caused `jwt.verify()` to fail, returning "Invalid token" on every authenticated request (e.g., `check-session`).

**Fix:**

```javascript
// ✅ AFTER (fixed) — always uses the same secret from .env
const JWT_SECRET = process.env.JWT_SECRET;
```

---

### 3. ⚠️ Conflicting Proxy Configurations (Non-critical)

Three separate proxy setups existed, but only one actually works with Vite:

| File | Type | Status |
|------|------|--------|
| `frontend/vite.config.js` | Vite dev proxy | ✅ **Active** — this is the one that works |
| `frontend/package.json` → `"proxy"` | CRA-style proxy field | ❌ **Ignored by Vite** |
| `backend/src/setupProxy.js` | CRA `setupProxy.js` (CommonJS) | ❌ **Never loaded** by Vite or Express |

**Recommendation:** Remove the unused proxy configurations:
- Delete `backend/src/setupProxy.js`
- Remove `"proxy": "http://localhost:8080"` from `frontend/package.json`

---

### 4. ⚠️ `CORS_ORIGIN` Missing in Root `.env` (Docker only)

The `docker-compose.yml` loads the **root** `.env` file, which does not contain `CORS_ORIGIN`. The backend `.env` has it set to `http://localhost:5173`, but this is only loaded when running the backend directly (not via Docker Compose).

**Recommendation:** Add to root `.env`:
```
CORS_ORIGIN=http://localhost:5173
```

---

## How Authentication Works After Fix

```
Frontend (port 5173)                      Backend (port 8080)
─────────────────────                     ────────────────────

1. POST /api/auth/login     ──Vite Proxy──▶  POST /api/auth/login
   { phone, password }                        │
                                               ▼
                                         Validate credentials (bcrypt)
                                         Sign JWT with JWT_SECRET
                             ◀──────────  { token, user }

2. Token stored in localStorage (hav_jeang_token)

3. GET /api/auth/check-session ─Proxy──▶  GET /api/auth/check-session
   Header: Authorization: Bearer <token>       │
                                               ▼
                                         authMiddleware verifies JWT
                                         with SAME JWT_SECRET
                             ◀──────────  { authenticated: true, user }
```

### Proxy Flow (Vite Dev Server)

```
Browser Request              Vite Dev Server              Express Backend
──────────────────           ────────────────             ────────────────
GET /api/auth/login   ──▶   Matches "/api" proxy  ──▶   http://localhost:8080/api/auth/login
                             (vite.config.js)
```

---

### 5. ❌ Customer Sign-Up Missing "Full Name" Input (Bug)

**File:** `frontend/src/pages/auth/AuthPage.jsx`

The "Full Name" input field was only displayed for **mechanic** sign-ups. Customers were never asked for their name, and the backend received their **phone number** as the `name` field instead:

```javascript
// ❌ BEFORE — Name field only rendered for mechanics
{mode === 'signup' && role === 'mechanic' && ( <input name="fullName" ... /> )}

// ❌ BEFORE — Customer name fallback to phone
name: role === 'mechanic' ? formData.fullName : formData.phone
```

**Fix:**

- Showed the "Full Name" input for **all sign-up roles** (customer + mechanic)
- Used `formData.fullName` directly for the `name` field for both roles
- Stopped clearing `fullName` when switching from mechanic to customer role

```javascript
// ✅ AFTER — Name field shown for all signup roles
{mode === 'signup' && ( <input name="fullName" ... /> )}

// ✅ AFTER — Always use the actual name
name: formData.fullName
```

---

## Files Modified

| File | Change |
|------|--------|
| `frontend/src/services/api.js` | Set `API_BASE_URL = "/api"` (was `undefined`) |
| `backend/src/middleware/authMiddleware.js` | Removed hardcoded fallback JWT secret |
| `frontend/src/pages/auth/AuthPage.jsx` | Added "Full Name" input for customer signup; fixed registration payload |

## Files to Clean Up (Optional)

| File | Action |
|------|--------|
| `backend/src/setupProxy.js` | Delete — CRA pattern, not used by Vite |
| `frontend/package.json` | Remove `"proxy"` field — CRA pattern, ignored by Vite |
| `frontend/.env` | `VITE_API_URL` is now unused, can be removed |
| Root `.env` | Add `CORS_ORIGIN=http://localhost:5173` for Docker support |
