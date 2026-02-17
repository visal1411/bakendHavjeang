# Customer Profile Feature

## Overview

Basic customer profile page allowing customers to view and edit their account information, similar to standard mobile apps.

## Features

### Personal Information

- Full name
- Phone number
- Email address (optional)
- Default location

### Vehicle Information

- Make (e.g., Honda)
- Model (e.g., Civic)
- Year
- Plate number

### Account Stats

- Total service requests count
- Saved mechanics count
- Member since date

### Account Settings

- Quick links to Service History
- Quick links to Saved Mechanics

## Usage

Access the profile page from the sidebar menu:

1. Open the sidebar (hamburger menu)
2. Click on "Profile"
3. View your information
4. Click "Edit Profile" to make changes
5. Click "Save" to update or "Cancel" to discard changes

## Implementation Details

### Files Created

- `/frontend/src/pages/customer/Profile/Profile.jsx` - Main profile page component
- `/frontend/src/pages/customer/Profile/index.js` - Export file
- `/frontend/src/pages/customer/Profile/components/CustomerProfile.jsx` - Profile component with edit functionality

### Files Modified

- `/frontend/src/App.jsx` - Added customer profile route
- `/frontend/src/pages/customer/Home/components/Sidebar.jsx` - Added profile menu item
- `/frontend/src/pages/customer/Home/CustomerHome.jsx` - Added profile tab support

## Future Enhancements

- Profile picture upload
- Multiple vehicle support
- Payment method management
- Notification preferences
- Language preferences
