import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Phone, MapPin, Clock, AlertCircle, Check, X, Zap } from 'lucide-react';

/**
 * ServiceRequestCard Component
 * 
 * Redesigned for clarity and ease of use
 * UX Principles:
 * - Clear visual hierarchy (most important info first)
 * - Simple language (no jargon)
 * - Obvious actions (big buttons with clear labels)
 * - Color coding for priority
 */
export const ServiceRequestCard = ({ request, onAccept, onDecline, onViewDetails }) => {
  const priorityConfig = {
    normal: { 
      bg: 'bg-gray-50', 
      border: 'border-gray-300', 
      text: 'text-gray-700',
      label: 'Normal'
    },
    urgent: { 
      bg: 'bg-orange-50', 
      border: 'border-orange-400', 
      text: 'text-orange-700',
      label: 'Urgent'
    },
    emergency: { 
      bg: 'bg-red-50', 
      border: 'border-red-500', 
      text: 'text-red-700',
      label: 'EMERGENCY'
    },
  };

  const config = priorityConfig[request.priority];

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Card className={`shadow-sm hover:shadow-lg transition-all border-2 ${config.border} ${config.bg}`}>
      <CardContent className="p-5">
        {/* Priority Badge - Top and Obvious */}
        {request.priority !== 'normal' && (
          <div className={`mb-4 inline-flex items-center gap-2 px-4 py-2 ${config.bg} border-2 ${config.border} rounded-full`}>
            <AlertCircle className={`w-5 h-5 ${config.text} ${request.priority === 'emergency' ? 'animate-pulse' : ''}`} />
            <span className={`font-bold ${config.text} text-sm`}>
              {config.label}
            </span>
          </div>
        )}

        {/* Customer Name - Big and Clear */}
        <h3 className="text-xl font-bold text-gray-900 mb-2">{request.customerName}</h3>
        
        {/* Service Type - Clear Label */}
        <div className="mb-4 p-3 bg-white rounded-lg border-2 border-gray-200">
          <p className="text-xs text-gray-600 mb-1">Needs Help With:</p>
          <p className="text-lg font-bold text-primary">{request.serviceType}</p>
        </div>

        {/* Vehicle Info - Simple */}
        <div className="mb-4 p-3 bg-white rounded-lg">
          <p className="text-xs text-gray-600 mb-1">Vehicle</p>
          <p className="font-medium text-gray-900">
            {request.vehicleType} • {request.vehicleMake}
          </p>
        </div>

        {/* Problem Description - Easy to Read */}
        {request.description && (
          <div className="mb-4 p-3 bg-white rounded-lg">
            <p className="text-xs text-gray-600 mb-1">What's Wrong:</p>
            <p className="text-sm text-gray-700">{request.description}</p>
          </div>
        )}

        {/* Location & Distance - With Icons */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="flex items-center gap-2 p-2 bg-white rounded-lg">
            <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
            <div>
              <p className="text-xs text-gray-600">Distance</p>
              <p className="font-bold text-gray-900">{request.distance} km</p>
            </div>
          </div>
          <div className="flex items-center gap-2 p-2 bg-white rounded-lg">
            <Clock className="w-4 h-4 text-primary flex-shrink-0" />
            <div>
              <p className="text-xs text-gray-600">Requested</p>
              <p className="font-bold text-gray-900">{formatTime(request.requestedAt)}</p>
            </div>
          </div>
        </div>

        {/* Trip Fee - Big and Clear */}
        <div className="mb-4 p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl border-2 border-blue-300">
          <p className="text-xs text-gray-600 mb-1">You'll Earn (Trip Fee)</p>
          <p className="text-3xl font-bold text-primary">${request.estimatedTripFee.toFixed(2)}</p>
          <p className="text-xs text-gray-600 mt-1">+ service fee (you'll decide on-site)</p>
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
