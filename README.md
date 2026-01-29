# Hav-Jeang - Auto Repair Service Platform

Full-stack application with real-time notifications via WebSocket and Web Push.

## Architecture

- **Backend**: Node.js + Express + Socket.IO + Prisma + MySQL
- **Frontend**: React + Vite + Socket.IO Client + PWA
- **Database**: MySQL 8.0
- **Notifications**: WebSocket (online) + Web Push (offline)

## Quick Start with Docker Compose

### Option 1: Automated Setup (Recommended)

**Windows:**
```bash
cd hav-jeang
test.bat
```

**Linux/Mac:**
```bash
cd hav-jeang
chmod +x test.sh
./test.sh
```

### Option 2: Manual Setup

#### 1. Generate VAPID Keys

First, generate VAPID keys for Web Push notifications:

```bash
cd backend
npx web-push generate-vapid-keys
```

Copy the public and private keys.

#### 2. Configure Environment Variables

Create a `.env` file in the root directory (`hav-jeang/.env`):

```bash
cp .env.example .env
```

Edit `.env` and add your VAPID keys:

```env
VAPID_PUBLIC_KEY=<your-public-key>
VAPID_PRIVATE_KEY=<your-private-key>
VAPID_SUBJECT=mailto:your-email@example.com
JWT_SECRET=<your-strong-random-secret>
```

#### 3. Start All Services

```bash
docker-compose up -d
```

This will start:
- **Database** (MySQL) on port `3307`
- **Backend API** on port `3000`
- **Frontend** on port `5000`

### 4. Access the Application

- **Frontend**: http://localhost:5000
- **Backend API**: http://localhost:3000/api
- **API Documentation**: http://localhost:3000/api-docs
- **Socket.IO**: ws://localhost:3000

### 5. View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f db
```

### 6. Stop Services

```bash
docker-compose down
```

To also remove volumes (database data):

```bash
docker-compose down -v
```

## Development Setup (Without Docker)

### Backend

```bash
cd backend
npm install
cp .env.example .env  # Configure your .env file
npx prisma generate
npx prisma migrate dev
npm run dev
```

Backend runs on: http://localhost:3000

### Frontend

```bash
cd frontend
npm install
cp .env.example .env  # Configure your .env file
npm run dev
```

Frontend runs on: http://localhost:5173 (Vite default)

## Port Configuration

| Service | Port | Description |
|---------|------|-------------|
| Frontend | 5000 | React PWA application |
| Backend API | 3000 | Express REST API |
| Socket.IO | 3000 | WebSocket server (same as backend) |
| MySQL | 3307 | Database (3307 to avoid conflicts) |

## Features

### Real-time Notifications

- **WebSocket**: Instant notifications when app is open
- **Web Push**: Notifications when app is closed (PWA)

### Notification Events

- `new_service_request` - Customer creates request → Mechanic notified
- `request_accepted` - Mechanic accepts → Customer notified
- `request_rejected` - Mechanic rejects → Customer notified
- `request_completed` - Mechanic completes → Customer notified
- `price_proposed` - Mechanic proposes price → Customer notified
- `price_accepted` - Customer accepts price → Mechanic notified
- `price_declined` - Customer declines price → Mechanic notified
- `request_cancelled` - Request cancelled → Both notified
- `request_expired` - Auto-expired after 10 minutes → Both notified

### Auto-Expiry

Service requests automatically expire after 10 minutes (configurable via `REQUEST_EXPIRY_MINUTES`) if the mechanic doesn't respond.

## Troubleshooting

### Database Connection Issues

If the backend can't connect to the database:

1. Check database is running: `docker-compose ps`
2. Check database logs: `docker-compose logs db`
3. Verify DATABASE_URL in backend environment

### Port Already in Use

If you get port conflicts:

1. Change ports in `docker-compose.yml`
2. Update `CORS_ORIGIN` in backend `.env`
3. Update `VITE_API_BASE_URL` and `VITE_SOCKET_URL` in frontend `.env`

### Push Notifications Not Working

1. Ensure VAPID keys are set correctly
2. Frontend must be served over HTTPS (or localhost for development)
3. Check browser console for service worker errors
4. Verify service worker is registered (DevTools > Application > Service Workers)

### Socket.IO Connection Issues

1. Check backend is running and Socket.IO initialized
2. Verify authentication token is valid
3. Check CORS settings match frontend URL
4. Check browser console for connection errors

## Production Deployment

For production:

1. Use HTTPS (required for Web Push)
2. Set strong `JWT_SECRET`
3. Configure proper CORS origins
4. Use environment-specific database credentials
5. Set up proper logging and monitoring

## API Endpoints

See http://localhost:3000/api-docs for full API documentation.

## License

See LICENSE file for details.
