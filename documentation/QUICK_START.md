# Quick Start Guide - Frontend-Backend Integration

## 🚀 Setup Instructions

### 1. Install Dependencies

The frontend now requires `axios` for API calls. It has been installed automatically.

```bash
cd frontend
npm install
```

### 2. Configure Environment

A `.env` file has been created in `/frontend/` with the default backend URL:

```env
VITE_API_URL=http://localhost:3000/api
```

**If your backend runs on a different port**, update this value.

### 3. Start the Backend

Make sure your backend server is running:

```bash
cd backend
npm run dev
```

The backend should be running on port 3000 (or the port specified in your backend .env file).

### 4. Start the Frontend

```bash
cd frontend
npm run dev
```

The frontend will be available at `http://localhost:5173` (or the port Vite assigns).

## ✅ What's Integrated

### Customer Features (Working with Backend)

- ✅ **Get Nearby Mechanics** - Fetches real mechanics from the database based on location
- ✅ **Create Service Requests** - Submits requests to the backend
- ✅ **View Service History** - Displays real request history from database
- ✅ **Cancel Requests** - Cancels pending requests via API
- ✅ **Accept/Decline Prices** - Handles mechanic price proposals

### Mechanic Features (Working with Backend)

- ✅ **View Incoming Requests** - Shows real service requests from customers
- ✅ **Accept/Reject Requests** - Processes requests via backend
- ✅ **Complete Requests** - Marks services as done
- ✅ **Auto-refresh** - Can refresh request list from backend

## ⚠️ Not Yet Integrated (As Per Requirements)

- ❌ **Login/Signup** - Still using mock authentication
- ❌ **Profile Management** - Still using mock data
- ❌ **Socket.IO** - Real-time updates not yet connected
- ❌ **Push Notifications** - Service exists but not integrated in UI

## 🧪 Testing the Integration

### Test 1: Customer - View Nearby Mechanics

1. Go to Customer Home page
2. Enable location or manually set coordinates
3. The map should load mechanics from the backend
4. If the backend is down, it falls back to mock data

### Test 2: Customer - Create Service Request

1. Select a mechanic on the map
2. Choose service type or enter description
3. Click "Request Service"
4. Check browser console for API response
5. Request should appear in backend database

### Test 3: Mechanic - View Incoming Requests

1. Go to Mechanic Dashboard
2. Incoming requests should load from backend
3. Try accepting/rejecting a request
4. Check browser console for API responses

### Test 4: Customer - View History

1. Go to Customer History page
2. Past requests should load from backend
3. Try canceling a pending request
4. Status should update via API

## 🔍 Debugging

### API Calls Not Working?

1. **Check Backend is Running**

   ```bash
   curl http://localhost:3000/api/auth/check-session
   ```

2. **Check Browser Console**
   - Open DevTools (F12)
   - Go to Console tab
   - Look for API errors (red messages)
   - Check Network tab for failed requests

3. **Check Token**
   - Open DevTools > Application > Local Storage
   - Look for `hav_jeang_token`
   - If missing, authentication might not be working

4. **Check Connection**
   - Verify `.env` file has correct `VITE_API_URL`
   - Restart Vite dev server after changing `.env`

### Common Issues

**CORS Errors**

- Backend must allow frontend origin
- Check backend `CORS_ORIGIN` setting
- Default allows all origins (`*`)

**401 Unauthorized**

- Token might be expired or invalid
- Try logging out and back in
- Check if backend validates tokens correctly

**Network Errors**

- Backend might not be running
- Wrong port in `.env`
- Firewall blocking connection

## 📂 File Structure

```
frontend/
├── .env                          # API configuration
├── API_INTEGRATION.md           # Detailed integration docs
├── QUICK_START.md              # This file
└── src/
    ├── services/               # ✨ NEW - API service layer
    │   ├── api.js             # Base axios config
    │   ├── authService.js     # Auth endpoints
    │   ├── servicesService.js # Service management
    │   ├── serviceRequestsService.js # Request operations
    │   ├── pushService.js     # Push notifications
    │   └── index.js           # Central export
    └── pages/
        ├── customer/
        │   ├── Home/
        │   │   └── hooks/
        │   │       ├── useMechanics.js        # ✏️ UPDATED - Uses backend API
        │   │       └── useServiceRequest.js   # ✏️ UPDATED - Uses backend API
        │   └── History/
        │       ├── History.jsx                # ✏️ UPDATED - Uses backend API
        │       └── useCustomerHistory.js      # ✨ NEW - Fetch history from API
        └── mechanic/
            └── hooks/
                └── useServiceRequests.js      # ✏️ UPDATED - Uses backend API
```

## 🎯 Next Steps

1. **Test All Features**
   - Create a test account in the backend
   - Try all customer and mechanic features
   - Verify data is saved to database

2. **Enable Authentication** (When Ready)
   - Update `AuthPage.jsx` to use `authService`
   - Remove mock authentication from `AuthContext`
   - Test login/logout flow

3. **Add Real-time Updates** (Optional)
   - Connect Socket.IO client
   - Listen for request updates
   - Update UI in real-time

## 📞 Support

- Check `API_INTEGRATION.md` for detailed API documentation
- Review browser console for specific error messages
- Verify backend endpoints match the ones in services
- Test individual service functions in browser console:
  ```javascript
  import { serviceRequestsService } from "./src/services";
  const mechanics = await serviceRequestsService.getNearbyMechanics({
    lat: 11.5564,
    lng: 104.9282,
  });
  ```

---

**Status**: ✅ Frontend-Backend Integration Complete (Auth excluded as requested)
