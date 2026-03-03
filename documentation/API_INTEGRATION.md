# Frontend-Backend API Integration

## Overview

This document describes the integration between the frontend and backend API. The frontend now communicates with the backend instead of using mock data.

## ✅ Completed Integrations

### 1. **Service Layer Setup**

Created a complete API service layer in `/frontend/src/services/`:

- **`api.js`** - Base axios configuration with interceptors
- **`authService.js`** - Authentication endpoints (login, register, session management)
- **`servicesService.js`** - Mechanic service management (CRUD)
- **`serviceRequestsService.js`** - Customer & mechanic request operations
- **`pushService.js`** - Push notification subscriptions
- **`index.js`** - Central export point

### 2. **Customer Features**

#### Get Nearby Mechanics

- **Hook**: `useMechanics.js`
- **API**: `GET /api/servicerequests/customer/nearby`
- **Functionality**: Fetches mechanics near customer location with distance calculation
- **Fallback**: Uses mock data if API fails or no location available

#### Create Service Requests

- **Hook**: `useServiceRequest.js`
- **API**: `POST /api/servicerequests/customer`
- **Functionality**: Creates service requests with location, services, and trip price
- **Fields**: address, lat/lng, trip_price, description, serviceIds

#### View Service History

- **Component**: `History.jsx`
- **Hook**: `useCustomerHistory.js`
- **API**: `GET /api/servicerequests/customer/my`
- **Functionality**: Displays all past and current service requests
- **Actions**: Cancel requests, accept/decline proposed prices

### 3. **Mechanic Features**

#### View Incoming Requests

- **Hook**: `useServiceRequests.js`
- **API**: `GET /api/servicerequests/mechanic/incoming`
- **Functionality**: Fetches service requests assigned to the mechanic
- **Transforms**: API response to match frontend data structure

#### Accept/Reject Requests

- **APIs**:
  - `PATCH /api/servicerequests/mechanic/:id/accept`
  - `PATCH /api/servicerequests/mechanic/:id/reject`
- **Functionality**: Mechanic can accept or decline incoming requests

#### Complete Requests

- **API**: `PATCH /api/servicerequests/mechanic/:id/complete`
- **Functionality**: Mark service as completed

## 🔧 Configuration

### Environment Variables

Create a `.env` file in `/frontend/`:

```env
VITE_API_URL=http://localhost:3000/api
```

### Backend Port

Default backend URL: `http://localhost:3000/api`

Update the `VITE_API_URL` if your backend runs on a different port.

## 🔐 Authentication Flow

### Token Management

- Tokens are stored in `localStorage` with key `hav_jeang_token`
- Automatically included in all API requests via axios interceptors
- Cleared on 401 (Unauthorized) responses

### Current State

⚠️ **Note**: Authentication (login/signup) is currently **NOT integrated** as per requirements. The frontend still uses mock authentication in `AuthContext.jsx`.

To enable full authentication:

1. Update `AuthPage.jsx` to use `authService.login()` and `authService.register()`
2. Store the returned token in localStorage
3. Update `AuthContext` to call `authService.checkSession()` on app load

## 📊 Data Transformation

The backend returns data in different formats than expected by the frontend. Data transformation happens in the hooks:

### Example: Service Request Transformation

```javascript
// Backend response
{
  id: 1,
  request_date: "2024-01-01",
  status: "pending",
  customer: { name: "John" },
  service: [{ name: "Oil Change" }],
  trip_price: 10,
  total_price: 50
}

// Frontend format (after transformation)
{
  id: 1,
  date: "2024-01-01",
  status: "pending",
  customerName: "John",
  service: "Oil Change",
  tripPrice: 10,
  total: 50
}
```

## 🚀 Usage Examples

### Customer: Get Nearby Mechanics

```javascript
import { serviceRequestsService } from "@/services";

const mechanics = await serviceRequestsService.getNearbyMechanics({
  lat: 11.5564,
  lng: 104.9282,
  maxDistance: 10, // optional, in km
});
```

