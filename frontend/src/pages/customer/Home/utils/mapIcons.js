import L from "leaflet";

/**
 * Create custom marker icon for mechanics
 */
export const createCustomIcon = (available) => {
  return L.divIcon({
    className: "custom-marker",
    html: `
      <div class="relative cursor-pointer">
        <div class="w-11 h-11 rounded-full border-2 ${
          available
            ? "border-green-600 bg-green-600"
            : "border-gray-400 bg-gray-400"
        } flex items-center justify-center transition-transform hover:scale-110">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
          </svg>
        </div>
        ${
          available
            ? '<div class="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>'
            : ""
        }
      </div>
    `,
    iconSize: [44, 44],
    iconAnchor: [22, 44],
  });
};

/**
 * User location marker icon
 */
export const userLocationIcon = L.divIcon({
  className: "user-location-marker",
  html: `
    <div class="relative">
      <div class="w-4 h-4 bg-blue-600 rounded-full border-3 border-white relative z-10"></div>
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-11 h-11 bg-blue-400/20 rounded-full"></div>
    </div>
  `,
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});
