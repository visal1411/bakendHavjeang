# Hav-Jeang Application Issues

## Overview

This document outlines critical issues that need to be addressed in the Hav-Jeang mechanic-customer service platform. Issues are categorized by user role and priority.

---

## 🔧 Mechanic Dashboard Issues

### Issue #1: Service Request Status Management

**Priority:** High  
**Component:** Mechanic Dashboard, Service Request Flow

**Problem:**

- When a mechanic accepts a service request, the status updates to "accepted"
- However, there's no clear mechanism to track when the service is actually completed
- Missing status progression: Pending → Accepted → In Progress → Completed

**Expected Behavior:**

- Add "In Progress" status when mechanic starts working
- Add "Completed" status when service is finished
- Customer should be able to confirm completion
- Track timestamps for each status change

**Files to Update:**

- `frontend/src/pages/mechanic/components/dashboard/ServiceRequestCard.jsx`
- `frontend/src/pages/mechanic/components/dashboard/ServiceRequestDetailModal.jsx`
- `frontend/src/pages/mechanic/hooks/useServiceRequests.js`
- `frontend/src/data/mockData.js` (update service request statuses)

**Acceptance Criteria:**

- [ ] Service requests show clear status progression
- [ ] Mechanic can mark service as "In Progress"
- [ ] Mechanic can mark service as "Completed"
- [ ] Customer data filled during request is visible to mechanic
- [ ] Status updates are reflected in real-time

---

### Issue #2: Customer Information Alignment

**Priority:** High  
**Component:** Service Request Detail View

**Problem:**

- When mechanic accepts a request, they don't see all information that customer filled out
- Customer service request details are not properly displayed in mechanic dashboard
- Misalignment between customer input and mechanic view

**Expected Behavior:**

- Display all customer-provided information:
  - Customer name and contact
  - Vehicle details (make, model, year)
  - Service type requested
  - Problem description
  - Location details
  - Customer profile picture
  - Any special notes or urgency indicators

**Files to Update:**

- `frontend/src/pages/mechanic/components/dashboard/ServiceRequestDetailModal.jsx`
- `frontend/src/pages/mechanic/components/dashboard/ServiceRequestCard.jsx`
- Align data structure with `frontend/src/pages/customer/Home/components/ServiceRequestModal.jsx`

**Acceptance Criteria:**

- [ ] All customer-filled information is visible to mechanic
- [ ] Data structure matches between customer request and mechanic view
- [ ] Information is displayed in a clear, readable format

---

### Issue #3: Remove "Working On" Section (If Not Usable)

**Priority:** Medium  
**Component:** Mechanic Dashboard

**Problem:**

- "Working On" section exists but may not be functional or useful
- Clutters the dashboard without providing value

**Expected Behavior:**

- Evaluate if "Working On" section is being used
- If not functional, remove it completely
- If needed, implement proper functionality or replace with better alternative

**Files to Update:**

- `frontend/src/pages/mechanic/Dashboard/MechanicDashboard.jsx`
- `frontend/src/pages/mechanic/components/dashboard/DashboardOverview.jsx`

**Acceptance Criteria:**

- [ ] Assess usage and functionality of "Working On" section
- [ ] Either remove it or implement proper functionality
- [ ] Dashboard remains clean and functional

---

### Issue #4: Remove Quick Actions (Redundant with Sidebar)

**Priority:** Low  
**Component:** Mechanic Dashboard

**Problem:**

- Quick Actions component duplicates functionality already in sidebar
- Creates redundancy and confusion
- Takes up valuable dashboard space

**Expected Behavior:**

- Remove Quick Actions component from dashboard
- Ensure all actions are accessible via sidebar navigation
- Optimize dashboard space for more important information

**Files to Update:**

- `frontend/src/pages/mechanic/Dashboard/MechanicDashboard.jsx`
- `frontend/src/pages/mechanic/components/dashboard/QuickActions.jsx` (delete if not used elsewhere)
- `frontend/src/pages/mechanic/components/dashboard/index.js`

**Acceptance Criteria:**

- [ ] Quick Actions component removed from dashboard
- [ ] All necessary actions remain accessible via sidebar
- [ ] No broken navigation or functionality

---

### Issue #5: Services Page - UI Visibility and Color Contrast

**Priority:** High  
**Component:** Mechanic Services Page

**Problem:**

- Service UI elements are not clearly visible
- Poor color contrast makes text/buttons hard to read
- Accessibility issues with current color scheme

