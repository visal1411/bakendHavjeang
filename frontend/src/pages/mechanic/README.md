# Mechanic Section

Complete mechanic functionality with clean, organized structure.

## 📁 Folder Structure

```
mechanic/
├── components/              ← ONE shared components folder
│   ├── shared/             # Shared across all pages (Sidebar, etc.)
│   ├── dashboard/          # Dashboard-specific components
│   ├── services/           # Services-specific components
│   ├── history/            # History-specific components
│   └── profile/            # Profile-specific components
├── hooks/                  ← ONE shared hooks folder
│   ├── useMechanicStats.js
│   ├── useServiceRequests.js
│   ├── useAvailability.js
│   └── useGeolocation.js
├── utils/                  ← ONE shared utils folder
│   └── mapIcons.js
├── Dashboard/              # Dashboard page
│   ├── Dashboard.jsx
│   ├── MechanicDashboard.jsx
│   ├── index.js
│   └── README.md
├── Services/               # Services page
│   ├── Services.jsx
│   ├── index.js
│   └── README.md
├── History/                # History page
│   ├── History.jsx
│   ├── index.js
│   └── README.md
└── Profile/                # Profile page
    ├── Profile.jsx
    ├── index.js
    └── README.md
```

## ✨ Why This Structure?

**Senior Developer Principles:**

1. **DRY (Don't Repeat Yourself)**: ONE components folder, not separate ones in each page
2. **Shared Resources**: All hooks and utils are reusable across any page
3. **Clear Organization**: Components grouped by feature, not scattered
4. **Easy Navigation**: Simple, predictable paths
5. **Scalability**: Easy to add new pages or components

## 📦 Import Examples

```jsx
// Import components
import { DashboardOverview } from "@/pages/mechanic/components/dashboard";
import { ServicesManagement } from "@/pages/mechanic/components/services";
import { MechanicSidebar } from "@/pages/mechanic/components/shared";

// Import hooks
import { useMechanicStats, useServiceRequests } from "@/pages/mechanic/hooks";

// Import utils
import { mechanicLocationIcon } from "@/pages/mechanic/utils";
```

## 🎯 Components Organization

### Shared Components (`components/shared/`)

- `MechanicSidebar.jsx` - Navigation sidebar used across all pages

### Dashboard Components (`components/dashboard/`)

- `DashboardOverview.jsx` - Main dashboard view
- `ServiceRequestCard.jsx` - Individual service request display
- `ServiceRequestDetailModal.jsx` - Request details modal
- `StatsCard.jsx` - Stat display card
- `AvailabilityToggle.jsx` - Online/offline toggle
- `EarningsSummary.jsx` - Earnings chart
- `QuickActions.jsx` - Quick action buttons

### Services Components (`components/services/`)

- `ServicesManagement.jsx` - CRUD for service offerings

### History Components (`components/history/`)

- `ServiceHistory.jsx` - Past jobs view with filters

### Profile Components (`components/profile/`)

- `MechanicProfile.jsx` - Profile editing

## 🪝 Hooks

All hooks are shared and can be used from any component:

- `useMechanicStats` - Fetch and manage mechanic statistics
- `useServiceRequests` - Service request management
- `useAvailability` - Online/offline status
- `useGeolocation` - Location tracking

## 🛠️ Utils

Shared utility functions:

- `mapIcons.js` - Map marker icons for Leaflet

## 📄 Pages

Each page is a clean, simple wrapper:

- **Dashboard**: Stats, requests, earnings overview
- **Services**: CRUD for service offerings
- **History**: Past completed jobs
- **Profile**: Personal and business info

## 🚀 Adding New Features

**Add a new component:**

```bash
# Add to appropriate subfolder
touch components/dashboard/NewComponent.jsx
```

**Add a new hook:**

```bash
# Add to shared hooks folder
touch hooks/useNewFeature.js
```

**Add a new page:**

```bash
mkdir NewPage
touch NewPage/NewPage.jsx NewPage/index.js NewPage/README.md
```

## 🎨 Design Principles

- **Consistency**: Same structure as customer folder
- **Simplicity**: No nested folder duplication
- **Clarity**: Clear naming and organization
- **Maintainability**: Easy to find and update code
- **Team-Friendly**: Any developer can understand quickly
