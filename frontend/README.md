# Hav-Jeang Frontend

Production-ready React PWA frontend for the Hav-Jeang auto repair service platform.

## Features

- ✅ **Real-time notifications** via WebSocket (Socket.IO)
- ✅ **Web Push notifications** for offline users
- ✅ **JWT authentication** with token management
- ✅ **API integration** with backend services
- ✅ **PWA support** with service worker
- ✅ **Role-based routing** (Customer/Mechanic)

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables

Create a `.env` file in the frontend directory:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:3000/api
VITE_SOCKET_URL=http://localhost:3000

# Web Push VAPID Public Key (get from backend after generating VAPID keys)
VITE_VAPID_PUBLIC_KEY=your_vapid_public_key_here
```

**To get VAPID keys:**
1. In your backend, run: `npx web-push generate-vapid-keys`
2. Copy the public key to `VITE_VAPID_PUBLIC_KEY` in `.env`
3. Copy the private key to `VAPID_PRIVATE_KEY` in backend `.env`

### 3. Development

```bash
npm run dev
```

### 4. Production Build

```bash
npm run build
```

The built files will be in the `dist` directory.

## Architecture

### API Layer (`src/lib/api.js`)
- Centralized API client with axios
- Automatic JWT token injection
- Error handling and token refresh

### Socket.IO (`src/contexts/SocketContext.jsx`)
- Real-time WebSocket connections
- Automatic reconnection
- Event listeners for all notification types

### Web Push (`src/lib/pushNotifications.js`)
- Service worker registration
- Push subscription management
- Automatic subscription on login

### Authentication (`src/contexts/AuthContext.jsx`)
- JWT token storage
- Session persistence
- Automatic push notification setup

## Notification Events

The app listens for these Socket.IO events:
- `new_service_request` - New request for mechanic
- `request_accepted` - Request accepted by mechanic
- `request_rejected` - Request rejected by mechanic
- `request_completed` - Request completed
- `price_proposed` - Mechanic proposed price
- `price_accepted` - Customer accepted price
- `price_declined` - Customer declined price
- `request_cancelled` - Request cancelled
- `request_expired` - Request expired (auto-cancelled)

## API Endpoints Used

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/check-session` - Verify session

### Service Requests (Customer)
- `POST /api/servicerequests/customer` - Create request
- `GET /api/servicerequests/customer/my` - Get my requests
- `PATCH /api/servicerequests/customer/:id/cancel` - Cancel request
- `GET /api/servicerequests/customer/nearby` - Get nearby mechanics
- `PATCH /api/servicerequests/customer/:id/accept-price` - Accept proposed price
- `PATCH /api/servicerequests/customer/:id/decline-price` - Decline proposed price

### Service Requests (Mechanic)
- `GET /api/servicerequests/mechanic/incoming` - Get incoming requests
- `PATCH /api/servicerequests/mechanic/:id/accept` - Accept request
- `PATCH /api/servicerequests/mechanic/:id/reject` - Reject request
- `PATCH /api/servicerequests/mechanic/:id/complete` - Complete request
- `PATCH /api/servicerequests/mechanic/:id/propose-price` - Propose price

### Push Notifications
- `POST /api/push/subscribe` - Subscribe to push notifications
- `POST /api/push/unsubscribe` - Unsubscribe from push notifications

## Deployment

### Docker

The frontend includes a Dockerfile for containerized deployment:

```bash
docker build -t hav-jeang-frontend .
docker run -p 5000:5000 hav-jeang-frontend
```

### Environment Variables for Production

Make sure to set:
- `VITE_API_BASE_URL` - Your production API URL
- `VITE_SOCKET_URL` - Your production Socket.IO URL
- `VITE_VAPID_PUBLIC_KEY` - Your production VAPID public key

## Troubleshooting

### Push Notifications Not Working
1. Ensure HTTPS (required for production)
2. Check VAPID keys are correctly set
3. Verify service worker is registered (check browser DevTools > Application > Service Workers)
4. Check browser console for errors

### Socket.IO Not Connecting
1. Verify `VITE_SOCKET_URL` matches backend Socket.IO server
2. Check authentication token is valid
3. Check browser console for connection errors

### API Calls Failing
1. Verify `VITE_API_BASE_URL` is correct
2. Check authentication token is present
3. Check CORS settings on backend
4. Check browser Network tab for error details
