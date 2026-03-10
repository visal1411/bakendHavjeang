import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Phone, MapPin, Clock, Check, X, Zap } from 'lucide-react';

/**
 * ServiceRequestCard Component
 * 
 * Redesigned for clarity and ease of use
 * UX Principles:
 * - Clear visual hierarchy (most important info first)
 * - Simple language (no jargon)
 * - Obvious actions (big buttons with clear labels)
 */
export const ServiceRequestCard = ({ request, onAccept, onDecline, onViewDetails, onComplete }) => {
  if (!request) {
    return null;
  }

  const estimatedTripFee = Number(request.estimatedTripFee ?? request.tripPrice ?? 0);
  const serviceFee = Number(request.serviceFee ?? 0);
  const totalPrice = Number(request.totalPrice ?? estimatedTripFee + serviceFee);
  const isKnownService = Boolean(request.isKnownService);
  const backendDistance = Number(request.distance);
  const hasBackendDistance = Number.isFinite(backendDistance);

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Card className="shadow-sm hover:shadow-lg transition-all border-2 border-gray-300 bg-gray-50">
      <CardContent className="p-5">
        {/* Customer Name - Big and Clear */}
        <h3 className="text-xl font-bold text-gray-900 mb-2">{request.customerName}</h3>

        {/* Service Type - Clear Label */}
        <div className="mb-4 p-3 bg-white rounded-lg border-2 border-gray-200">
          <p className="text-xs text-gray-600 mb-1">Needs Help With:</p>
          <p className="text-lg font-bold text-primary">{request.serviceType}</p>
        </div>

        {/* Service Category - Simple */}
        <div className="mb-4 p-3 bg-white rounded-lg">
          <p className="text-xs text-gray-600 mb-1">Service Type</p>
          <p className="font-medium text-gray-900">
            {request.serviceCategory}
          </p>
        </div>

        {/* Problem Description - Easy to Read */}
        {request.description && (
          <div className="mb-4 p-3 bg-white rounded-lg">
            <p className="text-xs text-gray-600 mb-1">What's Wrong:</p>
            <p className="text-sm text-gray-700">{request.description}</p>
          </div>
        )}

        {/* Customer Location - Prominent for Pending Requests */}
        <div className="mb-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border-2 border-blue-300">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <p className="text-xs text-gray-600 mb-1 flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                Customer Location
              </p>
              <p className="font-bold text-gray-900 text-base">
                {typeof request.location === 'string' ? request.location : request.location?.address || 'Location not specified'}
              </p>
            </div>
            {request.status === 'pending' && (
              <Button
                onClick={() => onViewDetails(request.id)}
                variant="outline"
                size="sm"
                className="border-2 border-blue-500 text-blue-600 hover:bg-blue-600 hover:text-white font-bold"
              >
                <MapPin className="w-4 h-4 mr-1" />
                View Map
              </Button>
            )}
          </div>
          <div className="flex items-center gap-1 text-sm text-gray-700">
            <span className="font-semibold">
              {hasBackendDistance ? `${backendDistance.toFixed(2)} km` : 'Distance unavailable'}
            </span>
            {hasBackendDistance && (
              <span className="text-gray-500">from your location</span>
            )}
          </div>
        </div>

        {/* Time Info */}
        <div className="mb-4 p-3 bg-white rounded-lg flex items-center gap-2">
          <Clock className="w-4 h-4 text-primary flex-shrink-0" />
          <div>
            <p className="text-xs text-gray-600">Requested</p>
            <p className="font-bold text-gray-900">{formatTime(request.requestedAt)}</p>
          </div>
        </div>

        {/* Earnings - Known/Unknown service mode */}
        <div className="mb-4 p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl border-2 border-blue-300">
          <p className="text-xs text-gray-600 mb-1">
            {isKnownService ? "You'll Earn (Total)" : "You'll Earn (Trip Fee)"}
          </p>
          <p className="text-3xl font-bold text-primary">
            ${isKnownService ? totalPrice.toFixed(2) : estimatedTripFee.toFixed(2)}
          </p>
          {isKnownService ? (
            <div className="text-xs text-gray-600 mt-1">
              <p>Trip fee: ${estimatedTripFee.toFixed(2)}</p>
              <p>Service fee: ${serviceFee.toFixed(2)}</p>
            </div>
          ) : (
            <p className="text-xs text-gray-600 mt-1">+ service fee (you'll decide on-site)</p>
          )}
        </div>

        {/* Action Buttons - Clear and Big */}
        <div className="flex gap-3">
          {request.status === 'pending' && (
            <>
              <Button
                onClick={() => onAccept(request.id)}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white h-12 text-base font-bold"
                size="lg"
              >
                <Check className="w-5 h-5 mr-2" />
                Accept Job
              </Button>
              <Button
                onClick={() => onDecline(request.id)}
                variant="outline"
                className="flex-1 border-2 border-gray-300 h-12 text-base font-bold hover:bg-red-50 hover:border-red-300"
                size="lg"
              >
                <X className="w-5 h-5 mr-2" />
                Decline
              </Button>
            </>
          )}
          {request.status === 'accepted' && (
            <>
              <Button
                onClick={() => onViewDetails(request.id)}
                className="flex-1 bg-primary hover:bg-blue-700 text-white h-12 text-base font-bold"
                size="lg"
              >
                <MapPin className="w-5 h-5 mr-2" />
                See Location
              </Button>
              <Button
                onClick={() => onComplete?.(request.id)}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white h-12 text-base font-bold"
                size="lg"
              >
                <Check className="w-5 h-5 mr-2" />
                Complete Job
              </Button>
              <a href={`tel:${request.customerPhone}`}>
                <Button className="bg-green-600 hover:bg-green-700 text-white h-12 px-6">
                  <Phone className="w-5 h-5" />
                </Button>
              </a>
            </>
          )}
          {request.status === 'in-progress' && (
            <>
              <Button
                onClick={() => onViewDetails(request.id)}
                className="flex-1 bg-primary hover:bg-blue-700 text-white h-12 text-base font-bold"
                size="lg"
              >
                <MapPin className="w-5 h-5 mr-2" />
                See Location
              </Button>
              <a href={`tel:${request.customerPhone}`}>
                <Button className="bg-green-600 hover:bg-green-700 text-white h-12 px-6">
                  <Phone className="w-5 h-5" />
                </Button>
              </a>
            </>
          )}
          {request.status === 'completed' && (
            <Button
              onClick={() => onViewDetails(request.id)}
              variant="outline"
              className="flex-1 h-12 text-base"
              size="lg"
            >
              View Details
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
