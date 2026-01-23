# 🔧 Mechanic Dashboard

## Overview

The Mechanic Dashboard is a comprehensive control center for mechanics using the Hav Jeang platform. It provides real-time service request management, earnings tracking, performance analytics, and quick access to essential features.

## Features

### 📊 Navigation & Sections

- **Sidebar Navigation**: Smooth slide-in menu with four main sections
  - Dashboard: Overview, stats, and service requests
  - Services: CRUD operations for service offerings
  - History: View past completed jobs with filters
  - Profile: View and edit mechanic profile information

### 📊 Statistics Overview

- **Total Jobs**: Complete count of jobs completed
- **Rating**: Average rating with total reviews
- **Total Earnings**: Cumulative earnings with growth trends
- **Completion Rate**: Percentage of successfully completed jobs

### 🔔 Service Request Management

- **Real-time Requests**: View incoming service requests immediately
- **Filter by Status**: Pending, Accepted, In Progress, All
- **Request Details**: Customer info, vehicle details, location, estimated fees
- **Quick Actions**: Accept/Decline requests with one tap
- **Priority Indicators**: Visual markers for urgent and emergency requests
- **Interactive Map View**: See customer location on map for accepted requests
- **Navigation**: Get turn-by-turn directions to customer location
- **Live Tracking**: View both mechanic and customer positions in real-time

### 💰 Earnings Summary

- **Today's Earnings**: Current day revenue and job count
- **Weekly Earnings**: 7-day revenue summary
- **Monthly Earnings**: 30-day revenue overview
- **Job-based Breakdown**: Earnings per job period

### ⚡ Availability Toggle

- **Online/Offline Status**: Quick toggle to start/stop receiving requests
- **Visual Feedback**: Clear indicator of current availability
- **Persistent State**: Availability saved across sessions

### 🚀 Quick Actions

- **View Map**: Navigate to map view for location-based jobs
- **Service History**: Review past completed jobs
- **Analytics**: Detailed performance and earnings analytics
- **Settings**: Configure profile and preferences

### 📈 Performance Metrics

- **Response Time**: Average time to accept requests
- **Work Hours**: Current availability schedule
- **Cancelled Jobs**: Track of declined/cancelled services

## Component Structure

```
Dashboard/
├── MechanicDashboard.jsx         # Main dashboard component
├── components/
│   ├── StatsCard.jsx             # Reusable statistic card
│   ├── ServiceRequestCard.jsx    # Service request item
│   ├── ServiceRequestDetailModal.jsx  # Map view modal for requests
│   └── index.js                  # Component exports
├── hooks/
│   ├── useMechanicStats.js       # Statistics management
│   ├── useServiceRequests.js     # Request management
│   ├── useAvailability.js        # Availability state
│   ├── useGeolocation.js         # Mechanic GPS location
│   └── index.js                  # Hook exports
├── utils/
│   ├── mapIcons.js               # Custom map marker icons
│   └── index.js                  # Utilityistics management
│   ├── useServiceRequests.js     # Request management
│   ├── useAvailability.js        # Availability state
│   └── index.js                  # Hook exports
└── README.md                      # This file
```

## Usage

### Basic Implementation

```jsx
import MechanicDashboard from "@/pages/mechanic/Dashboard/MechanicDashboard";

function App() {
  return <MechanicDashboard />;
}
```

### Using Individual Components

```jsx
import {
  StatsCard,
  ServiceRequestCard,
  AvailabilityToggle,
} from "@/pages/mechanic/Dashboard/components";

function CustomDashboard() {
  return (
    <div>
      <AvailabilityToggle onToggle={(status) => console.log(status)} />
      <StatsCard icon={DollarSign} label="Earnings" value="$1,234" />
    </div>
  );
}
```

### Using Custom Hooks

```jsx
import { useServiceRequests } from "@/pages/mechanic/Dashboard/hooks";

function RequestManager() {
  const { requests, acceptRequest, declineRequest } = useServiceRequests();

  return (
    <div>
      {requests.map((req) => (
        <button onClick={() => acceptRequest(req.id)}>
          Accept {req.customerName}
        </button>
      ))}
    </div>
  );
}
```

## Data Structure

### Service Request Object

```javascript
{
  id: 1,
  customerName: "Chan Dara",
  customerPhone: "+855 12 987 654",
  serviceType: "Tire Replacement",
  vehicleType: "Car",
  vehicleMake: "Toyota Camry",
  status: "pending", // pending, accepted, in-progress, completed, declined
  priority: "normal", // normal, urgent, emergency
  distance: 1.2,
  estimatedTripFee: 2.4,
  requestedAt: "2026-01-20T09:30:00",
  description: "Front right tire is flat...",
  location: {
    address: "St 271, Phnom Penh",
    lat: 11.5564,
    lng: 104.9282
  }
}
```

### Earnings Data Object

```javascript
{
  today: { amount: 89.5, jobs: 4 },
  thisWeek: { amount: 456.75, jobs: 18 },
  thisMonth: { amount: 1842.25, jobs: 67 }
}
```

### Mechanic Stats Object

```javascript
{
  totalJobs: 234,
  completedJobs: 218,
  rating: 4.8,
  totalReviews: 127,
  totalEarnings: 8945.5,
  responseTime: "~5 min",
  completionRate: 93.2,
  availabilityHours: "08:00 - 18:00"
}
```

## Customization

### Styling

All components use Tailwind CSS classes and can be customized via the `className` prop:

```jsx
<StatsCard
  className="bg-blue-50 border-blue-200"
  icon={Star}
  label="Custom Stat"
  value="100"
/>
```

### Color Themes

Priority and status colors can be customized in the component files:

- `x] Interactive map view for customer location
- [x] Real-time mechanic GPS tracking
- [x] Get directions integration with Google Maps
- [statusColors` in ServiceRequestCard.jsx
- `priorityColors` in ServiceRequestCard.jsx

## Future Enhancements

- [ ] Real-time notifications via WebSocket
- [ ] Detailed analytics charts and graphs
- [ ] Route optimization for service locations
- [ ] In-app messaging with customers
- [ ] Photo upload for service documentation
- [ ] Invoice generation and payment tracking
- [ ] Calendar integration for scheduling
- [ ] Multi-language support (Khmer/English)

## Dependencies

- React 18+
- Framer Motion (animations)
- Lucide React (icons)
- Tailwind CSS (styling)
- Custom UI components (Button, Card, Badge)

## Performance Considerations

- Service requests are cached and updated incrementally
- Lazy loading for request lists with virtual scrolling
- Optimistic UI updates for instant feedback
- Debounced refresh to prevent excessive API calls

## Accessibility

- Keyboard navigation support
- ARIA labels for screen readers
- Color contrast meets WCAG AA standards
- Focus indicators on interactive elements

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Android)