### Customer: Create Service Request

```javascript
import { serviceRequestsService } from "@/services";

const request = await serviceRequestsService.createServiceRequest({
  address: "123 Main St",
  request_lat: 11.5564,
  request_lng: 104.9282,
  trip_price: 5,
  description: "Flat tire",
  serviceIds: [1, 2], // optional, array of service IDs
});
```

### Mechanic: Get Incoming Requests

```javascript
import { serviceRequestsService } from "@/services";

const requests = await serviceRequestsService.getIncomingRequests();
```

### Mechanic: Accept Request

```javascript
import { serviceRequestsService } from "@/services";

const result = await serviceRequestsService.acceptServiceRequest(requestId);
```

## 🔄 Fallback Strategy

All hooks include fallback to mock data if API calls fail:

```javascript
try {
  const response = await serviceRequestsService.getMyRequests();
  setData(response);
} catch (error) {
  console.error("API failed:", error);
  // Fallback to mock data
  setData(mockData);
}
```

This ensures the app remains functional during:

- Backend downtime
- Network issues
- Development without backend running

## 📝 API Endpoints Reference

### Customer Endpoints

```
POST   /api/servicerequests/customer              - Create request
GET    /api/servicerequests/customer/my           - Get my requests
GET    /api/servicerequests/customer/:id/total    - Get request total
PATCH  /api/servicerequests/customer/:id/cancel   - Cancel request
GET    /api/servicerequests/customer/nearby       - Get nearby mechanics
PATCH  /api/servicerequests/customer/:id/accept-price   - Accept proposed price
PATCH  /api/servicerequests/customer/:id/decline-price  - Decline proposed price
```

### Mechanic Endpoints

```
GET    /api/servicerequests/mechanic/incoming           - Get incoming requests
PATCH  /api/servicerequests/mechanic/:id/accept        - Accept request
PATCH  /api/servicerequests/mechanic/:id/reject        - Reject request
PATCH  /api/servicerequests/mechanic/:id/complete      - Complete request
PATCH  /api/servicerequests/mechanic/:id/propose-price - Propose price
```

### Service Management (Mechanic)

```
POST   /api/services      - Create service
GET    /api/services/my   - Get my services
PUT    /api/services/:id  - Update service
DELETE /api/services/:id  - Delete service
```

## 🐛 Error Handling

All API calls include error handling:

```javascript
try {
  const result = await apiCall();
  return { success: true, data: result };
} catch (error) {
  console.error("API Error:", error);
  return {
    success: false,
    message: error.response?.data?.message || "Request failed",
  };
}
```

## 🎯 Next Steps

To complete the integration:

1. **Enable Authentication**
   - Update AuthPage.jsx to use real API calls
   - Implement proper token management
   - Add session restoration on app load

2. **Add Real-time Updates**
   - Integrate Socket.IO for live request updates
   - Connect to backend socket service
   - Update mechanic dashboard in real-time

3. **Handle Edge Cases**
   - Better error messages for users
   - Retry logic for failed requests
   - Loading states for better UX

4. **Testing**
   - Test all API endpoints with backend running
   - Verify data transformations
   - Test error scenarios

## 📦 Dependencies Added

```json
{
  "axios": "^1.x.x"
}
```

## 🔗 Related Files

### Services

- `/frontend/src/services/api.js`
- `/frontend/src/services/authService.js`
- `/frontend/src/services/servicesService.js`
- `/frontend/src/services/serviceRequestsService.js`
- `/frontend/src/services/pushService.js`

### Hooks (Updated)

- `/frontend/src/pages/customer/Home/hooks/useMechanics.js`
- `/frontend/src/pages/customer/Home/hooks/useServiceRequest.js`
- `/frontend/src/pages/customer/History/useCustomerHistory.js`
- `/frontend/src/pages/mechanic/hooks/useServiceRequests.js`

### Configuration

- `/frontend/.env`