**Expected Behavior:**

- Improve color contrast to meet WCAG AA standards (minimum 4.5:1 for normal text)
- Make all UI elements clearly visible and readable
- Use primary color for metric cards to improve visibility
- Ensure buttons have proper contrast ratios

**Files to Update:**

- `frontend/src/pages/mechanic/Services/Services.jsx`
- `frontend/src/pages/mechanic/components/services/` (all service components)
- Update button styles to use high-contrast colors

**Acceptance Criteria:**

- [ ] All text has minimum 4.5:1 contrast ratio
- [ ] Buttons are clearly visible and distinguishable
- [ ] Metric cards use primary color for better visibility
- [ ] UI passes accessibility color contrast checks

---

### Issue #6: Service Creation - Input Type Selection

**Priority:** Medium  
**Component:** Mechanic Services - Create/Edit Service

**Problem:**

- When creating a new service, mechanics need better input options
- Should be able to select from predefined services OR type custom service name
- "Other" option should enable custom text input

**Expected Behavior:**

- Provide dropdown/select with common service types:
  - Oil Change
  - Tire Repair
  - Battery Replacement
  - Brake Service
  - Engine Diagnostics
  - Other (custom input)
- When "Other" is selected, show text input field
- Validate input before submission

**Files to Update:**

- `frontend/src/pages/mechanic/Services/Services.jsx`
- `frontend/src/pages/mechanic/components/services/` (service form components)

**Acceptance Criteria:**

- [ ] Dropdown shows predefined service types
- [ ] "Other" option enables custom text input
- [ ] Input validation works correctly
- [ ] Both selection and custom input are saved properly

---

### Issue #7: Button Color Contrast - Services and History

**Priority:** High  
**Component:** Services & History Pages

**Problem:**

- Button colors don't have sufficient contrast on both Services and History pages
- Difficult to distinguish button states (enabled/disabled/hover)
- Metric cards need better visibility with primary color

**Expected Behavior:**

- Update button styles to use high-contrast colors
- Primary buttons: Use primary color with white text
- Secondary buttons: Use outline style with primary border
- Disabled state should be clearly distinguishable
- Metric cards should use primary color for emphasis

**Files to Update:**

- `frontend/src/pages/mechanic/Services/Services.jsx`
- `frontend/src/pages/mechanic/History/History.jsx`
- `frontend/src/pages/mechanic/components/dashboard/StatsCard.jsx`
- `frontend/src/components/ui/button.jsx` (if needed)

**Acceptance Criteria:**

- [ ] All buttons meet WCAG AA contrast standards
- [ ] Button states are clearly distinguishable
- [ ] Metric cards use primary color effectively
- [ ] Consistent button styling across Services and History

---

### Issue #8: Profile Page - Image Upload and UI Improvements

**Priority:** Medium  
**Component:** Mechanic Profile Page

**Problem:**

- Profile section and cover photo need fixes
- Mechanics cannot upload profile picture
- Missing profile image upload functionality

**Expected Behavior:**

- Add profile picture upload functionality
- Add cover photo upload functionality
- Preview images before uploading
- Support common image formats (JPEG, PNG, WebP)
- Validate image size (max 5MB)
- Crop/resize images if needed

**Files to Update:**

- `frontend/src/pages/mechanic/Profile/Profile.jsx`
- `frontend/src/pages/mechanic/components/profile/` (create if needed)
- Add image upload utility functions

**Acceptance Criteria:**

- [ ] Mechanics can upload profile picture
- [ ] Mechanics can upload cover photo
- [ ] Image preview before upload
- [ ] Image validation (size, format)
- [ ] Responsive image display
- [ ] Profile section UI is clean and functional

---

## 👤 Customer Issues

### Issue #9: Show Nearby Mechanics by Zone (Grab-style)

**Priority:** High  
**Component:** Customer Home - Map View

**Problem:**

- Currently shows all mechanics without geographic grouping
- No zone-based filtering like Grab/Uber
- Difficult to find mechanics in specific area

**Expected Behavior:**

- Implement zone-based mechanic display
- Show mechanics within specific radius of customer location
- Visual indicators for mechanic density in different zones
- Filter by distance (500m, 1km, 5km, etc.)
- Show estimated arrival time based on distance

**Files to Update:**

- `frontend/src/pages/customer/Home/components/InteractiveMap.jsx`
- `frontend/src/pages/customer/Home/hooks/useMechanics.js`
- `frontend/src/pages/customer/Home/utils/helpers.js`
- Add geolocation filtering logic

