# Testing Guide

## Quick Start with Docker Compose

### 1. Setup Environment Variables

```bash
cd hav-jeang
cp .env.example .env
```

Edit `.env` and add your VAPID keys:

```bash
# Generate VAPID keys first
cd backend
npx web-push generate-vapid-keys
```

Copy the keys to `.env`:
```env
VAPID_PUBLIC_KEY=<your-public-key>
VAPID_PRIVATE_KEY=<your-private-key>
JWT_SECRET=<strong-random-secret>
```

### 2. Start All Services

```bash
docker-compose up -d
```

This starts:
- **MySQL Database** on port `3307`
- **Backend API** on port `3000`
- **Frontend** on port `5000`

### 3. Check Services Status

```bash
docker-compose ps
```

All services should show "Up" status.

### 4. View Logs

```bash
# All services
docker-compose logs -f

# Backend only
docker-compose logs -f backend

# Frontend only
docker-compose logs -f frontend

# Database only
docker-compose logs -f db
```

### 5. Access the Application

- **Frontend**: http://localhost:5000
- **Backend API**: http://localhost:3000/api
- **API Docs**: http://localhost:3000/api-docs
- **Socket.IO**: ws://localhost:3000

## Testing Notifications

### Test WebSocket Notifications (App Open)

1. Open http://localhost:5000 in two browser windows:
   - Window 1: Login as **Customer**
   - Window 2: Login as **Mechanic**

2. **Customer creates request**:
   - In Customer window, create a service request
   - **Expected**: Mechanic window receives WebSocket notification instantly

3. **Mechanic accepts/rejects**:
   - In Mechanic window, accept or reject the request
   - **Expected**: Customer window receives WebSocket notification instantly

4. **Mechanic proposes price**:
   - In Mechanic window, propose a price
   - **Expected**: Customer window receives WebSocket notification

5. **Customer accepts/declines price**:
   - In Customer window, accept or decline the price
   - **Expected**: Mechanic window receives WebSocket notification

### Test Web Push Notifications (App Closed)

1. **Subscribe to push**:
   - Login to the app
   - Browser will ask for notification permission
   - Click "Allow"

2. **Close the app** (close browser tab/window)

3. **Trigger notification**:
   - Use another device/browser to create a request
   - Or wait for auto-expiry (10 minutes)

4. **Expected**: Browser shows push notification even when app is closed

### Test Auto-Expiry

1. Create a service request as Customer
2. **Don't** accept/reject as Mechanic
3. Wait 10 minutes (or change `REQUEST_EXPIRY_MINUTES` to 1 for testing)
4. **Expected**: Request auto-cancelled, both users notified

## API Testing

### Using cURL

```bash
# Register Customer
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "1234567890",
    "password": "password123",
    "usertype": "customer",
    "name": "Test Customer"
  }'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "1234567890",
    "password": "password123"
  }'

# Use the token from login response for authenticated requests
TOKEN="your-jwt-token-here"

# Create Service Request
curl -X POST http://localhost:3000/api/servicerequests/customer \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "mechanicId": 1,
    "description": "Test request",
    "address": "123 Test St",
    "request_lat": 11.5564,
    "request_lng": 104.9282
  }'
```

### Using Postman/Thunder Client

1. Import the OpenAPI spec from `backend/openapi.yaml`
2. Set up environment variables:
   - `base_url`: http://localhost:3000/api
   - `token`: (set after login)

## Troubleshooting

### Services Won't Start

```bash
# Check logs
docker-compose logs

# Rebuild containers
docker-compose up -d --build

# Remove and recreate
docker-compose down -v
docker-compose up -d
```

### Database Connection Issues

```bash
# Check database is running
docker-compose ps db

# Check database logs
docker-compose logs db

# Connect to database manually
docker-compose exec db mysql -u havjeang_user -p havjeang
# Password: havjeang_pass (or from .env)
```

### Frontend Can't Connect to Backend

1. Check backend is running: `docker-compose ps backend`
2. Check backend logs: `docker-compose logs backend`
3. Verify CORS settings in backend `.env`:
   ```
   CORS_ORIGIN=http://localhost:5000
   ```

### Push Notifications Not Working

1. Check VAPID keys are set in `.env`
2. Check browser console for errors
3. Verify service worker is registered:
   - Open DevTools > Application > Service Workers
   - Should see `/sw.js` registered
4. Check notification permission:
   - DevTools > Application > Notifications
   - Should be "granted"

### Socket.IO Not Connecting

1. Check backend logs for Socket.IO initialization
2. Check browser console for connection errors
3. Verify token is valid (check Network tab)
4. Check CORS settings match frontend URL

## Stop Services

```bash
# Stop all services
docker-compose down

# Stop and remove volumes (deletes database data)
docker-compose down -v
```

## Reset Everything

```bash
# Stop and remove everything
docker-compose down -v

# Remove images (optional)
docker-compose rm -f

# Start fresh
docker-compose up -d --build
```
