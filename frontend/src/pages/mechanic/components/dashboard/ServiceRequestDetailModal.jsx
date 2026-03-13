import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { X, Navigation, Phone, MapPin, Clock, CheckCircle2, User, DollarSign, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
export const ServiceRequestDetailModal = ({ request, onClose, onUpdateStatus, onProposePrice }) => {
  const { position: mechanicPosition } = useGeolocation();
  const [proposedPrice, setProposedPrice] = useState('');
  const [isProposing, setIsProposing] = useState(false);
  const [proposeError, setProposeError] = useState('');
  const customerLat = Number(request.location?.lat ?? request.request_lat);
  const customerLng = Number(request.location?.lng ?? request.request_lng);
  const hasCoordinates = Number.isFinite(customerLat) && Number.isFinite(customerLng);
  const distance = Number(request.distance);
  const distanceLabel = Number.isFinite(distance) ? `${distance} km away` : "Distance unavailable";

  const [mapCenter, setMapCenter] = useState([
    hasCoordinates ? customerLat : 13.7563,
    hasCoordinates ? customerLng : 100.5018,
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
    if (!hasCoordinates) return;
    const destination = `${customerLat},${customerLng}`;
    // Open Google Maps with directions
    window.open(
      `https://www.google.com/maps/dir/?api=1&destination=${destination}`,
      '_blank'
    );
  };

  const handleRecenterCustomer = () => {
    if (!hasCoordinates) return;
    setMapCenter([customerLat, customerLng]);
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

  const handleProposePrice = async () => {
    const price = Number(proposedPrice);
    if (!Number.isFinite(price) || price <= 0) {
      setProposeError('Please enter a valid price greater than 0');
      return;
    }
    setIsProposing(true);
    setProposeError('');
    const result = await onProposePrice?.(request.id, price);
    setIsProposing(false);
    if (result?.success) {
      setProposedPrice('');
      onClose();
    } else {
      setProposeError(result?.message || 'Failed to propose price');
    }
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
                    {hasCoordinates && (
                      <Marker
                        position={[customerLat, customerLng]}
                        icon={customerLocationIcon}
                      >
                        <Popup>
                          <div className="text-center">
                            <p className="font-bold">{request.customerName}</p>
                            <p className="text-xs text-gray-600">{request.location?.address || 'Unknown'}</p>
                          </div>
                        </Popup>
                      </Marker>
                    )}

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
                    <p className="text-sm font-medium text-gray-900">{distanceLabel}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Coordinates</p>
                    {hasCoordinates ? (
                      <p className="text-xs text-gray-500 font-mono">
                        {customerLat.toFixed(6)}, {customerLng.toFixed(6)}
                      </p>
                    ) : (
                      <p className="text-xs text-gray-500">Coordinates unavailable</p>
                    )}
                  </div>
                </div>
              </Card>

              <Card className="p-4">
                <h3 className="font-bold text-gray-900 mb-3">Service Information</h3>
                <div className="space-y-2">
                  <div>
                    <p className="text-xs text-gray-600">Service Type</p>
                    <p className="text-sm font-medium text-gray-900">{request.serviceCategory}</p>
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
                  Based on {Number.isFinite(distance) ? `${distance} km` : "backend distance"}
                </p>
              </Card>

              {/* Propose Price Form - for accepted unknown service requests */}
              {request.status === 'accepted' && !request.isKnownService && (
                <Card className="p-4 bg-orange-50 border-orange-200">
                  <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-orange-600" />
                    Propose Service Price
                  </h3>
                  <p className="text-xs text-gray-600 mb-3">
                    After inspecting the vehicle, enter the service fee you'd like to charge.
                  </p>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">$</span>
                      <Input
                        type="number"
                        min="1"
                        step="1"
                        placeholder="e.g. 25"
                        value={proposedPrice}
                        onChange={(e) => {
                          setProposedPrice(e.target.value);
                          setProposeError('');
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleProposePrice();
                          if (e.key === '-' || e.key === 'e') e.preventDefault();
                        }}
                        className="pl-7 border-2 border-orange-300 focus:border-orange-500"
                      />
                    </div>
                    <Button
                      onClick={handleProposePrice}
                      disabled={isProposing || !proposedPrice}
                      className="bg-orange-600 hover:bg-orange-700 text-white"
                    >
                      {isProposing ? (
                        <span className="flex items-center gap-1">
                          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                          Sending
                        </span>
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-1" />
                          Propose
                        </>
                      )}
                    </Button>
                  </div>
                  {proposeError && (
                    <p className="text-xs text-red-600 mt-2">{proposeError}</p>
                  )}
                </Card>
              )}

              {/* Show proposed price if already proposed */}
              {request.proposedPrice > 0 && request.status === 'proposed' && (
                <Card className="p-4 bg-purple-50 border-purple-200">
                  <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-purple-600" />
                    Proposed Price
                  </h3>
                  <p className="text-2xl font-bold text-purple-700">${Number(request.proposedPrice).toFixed(2)}</p>
                  <p className="text-xs text-gray-600 mt-1">Waiting for customer approval</p>
                </Card>
              )}
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
                  onClick={() => onUpdateStatus?.(request.id, 'completed')}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                >
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Complete Job
                </Button>
              </>
            )}
            {request.status === 'proposed' && (
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
            {(request.status === 'pending' || request.status === 'completed' || request.status === 'cancelled') && (
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