**Acceptance Criteria:**

- [ ] Mechanics are filtered by zone/radius
- [ ] Distance-based filtering options available
- [ ] Visual zone indicators on map
- [ ] Shows estimated arrival time
- [ ] Performance optimized for many mechanics

---

### Issue #10: History - Active vs Inactive Requests

**Priority:** High  
**Component:** Customer History Page

**Problem:**

- History shows all requests mixed together
- No separation between active (ongoing) and completed requests
- Difficult to track current service status

**Expected Behavior:**

- Separate history into two tabs/sections:
  - **Active**: Requests that are pending, accepted, or in progress
  - **Completed**: Finished or cancelled requests
- Active requests show real-time status updates
- Clear visual indicators for request state
- Sort by most recent first

**Files to Update:**

- `frontend/src/pages/customer/History/History.jsx`
- Add filtering logic for active vs completed requests
- Update UI to show tabs or sections

**Acceptance Criteria:**

- [ ] Two clear sections: Active and Completed
- [ ] Active shows: pending, accepted, in-progress requests
- [ ] Completed shows: finished, cancelled requests
- [ ] Real-time status updates for active requests
- [ ] Clear visual distinction between states

---

## 🌍 Common Issues (Both Mechanic & Customer)

### Issue #11: Restrict Map to Cambodia Only

**Priority:** High  
**Component:** Map Component (Both User Types)

**Problem:**

- Map currently shows entire world or unrestricted region
- Should be focused on Cambodia only
- Users can pan to irrelevant areas

**Expected Behavior:**

- Set map bounds to Cambodia's geographic boundaries
- Default center: Phnom Penh (11.5564°N, 104.9282°E)
- Restrict panning outside Cambodia borders
- Set appropriate zoom levels for Cambodia
- Use Cambodia-specific location services

**Geographic Boundaries:**

- North: ~14.7°N
- South: ~10.4°N
- East: ~107.6°E
- West: ~102.3°E

**Files to Update:**

- `frontend/src/pages/customer/Home/components/InteractiveMap.jsx`
- `frontend/src/pages/mechanic/utils/mapIcons.js`
- `frontend/src/pages/customer/Home/hooks/useMapControl.js`
- Update map configuration and bounds

**Acceptance Criteria:**

- [ ] Map centered on Cambodia (Phnom Penh)
- [ ] Map bounds restricted to Cambodia
- [ ] Users cannot pan far outside Cambodia
- [ ] Appropriate zoom levels set
- [ ] Location services focus on Cambodia

---

## 📋 Implementation Priority

### Critical (P0) - Fix Immediately:

1. Issue #1: Service Status Management
2. Issue #2: Customer Information Alignment
3. Issue #5: Services UI Visibility and Color Contrast
4. Issue #7: Button Color Contrast
5. Issue #9: Nearby Mechanics by Zone
6. Issue #10: History Active/Inactive Separation
7. Issue #11: Map Restricted to Cambodia

### High (P1) - Next Sprint:

8. Issue #8: Profile Image Upload

### Medium (P2) - Following Sprint:

9. Issue #3: Remove "Working On" Section
10. Issue #6: Service Creation Input Options

### Low (P3) - Nice to Have:

11. Issue #4: Remove Quick Actions

---

## 🧪 Testing Checklist

### For Each Issue:

- [ ] Unit tests pass
- [ ] Visual regression testing completed
- [ ] Accessibility testing (color contrast, keyboard navigation)
- [ ] Mobile responsiveness verified
- [ ] Cross-browser compatibility checked (Chrome, Safari, Firefox)
- [ ] Performance impact measured
- [ ] User flow tested end-to-end

---

## 📝 Additional Notes

### Design Considerations:

- Follow existing design system and color palette
- Maintain consistency with current UI patterns
- Ensure mobile-first responsive design
- Consider loading states and error handling

### Data Structure Updates:

- May need to update mockData.js for new service statuses
- Ensure data consistency between customer and mechanic views
- Add proper validation for all user inputs

### Performance:

- Optimize map rendering for Cambodia-only bounds
- Implement lazy loading for history items
- Cache mechanic location data appropriately

---

## 🚀 Getting Started

To fix these issues:

1. Review each issue in detail
2. Check current implementation in specified files
3. Create feature branch for changes
4. Implement fixes with proper testing
5. Ensure all acceptance criteria are met
6. Submit for code review

**Questions or need clarification?** Please comment on specific issue numbers.
