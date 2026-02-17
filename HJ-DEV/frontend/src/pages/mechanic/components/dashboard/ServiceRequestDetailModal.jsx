import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { X, Navigation, Phone, MapPin, Clock, PlayCircle, CheckCircle2, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { customerLocationIcon, mechanicLocationIcon } from '../../utils/mapIcons';
import { useGeolocation } from '../../hooks';
import 'leaflet/dist/leaflet.css';

/**
 * Map center updater component
 */
const MapCenterUpdater = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, zoom);
    }
  }, [center, zoom, map]);
  return null;
};

/**
 * ServiceRequestDetailModal Component
 * 
 * Shows detailed view of a service request with map to locate customer
 */
export const ServiceRequestDetailModal = ({ request, onClose, onUpdateStatus }) => {
  const { position: mechanicPosition } = useGeolocation();
  const [mapCenter, setMapCenter] = useState([
    request.location.lat,
    request.location.lng,
  ]);
  const [mapZoom, setMapZoom] = useState(14);

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleGetDirections = () => {
    const destination = `${request.location.lat},${request.location.lng}`;
    // Open Google Maps with directions
    window.open(
      `https://www.google.com/maps/dir/?api=1&destination=${destination}`,
      '_blank'
    );
  };

  const handleRecenterCustomer = () => {
    setMapCenter([request.location.lat, request.location.lng]);
    setMapZoom(16);
  };

  const handleRecenterMe = () => {
    if (mechanicPosition) {
      setMapCenter([mechanicPosition.lat, mechanicPosition.lng]);
      setMapZoom(16);
    }
  };

  const priorityColors = {
    normal: 'bg-gray-100 text-gray-700',
    urgent: 'bg-orange-100 text-orange-700',
    emergency: 'bg-red-100 text-red-700',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-4xl max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-primary text-white">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-xl font-bold">{request.customerName}</h2>
              <Badge className={priorityColors[request.priority]}>
                {request.priority}
              </Badge>
            </div>
            <p className="text-sm text-blue-100">{request.serviceType}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-blue-700 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-4">
            {/* Map Section */}
            <div className="lg:col-span-2">
              <Card className="overflow-hidden">
                <div className="relative h-[400px]">
                  <MapContainer
                    center={mapCenter}
                    zoom={mapZoom}
                    style={{ width: '100%', height: '100%' }}
                    zoomControl={true}
                    scrollWheelZoom={true}
                  >
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <MapCenterUpdater center={mapCenter} zoom={mapZoom} />
                    
                    {/* Customer Location */}
                    <Marker 
                      position={[request.location.lat, request.location.lng]} 
                      icon={customerLocationIcon}
                    >
                      <Popup>
                        <div className="text-center">
                          <p className="font-bold">{request.customerName}</p>
                          <p className="text-xs text-gray-600">{request.location.address}</p>
                        </div>
                      </Popup>
                    </Marker>

                    {/* Mechanic Location */}
                    {mechanicPosition && (
                      <Marker 
                        position={[mechanicPosition.lat, mechanicPosition.lng]} 
                        icon={mechanicLocationIcon}
                      >
                        <Popup>
                          <div className="text-center">
                            <p className="font-bold">Your Location</p>
                            <p className="text-xs text-gray-600">Current position</p>
                          </div>
                        </Popup>
                      </Marker>
                    )}
                  </MapContainer>

                  {/* Map Controls */}
                  <div className="absolute top-4 right-4 flex flex-col gap-2 z-[400]">
                    <Button
                      onClick={handleRecenterCustomer}
                      size="sm"
                      className="bg-white text-gray-700 hover:bg-gray-100 shadow-lg"
                    >
                      <MapPin className="w-4 h-4 mr-1" />
                      Customer
                    </Button>
                    {mechanicPosition && (
                      <Button
                        onClick={handleRecenterMe}
                        size="sm"
                        className="bg-white text-gray-700 hover:bg-gray-100 shadow-lg"
                      >
                        <Navigation className="w-4 h-4 mr-1" />
                        Me
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            </div>

            {/* Request Details */}
            <div className="space-y-4">
              <Card className="p-4">
                <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <User className="w-4 h-4 text-primary" />
                  Customer Information
                </h3>
                <div className="space-y-2">
                  <div>
                    <p className="text-xs text-gray-600">Name</p>
                    <p className="text-sm font-medium text-gray-900">{request.customerName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Phone</p>
                    <p className="text-sm font-medium text-gray-900">{request.customerPhone}</p>
                  </div>
                </div>
              </Card>

              <Card className="p-4">
                <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary" />
                  Location Details
                </h3>
                <div className="space-y-2">
                  <div>
                    <p className="text-xs text-gray-600">Address</p>
                    <p className="text-sm font-medium text-gray-900">{request.location.address}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Distance</p>
                    <p className="text-sm font-medium text-gray-900">{request.distance} km away</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Coordinates</p>
                    <p className="text-xs text-gray-500 font-mono">
                      {request.location.lat.toFixed(6)}, {request.location.lng.toFixed(6)}
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-4">
                <h3 className="font-bold text-gray-900 mb-3">Vehicle Information</h3>
                <div className="space-y-2">
                  <div>
                    <p className="text-xs text-gray-600">Vehicle Type</p>
                    <p className="text-sm font-medium text-gray-900">{request.vehicleType}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Make/Model</p>
                    <p className="text-sm font-medium text-gray-900">{request.vehicleMake}</p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Service & Time Details */}
            <div className="space-y-4">
              <Card className="p-4">
                <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-primary" />
                  Time Information
                </h3>
                <div className="space-y-2">
                  <div>
                    <p className="text-xs text-gray-600">Requested At</p>
                    <p className="text-sm font-medium text-gray-900">
                      {formatDate(request.requestedAt)} • {formatTime(request.requestedAt)}
                    </p>
                  </div>
                  {request.acceptedAt && (
                    <div>
                      <p className="text-xs text-gray-600">Accepted At</p>
                      <p className="text-sm font-medium text-gray-900">
                        {formatTime(request.acceptedAt)}
                      </p>
                    </div>
                  )}
                  {request.arrivedAt && (
                    <div>
                      <p className="text-xs text-gray-600">Arrived At</p>
                      <p className="text-sm font-medium text-gray-900">
                        {formatTime(request.arrivedAt)}
                      </p>
                    </div>
                  )}
                </div>
              </Card>

              <Card className="p-4">
                <h3 className="font-bold text-gray-900 mb-3">Description</h3>
                <p className="text-sm text-gray-700">{request.description}</p>
              </Card>

              <Card className="p-4 bg-blue-50 border-blue-200">
                <h3 className="font-bold text-gray-900 mb-2">Estimated Trip Fee</h3>
                <p className="text-3xl font-bold text-primary">${request.estimatedTripFee.toFixed(2)}</p>
                <p className="text-xs text-gray-600 mt-1">
                  Based on {request.distance} km distance
                </p>
              </Card>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="flex gap-3">
            {request.status === 'accepted' && (
              <>
                <a href={`tel:${request.customerPhone}`} className="flex-1">
                  <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                    <Phone className="w-4 h-4 mr-2" />
                    Call Customer
                  </Button>
                </a>
                <Button
                  onClick={handleGetDirections}
                  className="flex-1 bg-primary hover:bg-blue-700 text-white"
                >
                  <Navigation className="w-4 h-4 mr-2" />
                  Get Directions
                </Button>
                <Button
                  onClick={() => onUpdateStatus?.(request.id, 'in-progress')}
                  className="flex-1 bg-orange-600 hover:bg-orange-700 text-white"
                >
                  <PlayCircle className="w-4 h-4 mr-2" />
                  Start Job
                </Button>
              </>
            )}
            {request.status === 'in-progress' && (
              <>
                <a href={`tel:${request.customerPhone}`} className="flex-1">
                  <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                    <Phone className="w-4 h-4 mr-2" />
                    Call Customer
                  </Button>
                </a>
                <Button
                  onClick={handleGetDirections}
                  className="flex-1 bg-primary hover:bg-blue-700 text-white"
                >
                  <Navigation className="w-4 h-4 mr-2" />
                  Get Directions
                </Button>
                <Button
                  onClick={() => onUpdateStatus?.(request.id, 'completed')}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                >
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Complete Job
                </Button>
              </>
            )}
            {(request.status === 'pending' || request.status === 'completed') && (
              <>
                <a href={`tel:${request.customerPhone}`} className="flex-1">
                  <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                    <Phone className="w-4 h-4 mr-2" />
                    Call Customer
                  </Button>
                </a>
                <Button
                  onClick={handleGetDirections}
                  className="flex-1 bg-primary hover:bg-blue-700 text-white"
                >
                  <Navigation className="w-4 h-4 mr-2" />
                  Get Directions
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
