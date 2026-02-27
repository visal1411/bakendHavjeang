# Authentication Integration — Changes Made

This document describes the frontend–backend authentication integration changes applied to the project.

---

## Summary

Three files were modified to connect the frontend authentication flow to the backend API (`POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/check-session`).

---

## 1. Bug Fix — `user.role` → `user.usertype`

**Problem:**  
The backend returns the user's role in a field called `usertype` (e.g. `"customer"` or `"mechanic"`), but the frontend routing components were checking `user.role`, which is always `undefined`. This caused authenticated users to be redirected to `/auth` instead of their home page.

**Files changed:**

### `frontend/src/App.jsx` — `RootRedirect` component (lines 61–66)

```jsx
// BEFORE (broken)
if (user?.role === 'customer') { ... }
else if (user?.role === 'mechanic') { ... }

// AFTER (fixed)
if (user?.usertype === 'customer') { ... }
else if (user?.usertype === 'mechanic') { ... }
```

### `frontend/src/components/shared/RoleBasedRoute.jsx` — route guard (lines 43–50)

```jsx
// BEFORE (broken)
if (user?.role !== allowedRole) {
  if (user?.role === 'customer') { ... }
  else if (user?.role === 'mechanic') { ... }
}

// AFTER (fixed)
if (user?.usertype !== allowedRole) {
  if (user?.usertype === 'customer') { ... }
  else if (user?.usertype === 'mechanic') { ... }
}
```

---

## 2. Fix — Register + Auto-Login Flow

**Problem:**  
The backend `POST /api/auth/register` endpoint returns a `201` response with `{ message, user }` but **does not** return a JWT token. The original frontend code checked `response.token` after registration to log the user in — since the token was always `undefined`, newly registered users were never logged in automatically.

**File changed:**

### `frontend/src/pages/auth/AuthPage.jsx` — `handleSubmit` registration branch (lines 179–208)

```jsx
// BEFORE (broken — token is never returned by register endpoint)
const response = await authService.register(registrationData);
if (response.token) {
  login(userData, response.token);
  navigate(/* ... */);
}

// AFTER (fixed — register then auto-login)
const registerResponse = await authService.register(registrationData);
if (registerResponse.user) {
  // Immediately login with same credentials to get JWT
  const loginResponse = await authService.login({
    phone: formData.phone,
    password: formData.password,
  });
  if (loginResponse.token && loginResponse.user) {
    login(userData, loginResponse.token);
    navigate(/* ... */);
  }
}
```

**Flow after fix:**
1. `POST /api/auth/register` → creates user in DB
2. `POST /api/auth/login` → returns JWT token + user object
3. Token and user data stored in `localStorage` via `AuthContext.login()`
4. User redirected to `/customer/home` or `/mechanic/dashboard`

---

## Files NOT Changed (Already Correct)

| File | Why no changes needed |
|---|---|
| `frontend/src/services/api.js` | Axios interceptor already attaches `Authorization: Bearer <token>` header from `localStorage` |
| `frontend/src/services/authService.js` | `register()`, `login()`, `checkSession()`, `getProfileById()`, `logout()` already call correct endpoints |
| `frontend/src/contexts/AuthContext.jsx` | Session restore on app load already calls `checkSession()` and validates stored token |

---

## Backend API Reference (used by these changes)

| Endpoint | Method | Auth | Response |
|---|---|---|---|
| `/api/auth/register` | POST | No | `201 { message, user: { id, name, phone, usertype } }` |
| `/api/auth/login` | POST | No | `200 { message, token, user: { id, name, phone, usertype, working_hours } }` |
| `/api/auth/check-session` | GET | Bearer token | `200 { authenticated: true, user: { id, role } }` |
| `/api/auth/users/:id/profile` | GET | No | `200 { message, profile: { name, phone, usertype, location?, working_hours? } }` |

---

## Auth Flow Diagram

```
User opens app
  │
  ├─ Has stored token? ──► GET /api/auth/check-session
  │     │                      │
  │     │                 200 OK ──► Restore session, redirect by usertype
  │     │                 401    ──► Clear localStorage, show /auth
  │     │
  │     └─ No token ──► Show /auth page
  │
  ├─ Login ──► POST /api/auth/login
  │               │
  │          200 + token ──► Store in localStorage + AuthContext
  │                          Redirect to /customer/home or /mechanic/dashboard
  │
  └─ Register ──► POST /api/auth/register
                    │
               201 + user ──► POST /api/auth/login (auto-login)
                                │
                           200 + token ──► Store + redirect (same as login)
```
