# Frontend & Backend Flow — Full Picture

This document describes **what the frontend must do** and **what the backend does** for every feature in the current codebase.

---

## 1. Auth

### 1.1 Register

| | Frontend | Backend |
|---|----------|---------|
| **Action** | `POST /api/auth/register` | |
| **Body** | `{ name, phone, password, usertype }` required. If `usertype === "mechanic"`: optionally `working_hours`, `mechanic_lat`, `mechanic_lng` | Validates (via `validateRegister`), checks phone unique, hashes password, creates user in DB |
| **Response** | On success: `201` + `{ message, user: { id, name, phone, usertype, mechanic_lat?, mechanic_lng? } }`. On fail: `400` (validation / phone already registered) | `authController.register` → `prisma.user.create` |

- **Frontend:** Send body; on 201 store user (and optionally auto-login via login call). No token in register response.

### 1.2 Login

| | Frontend | Backend |
|---|----------|---------|
| **Action** | `POST /api/auth/login` | |
| **Body** | `{ phone, password }` | Validates (via `validateLogin`), finds user by phone, compares password with bcrypt, signs JWT |
| **Response** | `200` + `{ message, token, algorithm?, user: { id, name, phone, usertype } }` | JWT payload: `{ id: user.id, role: user.usertype }`, expiry from `JWT_EXPIRE` |

- **Frontend:** Store `token` (e.g. memory, localStorage, or secure storage). Use it for all authenticated requests as `Authorization: Bearer <token>` and for Socket.IO handshake.

### 1.3 Check session

| | Frontend | Backend |
|---|----------|---------|
| **Action** | `GET /api/auth/check-session` with `Authorization: Bearer <token>` | `authenticateToken` verifies JWT, sets `req.user = { id, role }` |
| **Response** | `200` + `{ authenticated: true, user: req.user }` or `401`/`403` if invalid | Used to restore session on app load |

- **Frontend:** On app load, call check-session with stored token; if 200, consider user logged in and use `user.id` / `user.role`; if not, redirect to login.

---

## 2. Notifications (WebSocket + Web Push)

### 2.1 Socket.IO (real-time when user is “online”)

| | Frontend | Backend |
|---|----------|---------|
| **Action** | Connect to same host as API using Socket.IO client. Pass JWT in handshake. | Socket.IO attached to same HTTP server; upgrade handled by Socket.IO |
| **Connect** | e.g. `io(url, { auth: { token: "<jwt>" } })` or `extraHeaders: { token: "<jwt>" }` | `socketService`: middleware reads `socket.handshake.auth.token` or `socket.handshake.headers.token`, verifies JWT, sets `socket.userId`, `socket.userType` |
| **After connect** | Socket is associated with current user. Listen for event names below. | Server joins socket to room `user_<userId>`. All notifications to that user: `io.to("user_<userId>").emit(event, data)` |

- **Frontend:** After login, connect Socket.IO with the same JWT. Subscribe to events (see table below). On each event, update UI (e.g. refresh request list, show status, navigate).

### 2.2 Web Push (when user is “offline”)

| | Frontend | Backend |
|---|----------|---------|
| **Subscribe** | Request notification permission, get `PushManager.subscribe()` (with server’s VAPID public key). Then `POST /api/push/subscribe` with `Authorization: Bearer <token>`. Body: `{ endpoint, keys: { p256dh, auth } }` | `pushRoutes`: `authenticateToken`, then `saveSubscription` stores/updates subscription in DB by `userId` |
| **Unsubscribe** | `POST /api/push/unsubscribe` with `{ endpoint }` and Bearer token | Deletes subscription for that user + endpoint |
| **When to send** | — | Controllers call `isUserOnline(userId)`. If true → Socket.IO only. If false → `sendPushToUser(userId, { type, title, body, data })` |

- **Frontend:** After login (and optionally after Socket connect), register for push; send subscription to `/api/push/subscribe`. In the service worker, on `push` event, parse payload (same `type` / `data` as Socket events) and show notification / update UI.

### 2.3 Real-time event names and who receives them

| Event | Recipient | When (backend) |
|-------|------------|----------------|
| `new_service_request` | Mechanic | Customer creates a request |
| `request_accepted` | Customer | Mechanic accepts request |
| `request_rejected` | Customer | Mechanic rejects request |
| `request_cancelled` | Mechanic | Customer cancels request |
| `request_completed` | Customer | Mechanic marks request completed |
| `price_proposed` | Customer | Mechanic proposes price (unknown service) |
| `price_accepted` | Mechanic | Customer accepts proposed price |
| `price_declined` | Mechanic | Customer declines proposed price |
| `request_expired` | Customer & Mechanic | Scheduler auto-cancels pending request (no mechanic response in time) |

