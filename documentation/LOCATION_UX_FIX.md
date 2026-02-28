# Mechanic Location UX Improvement

## Problem

Mechanics had to provide their location **twice**:

1. **Manually** entering location as text in their profile (e.g., "Daun Penh, Phnom Penh")
2. **GPS permission** requested separately when viewing service request maps

This created a poor user experience with redundant steps.

## Solution

Integrated GPS location directly into the profile, automatically populating the location field from GPS coordinates.

### How It Works

1. **Automatic GPS Detection**
   - When the profile loads, it uses the existing `useGeolocation` hook
   - GPS coordinates are automatically detected in the background
   - Coordinates are reverse-geocoded to a human-readable address using OpenStreetMap Nominatim API

2. **Visual Feedback**
   - Green checkmark (✓) indicates GPS location is active
   - "GPS" badge shows the location is auto-detected
   - Orange warning (⚠️) if GPS is unavailable, with fallback to manual entry

3. **Refresh Option**
   - Manual refresh button (Navigation icon) in edit mode
   - Allows mechanics to update their location if they've moved
   - Button is disabled if GPS is unavailable

4. **Fallback Support**
   - If GPS is denied or unavailable, mechanics can still enter location manually
   - No functionality is lost for users without GPS access

## Benefits

✅ **Single Location Entry** - Location is automatically detected via GPS, no manual typing needed  
✅ **More Accurate** - GPS coordinates are precise, not approximate text descriptions  
✅ **Better UX** - One-step process instead of two separate steps  
✅ **Real-time Updates** - Mechanics can refresh their location with one click  
✅ **Graceful Degradation** - Still works if GPS is unavailable

## Technical Implementation

### Files Modified

- `/frontend/src/pages/mechanic/components/profile/MechanicProfile.jsx`
  - Added `useGeolocation` hook import
  - Added `useEffect` to auto-populate GPS coordinates
  - Added reverse geocoding function using Nominatim API
  - Updated location input field with GPS indicator and refresh button
  - Added loading states and error handling

### Key Features Added

1. **Auto-population**: GPS coordinates automatically fill the location field
2. **Reverse Geocoding**: Converts coordinates to "District, City" format
3. **Manual Refresh**: Refresh button to update location on demand
4. **Visual Indicators**: GPS badge and status messages
5. **Error Handling**: Graceful fallback to manual entry if GPS fails

## API Used

- **Nominatim (OpenStreetMap)**: Free reverse geocoding API
- Endpoint: `https://nominatim.openstreetmap.org/reverse`
- No API key required
- Returns detailed address information from coordinates

## Usage Notes

- GPS permission is requested once when the profile loads
- Location updates automatically when GPS is available
- Mechanics can still manually edit if needed
- The same GPS system is used for service request navigation (no duplication)

## Future Enhancements

- Cache the geocoded address to reduce API calls
- Add "Use Current Location" button for immediate updates
- Show map preview of detected location
- Add location history/saved locations
