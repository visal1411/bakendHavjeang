import L from "leaflet";

/**
 * Customer location marker icon
 */
export const customerLocationIcon = L.divIcon({
  className: "customer-location-marker",
  html: `
    <div class="relative">
      <div class="w-12 h-12 bg-red-600 rounded-full border-3 border-white flex items-center justify-center shadow-lg animate-pulse">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="white" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
          <circle cx="12" cy="10" r="3"/>
        </svg>
      </div>
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-red-400/30 rounded-full animate-ping"></div>
    </div>
  `,
  iconSize: [48, 48],
  iconAnchor: [24, 48],
});

/**
 * Mechanic location marker icon (current position)
 */
export const mechanicLocationIcon = L.divIcon({
  className: "mechanic-location-marker",
  html: `
    <div class="relative">
      <div class="w-4 h-4 bg-primary rounded-full border-3 border-white relative z-10"></div>
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-11 h-11 bg-blue-400/20 rounded-full"></div>
    </div>
  `,
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});