- **Frontend:** For each event, handle `event` name (Socket) or push `type` and use `data` (e.g. `requestId`, `status`) to refresh lists or show toasts.

---

## 3. Customer flows

All customer endpoints are under `/api/servicerequests/customer/*` and require **Bearer token** and **role = customer** (`isCustomer` middleware).

### 3.1 Get nearby mechanics

| | Frontend | Backend |
|---|----------|---------|
| **Request** | `GET /api/servicerequests/customer/nearby?lat=<number>&lng=<number>` | |
| **Backend** | — | `getNearbyMechanics`: reads `lat`, `lng` from query; returns list of mechanics with `mechanic_lat`/`mechanic_lng` (no distance calc in response). 400 if lat/lng missing |

- **Frontend:** Send user’s current lat/lng; display mechanics on map or list.

### 3.2 Get mechanic info

| | Frontend | Backend |
|---|----------|---------|
| **Request** | `GET /api/servicerequests/customer/:id/info` — `:id` = mechanic user id | |
| **Backend** | — | `getMechanicById`: returns mechanic’s name, phone, usertype, mechanic_lat, mechanic_lng, working_hours. 404 if not mechanic |

- **Frontend:** Use after user selects a mechanic (e.g. from nearby list).

### 3.3 Get services by mechanic

| | Frontend | Backend |
|---|----------|---------|
| **Request** | `GET /api/servicerequests/customer/:mechanicId/services` — `:mechanicId` = mechanic user id | |
| **Backend** | — | `getServicesByMechanic`: returns all services for that mechanic (id, name, price, serviceType, mechanicId) |

- **Frontend:** Use for “known service” flow: show services and let customer pick serviceIds for the request.

### 3.4 Create service request (known or unknown)

| | Frontend | Backend |
|---|----------|---------|
| **Request** | `POST /api/servicerequests/customer/` with body (see below) | |
| **Body** | **Required:** `address`, `request_lat`, `request_lng`. **Known service:** `serviceIds` (array). **Unknown service:** `mechanicId`. Optionally `description`. | `createServiceRequest`: resolves mechanic from services or mechanicId; gets customer location from body; calls `calculateTripPrice(customer, mechanic)` (ORS distance); for known services calls `calculateTotalPrice(tripPrice, services)`; creates `ServiceRequest` with trip_price, total_price (or 0 for unknown), status `pending`; notifies mechanic (Socket or push) |
| **Response** | `201` + `{ request, tripDistanceKm }` or 400/404 | |

- **Frontend:** Send address + lat/lng; for known send `serviceIds`; for unknown send `mechanicId`. Then open “my requests” and listen for mechanic response via Socket/push.

### 3.5 Get my requests

| | Frontend | Backend |
|---|----------|---------|
| **Request** | `GET /api/servicerequests/customer/my` | |
| **Backend** | — | `getMyRequests`: `req.user.id` → all service requests where `customerId = id`, include `service`, order by `request_date` desc |

- **Frontend:** Use for “My requests” list; refresh after actions or on Socket/push events.

### 3.6 Get grand total for a request

| | Frontend | Backend |
|---|----------|---------|
| **Request** | `GET /api/servicerequests/customer/:id/total` — `:id` = **request** id | |
| **Backend** | — | `getRequestTotal`: ensures request exists and `request.customerId === req.user.id`; returns `{ trip_price, proposed_price, services_sum, total_price }`. 403 if not owner, 404 if not found |

- **Frontend:** Use on request detail screen to show price breakdown and grand total.

### 3.7 Cancel request

| | Frontend | Backend |
|---|----------|---------|
| **Request** | `PATCH /api/servicerequests/customer/:id/cancel` — `:id` = request id | |
| **Backend** | — | `cancelServiceRequest`: ownership check; only if status is `pending` → set status `cancelled`, notify mechanic (Socket or push) |

- **Frontend:** Only show “Cancel” for pending requests; then refresh list / listen for confirmation.

### 3.8 Accept proposed price

| | Frontend | Backend |
|---|----------|---------|
| **Request** | `PATCH /api/servicerequests/customer/:id/accept-price` — `:id` = request id. No body. | |
| **Backend** | — | `acceptProposedPrice`: ownership check; requires `proposed_price`; sets `total_price = trip_price + proposed_price`, `customerApproved = true`, status `accepted`; notifies mechanic (Socket or push) |

- **Frontend:** Show when request has `proposed_price` and status e.g. `proposed`; on accept refresh and listen for `price_accepted` on mechanic side.

### 3.9 Decline proposed price

