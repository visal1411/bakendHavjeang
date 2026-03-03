import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Power, Check, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * AvailabilityToggle Component
 * 
 * Redesigned for clarity - makes it obvious what turning on/off means
 */
export const AvailabilityToggle = ({ initialAvailable = true, onToggle }) => {
  const [isAvailable, setIsAvailable] = useState(initialAvailable);
  const [isLoading, setIsLoading] = useState(false);

  const handleToggle = async () => {
    setIsLoading(true);
    const newStatus = !isAvailable;
    
    // Simulate API call
    setTimeout(() => {
      setIsAvailable(newStatus);
      setIsLoading(false);
      onToggle?.(newStatus);
    }, 500);
  };

  return (
    <Card className="shadow-sm border-2 border-gray-200">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-bold flex items-center gap-2">
          <Power className="w-5 h-5" />
          Work Status
        </CardTitle>
        <p className="text-sm text-gray-600 mt-1">
          Control when you receive new job requests
        </p>
      </CardHeader>
      <CardContent>
        <button
          onClick={handleToggle}
          disabled={isLoading}
          className={cn(
            "w-full relative h-20 rounded-xl transition-all duration-300 font-bold text-lg",
            "flex flex-col items-center justify-center gap-2 border-3",
            isAvailable
              ? "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white border-green-600 shadow-lg"
              : "bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-300",
            isLoading && "opacity-70 cursor-not-allowed"
          )}
        >
          <div className={cn(
            "w-4 h-4 rounded-full",
            isAvailable ? "bg-white animate-pulse" : "bg-gray-400"
          )} />
          <span>
            {isLoading ? 'Updating...' : isAvailable ? 'ONLINE - Accepting Jobs' : 'OFFLINE - Not Accepting Jobs'}
          </span>
        </button>
        
        <div className="flex items-center gap-2 text-sm mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
          {isAvailable ? (
            <>
              <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
              <p className="text-gray-700">Customers can see you and send job requests</p>
            </>
          ) : (
            <>
              <AlertTriangle className="w-4 h-4 text-orange-600 flex-shrink-0" />
              <p className="text-gray-700">You won't receive any new requests until you go online</p>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
