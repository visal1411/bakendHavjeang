import { MapPinOff } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

/**
 * Location permission denied state with engaging animations
 * Supports both full-screen and compact banner modes
 */
export const LocationDeniedState = ({ onRetry, compact = false }) => {
  if (compact) {
    // Compact banner mode - minimal, non-intrusive
    return (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="bg-white rounded-2xl shadow-lg p-4 border-0"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
            <MapPinOff className="w-5 h-5 text-blue-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 mb-0.5">
              Location Disabled
            </p>
            <p className="text-xs text-gray-500">
              Enable for accurate distances
            </p>
          </div>
          <motion.div 
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.05 }}
          >
            <Button
              size="sm"
              onClick={onRetry}
              className="text-xs px-4 py-2 h-auto bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white border-0 rounded-xl font-semibold shadow-md"
            >
              Enable
            </Button>
          </motion.div>
        </div>
      </motion.div>
    );
  }

  // Full-screen mode (original)
  return (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 px-6">
      <motion.div 
        className="text-center max-w-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          animate={{ 
            y: [0, -10, 0],
            rotate: [0, -5, 5, 0]
          }}
          transition={{ 
            duration: 3, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <MapPinOff className="w-20 h-20 text-red-600 mx-auto mb-6" />
        </motion.div>
        
        <motion.h3 
          className="text-2xl font-bold text-gray-900 mb-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Location Required
        </motion.h3>
        
        <motion.p 
          className="text-base text-gray-700 mb-6 leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Enable location access to find nearby mechanics and get accurate distances.
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button
            size="lg"
            onClick={onRetry}
            className="w-full shadow-lg hover:shadow-xl transition-shadow"
          >
            Enable Location
          </Button>
        </motion.div>
        
        <motion.p 
          className="text-xs text-gray-500 mt-4 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          iOS users: Check Settings → Safari → Location Services
        </motion.p>
      </motion.div>
    </div>
  );
};