| | Frontend | Backend |
|---|----------|---------|
| **Request** | `PATCH /api/servicerequests/customer/:id/decline-price` — `:id` = request id | |
| **Backend** | — | `declineProposedPrice`: ownership check; sets `customerApproved = false`, status `cancelled`; notifies mechanic (Socket or push) |

- **Frontend:** Show when price is proposed; on decline update UI and optionally remove from active list.

---

## 4. Mechanic flows

All mechanic endpoints are under `/api/servicerequests/mechanic/*` and require **Bearer token** and **role = mechanic** (`isMechanic` middleware).

### 4.1 Get incoming requests

| | Frontend | Backend |
|---|----------|---------|
| **Request** | `GET /api/servicerequests/mechanic/incoming` | |
| **Backend** | — | `getIncomingRequests`: finds requests that are (1) linked to services of this mechanic, or (2) have no services and mechanicId is this mechanic (or null); status `pending`; includes customer and service; ordered by request_date asc |

- **Frontend:** List “Incoming” requests; refresh on `new_service_request` Socket/push.

### 4.2 Accept request

| | Frontend | Backend |
|---|----------|---------|
| **Request** | `PATCH /api/servicerequests/mechanic/:id/accept` — `:id` = request id | |
| **Backend** | — | `acceptServiceRequest`: only pending; mechanic must be allowed (has a linked service or is assigned for unknown); sets status `accepted`; notifies customer (Socket or push) |

- **Frontend:** On accept, remove from incoming (or move to “Active”); customer gets `request_accepted`.

### 4.3 Reject request

| | Frontend | Backend |
|---|----------|---------|
| **Request** | `PATCH /api/servicerequests/mechanic/:id/reject` — `:id` = request id | |
| **Backend** | — | `rejectServiceRequest`: same permission check; sets status `cancelled`; notifies customer (Socket or push) |

- **Frontend:** On reject, remove from list; customer gets `request_rejected`.

### 4.4 Propose price (unknown service)

| | Frontend | Backend |
|---|----------|---------|
| **Request** | `PATCH /api/servicerequests/mechanic/:id/propose-price` with body `{ proposed_price: number }` | |
| **Backend** | — | `proposeServicePrice`: only if status `accepted`; same permission check; sets `proposed_price`, `customerApproved = null`, status `proposed`; notifies customer (Socket or push) |

- **Frontend:** Show for accepted unknown-service requests; after propose, customer sees `price_proposed` and can accept/decline.

### 4.5 Complete request

| | Frontend | Backend |
|---|----------|---------|
| **Request** | `PATCH /api/servicerequests/mechanic/:id/complete` — `:id` = request id | |
| **Backend** | — | `completeServiceRequest`: only if status `accepted`; same permission check; sets status `completed`; notifies customer (Socket or push) |

- **Frontend:** Show for accepted requests; after complete, customer gets `request_completed`.

---

## 5. Backend-only behavior (frontend only reacts)

### 5.1 Request auto-expiry

| | Frontend | Backend |
|---|----------|---------|
| **Action** | — | Scheduler runs every 1 min (`requestExpiryService`). Finds pending requests older than `REQUEST_EXPIRY_MINUTES` (default 10); sets status `cancelled`; notifies **customer** and **mechanic** with event `request_expired` (Socket or push) |
| **Frontend** | Listen for `request_expired`; update request to cancelled, show “Request expired” (e.g. “mechanic did not respond in time” for customer, “request expired” for mechanic) | — |

---

## 6. Quick reference: API base and auth

- **Base URL:** e.g. `http://localhost:5000` (or your `PORT`).
- **API prefix:** `/api` (e.g. `/api/auth/login`, `/api/servicerequests/customer/my`).
- **Auth header:** `Authorization: Bearer <jwt>` for all protected routes.
- **Socket.IO:** Same origin (or CORS-allowed); handshake: `auth: { token: "<jwt>" }` or header `token: "<jwt>"`.
- **Push:** `POST /api/push/subscribe` and `POST /api/push/unsubscribe` with Bearer token.

---

## 7. Request status flow (backend state)

- **pending** → Customer created request; mechanic can accept/reject, or request can expire.
- **accepted** → Mechanic accepted; for unknown service mechanic can propose price; mechanic can complete.
- **proposed** → Mechanic proposed price (unknown service); customer can accept or decline.
- **accepted** (again) → Customer accepted price; total_price set; mechanic can complete.
- **completed** → Mechanic marked done.
- **cancelled** → Customer cancelled, mechanic rejected, customer declined price, or auto-expired.

This is the full flow of what the frontend needs to do and what the backend does with the current code.
