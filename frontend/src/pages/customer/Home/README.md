# 🏗️ Customer Home - Complete Developer Guide

> **Quick Start**: This is the main customer interface for requesting mechanic services. Everything you need to know is in this document.

---

## 📖 Table of Contents

1. [What This Does](#-what-this-does)
2. [File Structure](#-file-structure)
3. [Getting Started](#-getting-started)
4. [Understanding the Code](#-understanding-the-code)
5. [Custom Hooks Reference](#-custom-hooks-reference)
6. [Components Reference](#-components-reference)
7. [Common Tasks](#-common-tasks)
8. [Debugging Guide](#-debugging-guide)
9. [Code Standards](#-code-standards)
10. [FAQ](#-faq)

---

## 🎯 What This Does

**Goal**: Allow customers to discover and request mechanic services in under 5 seconds.

**Key Features**:

- 🗺️ Interactive map showing nearby mechanics
- 🔍 Search with autocomplete suggestions
- 🏷️ Filter by service categories (tire, battery, engine, etc.)
- 📱 Swipeable bottom sheet with mechanic cards
- 🛠️ Service request modal with trip fee calculation
- 🔖 Save favorite mechanics
- 📜 View service history
- 🌐 Offline detection

**Design Philosophy**: Map-first, emergency-ready, minimal cognitive load.

---

## 📁 File Structure

```
Home/
├── CustomerHomeRefactored.jsx      🎯 MAIN FILE - Use this
├── CustomerHome_OLD_DEPRECATED.jsx ⚠️  Don't use - old version
│
├── hooks/                          🔌 Business Logic
│   ├── useLocation.js             📍 GPS location & permissions
│   ├── useMechanics.js            🔧 Mechanics data & filtering
│   ├── useServiceRequest.js       🛠️ Service request workflow
│   ├── useBottomSheet.js          📱 Drag gesture handling
│   ├── useMapControl.js           🗺️ Map navigation
│   ├── useSavedMechanics.js       🔖 Bookmark management
│   └── useOnlineStatus.js         🌐 Network monitoring
│
└── components/                     🧩 UI Components
    ├── ExploreView.jsx            Main layout
    ├── SearchBar.jsx              Search + autocomplete
    ├── InteractiveMap.jsx         Leaflet map wrapper
    ├── BottomSheet.jsx            Draggable mechanic list
    ├── MechanicCard.jsx           Mechanic card
    ├── ServiceRequestModal.jsx    Request form
    ├── Sidebar.jsx                Navigation menu
    ├── LoadingState.jsx           Loading skeleton
    ├── LocationDeniedState.jsx    GPS error screen
    ├── OfflineBanner.jsx          Offline indicator
    ├── RecenterButton.jsx         Map button
    └── SkeletonCard.jsx           Loading placeholder
```

---

## 🚀 Getting Started

### For New Developers

**Day 1 - Read the code**:

1. Open `CustomerHomeRefactored.jsx` - See how everything connects
2. Read `hooks/useLocation.js` - Simplest hook to understand
3. Read `components/SearchBar.jsx` - Simple component example

**Day 2 - Make a change**:

1. Add a new field to mockData (e.g., `openingTime`)
2. Display it in `MechanicCard.jsx`
3. Test in browser

**Day 3 - Add a feature**:

1. Add a filter (e.g., "Show 24/7 only")
2. Update the filtering logic
3. Add UI toggle

### Running the App

```bash
cd frontend
npm run dev
# Open http://localhost:5175
```

---

## 🧠 Understanding the Code

### Architecture Pattern

```
CustomerHomeRefactored.jsx (Container)
    ↓
  Hooks (State + Logic)
    ↓
ExploreView.jsx (Layout)
    ↓
UI Components (Presentation)
```

**Key Principles**:

- **Hooks**: Handle all business logic and state
- **Components**: Pure UI, no business logic
- **Props**: Grouped by concern (location, map, mechanics, etc.)

### Data Flow Example

**When user searches for a mechanic**:

```
1. User types "Sok" in SearchBar
   ↓
2. setSearchQuery('Sok') updates state
   ↓
3. useMechanics hook filters mechanics array
   ↓
4. filteredMechanics updates
   ↓
5. BottomSheet re-renders with filtered results
   ↓
6. Map markers update
```

### Main Component Structure

```javascript
const CustomerHome = () => {
  // === DATA HOOKS ===
  const location = useLocation();              // GPS
  const mechanics = useMechanics(...);         // Mechanics data
  const serviceRequest = useServiceRequest(); // Request logic

  // === UI HOOKS ===
  const map = useMapControl();                // Map control
  const bottomSheet = useBottomSheet();       // Drag gestures
  const savedMechanics = useSavedMechanics(); // Bookmarks

  // === HANDLERS ===
  const handleMechanicSelect = (mechanic) => {
    serviceRequest.openServiceRequest(mechanic);
    map.focusOnMechanic(mechanic);
  };

  // === RENDER ===
  return <ExploreView {...groupedProps} />;
};
```

---

## 🔌 Custom Hooks Reference

### 📍 useLocation

**Purpose**: Manages GPS location and permissions

**Returns**:

```javascript
{
  userLocation: [lat, lng] | null,
  locationPermission: 'pending' | 'granted' | 'denied',
  isLoading: boolean,
  retryLocation: () => void
}
```

**Example**:

```javascript
const { userLocation, locationPermission, retryLocation } = useLocation();

if (locationPermission === "denied") {
  return <button onClick={retryLocation}>Enable GPS</button>;
}
```

**How it works**:

1. Requests permission on mount
2. Gets user coordinates
3. Falls back to Phnom Penh center if denied
4. Provides retry function

---

### 🔧 useMechanics

**Purpose**: Fetches and filters mechanics data

**Parameters**: `(searchQuery, selectedCategory)`

**Returns**:

```javascript
{
  mechanics: Array,           // All mechanics
  filteredMechanics: Array,   // Filtered results
  availableMechanics: Array,  // Only available
  isLoading: boolean
}
```

**Example**:

```javascript
const { filteredMechanics, isLoading } = useMechanics(searchQuery, "tire");
```

**Filtering logic**:

1. Filter by category (if not 'all')
2. Filter by search text (name, location, services)
3. Sort by availability

---

### 🛠️ useServiceRequest

**Purpose**: Manages service request workflow

**Parameters**: `(userLocation)`

**Returns**:

```javascript
{
  selectedMechanic: Object | null,
  showServiceRequest: boolean,
  serviceDescription: string,
  selectedServices: Array<string>,
  calculatedTripFee: number,
  openServiceRequest: (mechanic) => void,
  closeServiceRequest: () => void,
  toggleServiceType: (serviceId) => void,
  submitServiceRequest: () => void
}
```

**Example**:

```javascript
const { openServiceRequest, submitServiceRequest } =
  useServiceRequest(userLocation);

<button onClick={() => openServiceRequest(mechanic)}>Request Service</button>;
```

---

### 📱 useBottomSheet

**Purpose**: Handles drag gestures for bottom sheet

**Returns**:

```javascript
{
  bottomSheetRef: React.RefObject,
  bottomSheetState: 'collapsed' | 'expanded',
  handlers: {
    onDragStart, onDragMove, onDragEnd,
    onTouchStart, onTouchMove, onTouchEnd
  },
  toggleBottomSheet: () => void,
  getBottomSheetHeight: () => string
}
```

**Example**:

```javascript
const { bottomSheetRef, handlers, bottomSheetState } = useBottomSheet();

<div ref={bottomSheetRef} {...handlers}>
  Bottom sheet content
</div>;
```

**Gesture**: Swipe up/down with 80px threshold

---

### 🗺️ useMapControl

**Purpose**: Controls map navigation and focus

**Returns**:

```javascript
{
  mapRef: React.RefObject,
  mapCenter: [lat, lng],
  mapZoom: number,
  focusOnLocation: (location, zoom) => void,
  focusOnMechanic: (mechanic) => void,
  recenterToUser: (userLocation) => void
}
```

**Example**:

```javascript
const { focusOnMechanic, recenterToUser } = useMapControl();

<button onClick={() => focusOnMechanic(mechanic)}>View on Map</button>;
```

---

### 🔖 useSavedMechanics

**Purpose**: Manages bookmarked mechanics

**Returns**:

```javascript
{
  savedMechanicIds: Array<number>,
  toggleSaveMechanic: (id) => void,
  isMechanicSaved: (id) => boolean
}
```

**Example**:

```javascript
const { toggleSaveMechanic, isMechanicSaved } = useSavedMechanics();

<button onClick={() => toggleSaveMechanic(mechanic.id)}>
  {isMechanicSaved(mechanic.id) ? "♥" : "♡"}
</button>;
```

---

### 🌐 useOnlineStatus

**Purpose**: Monitors network connectivity

**Returns**: `boolean` (isOnline)

**Example**:

```javascript
const isOnline = useOnlineStatus();

{
  !isOnline && <OfflineBanner />;
}
```

---

## 🧩 Components Reference

### ExploreView

**Purpose**: Main layout orchestrator  
**Props**: Grouped objects (location, map, mechanics, serviceRequest, bottomSheet, ui)

### SearchBar

**Purpose**: Search with autocomplete dropdown
**Features**:

- Real-time filtering from first letter
- Highlights matching text
- Shows top 5 results
- Displays location, rating, availability
- Closes on selection or click outside

### InteractiveMap

**Purpose**: Leaflet map with mechanic markers
**Features**:

- User location marker
- Mechanic markers (clickable)
- Auto-focus on selection

### BottomSheet

**Purpose**: Draggable mechanic list
**States**: Collapsed (3 cards) / Expanded (scrollable)
**Features**:

- Swipe gestures
- Tap to toggle
- Animated transitions

### MechanicCard

**Purpose**: Individual mechanic display
**Shows**:

- Name, rating, distance
- Available services
- Availability status
- Response time
- Call/Save/Request buttons

### ServiceRequestModal

**Purpose**: Service request form
**Features**:

- Service type checkboxes
- Description textarea
- Trip fee display
- Form validation

---

## 💡 Common Tasks

### Add a New Service Category

```javascript
// 1. In /data/mockData.js
export const categories = [
  { id: "tire", label: "Tire", icon: Disc },
  { id: "newCategory", label: "New Service", icon: NewIcon }, // ← Add here
];

// 2. That's it! It automatically appears in the UI
```

### Add a New Mechanic Property

```javascript
// 1. In /data/mockData.js
export const mockMechanics = [
  {
    id: 1,
    name: "Sok Auto",
    newField: "value", // ← Add property
    // ...
  },
];

// 2. Display in MechanicCard.jsx
<p className="text-sm">{mechanic.newField}</p>;
```

### Change Map Initial Location

```javascript
// In hooks/useMapControl.js
export const useMapControl = (
  initialCenter = [YOUR_LAT, YOUR_LNG] // ← Change coordinates
) => {
```

### Add a New Filter

```javascript
// 1. Add state in CustomerHomeRefactored.jsx
const [showOnlyAvailable, setShowOnlyAvailable] = useState(false);

// 2. Update useMechanics.js filtering logic
if (showOnlyAvailable) {
  filtered = filtered.filter((m) => m.available);
}

// 3. Add toggle UI in SearchBar or ExploreView
<button onClick={() => setShowOnlyAvailable(!showOnlyAvailable)}>
  Available Only
</button>;
```

---

## 🐛 Debugging Guide

### Location Not Working

**Check**:

1. Browser console for errors
2. Permission state in React DevTools
3. HTTPS required (geolocation needs secure context)
4. Error codes: 1=denied, 2=unavailable, 3=timeout

**Solutions**:

```javascript
// Check permission state
console.log(locationPermission); // Should be 'granted'

// Manual retry
<button onClick={retryLocation}>Enable Location</button>;
```

---

### No Mechanics Showing

**Debug steps**:

1. Open React DevTools
2. Find `useMechanics` hook
3. Check `filteredMechanics` array
4. Verify search query and category filter

**Common issues**:

- Search query too restrictive
- Category filter excluding all results
- Mock data not loaded

---

### Map Not Rendering

**Check**:

1. Leaflet CSS imported (`import 'leaflet/dist/leaflet.css'`)
2. Map container has explicit height
3. Valid coordinates (not null/undefined)
4. Console errors

**Fix**:

```javascript
// Ensure map container has height
<div className="h-full w-full">
  <InteractiveMap {...props} />
</div>
```

---

### Animations Laggy

**Causes**:

- Animating non-GPU properties (width, height, margin)
- Too many re-renders
- Large lists without virtualization

**Solutions**:

```javascript
// ✅ Good - GPU accelerated
<motion.div animate={{ opacity: 1, transform: 'translateY(0)' }} />

// ❌ Bad - Forces repaint
<motion.div animate={{ marginTop: 0, height: 100 }} />
```

**Debug**:

1. Open Chrome DevTools
2. Performance tab
3. Record while scrolling
4. Look for layout/paint warnings

---

### Autocomplete Dropdown Not Closing

**Check**:

1. Click events properly attached
2. Refs not null
3. Event listeners cleaned up

**Fix**: Check SearchBar.jsx useEffect cleanup:

```javascript
useEffect(() => {
  const handleClickOutside = (event) => {
    if (!searchRef.current?.contains(event.target)) {
      setIsDropdownOpen(false);
    }
  };

  document.addEventListener("mousedown", handleClickOutside);
  return () => document.removeEventListener("mousedown", handleClickOutside);
}, []);
```

---

## 📝 Code Standards

### Naming Conventions

```javascript
// Components: PascalCase
SearchBar.jsx;
MechanicCard.jsx;

// Hooks: camelCase with 'use' prefix
useLocation.js;
useMechanics.js;

// Functions: camelCase
calculateTripFee();
formatPhoneNumber();

// Constants: UPPER_SNAKE_CASE
const FALLBACK_LOCATION = [11.5564, 104.9282];
const MAX_SEARCH_RESULTS = 5;
```

### File Organization

```javascript
// 1. Imports
import { useState } from "react";
import { Button } from "@/components/ui/button";

// 2. Constants
const MAX_DISTANCE = 10;

// 3. Component/Hook
export const MyComponent = () => {
  // State
  const [count, setCount] = useState(0);

  // Handlers
  const handleClick = () => setCount((c) => c + 1);

  // Render
  return <button onClick={handleClick}>{count}</button>;
};

// 4. Helper functions (if needed)
const helperFunction = () => {};
```

### When to Create a Hook

✅ **DO** if:

- Logic reused in multiple components
- 3+ related states
- Side effects need cleanup

❌ **DON'T** if:

- Just one useState
- Used only once
- No complex logic

### When to Create a Component

✅ **DO** if:

- Used multiple times
- File exceeds 200 lines
- Complex enough to test separately

❌ **DON'T** if:

- Used only once
- Under 50 lines
- No props or state

### Comments

```javascript
// ✅ Good - Explains WHY
// Fallback to Phnom Penh if GPS denied
const DEFAULT_LOCATION = [11.5564, 104.9282];

// ❌ Bad - Explains WHAT (obvious)
// Set location to Phnom Penh
const DEFAULT_LOCATION = [11.5564, 104.9282];

/**
 * JSDoc for exported functions
 * @param {string} query - Search text
 * @returns {Array} Filtered mechanics
 */
export const filterMechanics = (query) => {};
```

---

## ❓ FAQ

### Q: Which file should I edit?

**A**: `CustomerHomeRefactored.jsx` for main logic, or files in `hooks/` and `components/` directories.

### Q: What happened to CustomerHome.jsx?

**A**: Renamed to `CustomerHome_OLD_DEPRECATED.jsx`. It's the old 1086-line version. Don't use it.

### Q: Where do I add mock data?

**A**: `/data/mockData.js` - centralized location for all test data.

### Q: How do I test my changes?

**A**: Run `npm run dev` and open `http://localhost:5175`. Test in mobile view (Chrome DevTools).

### Q: Where are animations defined?

**A**: `/lib/animations.js` - reuse existing animations, don't create new ones.

### Q: How do I add a new page?

**A**: Create in `/pages/customer/`, add route in `App.jsx`, add to Sidebar menu.

### Q: Can I use Redux or Context?

**A**: Not needed. The current hook-based architecture is simple and works well.

### Q: How do I make the map show a different area?

**A**: Change `initialCenter` in `useMapControl.js` or pass different coordinates.

### Q: Search not working?

**A**: Check that `mockMechanics` has data and search query isn't too restrictive.

### Q: How do I add authentication?

**A**: Use the existing `AuthContext` in `/contexts/AuthContext.jsx`.

---

## 🎓 Learning Resources

### Documentation

- [React Hooks](https://react.dev/reference/react/hooks)
- [Framer Motion](https://www.framer.com/motion/)
- [Leaflet Maps](https://leafletjs.com/reference.html)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Lucide Icons](https://lucide.dev/)

### Tools

- **React DevTools**: Inspect component state and props
- **Chrome DevTools**: Debug network, performance, console
- **VS Code**: Use CMD+Click to jump to definitions

---

## ✅ Checklist Before Committing

- [ ] No console.log() statements (except intentional)
- [ ] No ESLint warnings
- [ ] Tested in mobile view (375px width)
- [ ] All animations smooth (60fps)
- [ ] Components under 200 lines
- [ ] JSDoc added for new functions
- [ ] Follows naming conventions
- [ ] Code is readable and well-organized

---

## 🚀 Summary

**Architecture**: Hooks + Components pattern (no Redux)  
**Main File**: `CustomerHomeRefactored.jsx`  
**Hooks**: Business logic in `/hooks`  
**Components**: UI in `/components`  
**Data**: Mock data in `/data/mockData.js`  
**Animations**: Defined in `/lib/animations.js`

**Key Concept**: Separation of concerns - hooks handle logic, components handle UI.

---

**Questions?** Check the code comments or ask the team!  
**Found a bug?** Check the Debugging Guide above first.  
**Adding a feature?** Follow the Common Tasks examples.

**Happy coding!** 🎉
