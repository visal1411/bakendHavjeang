import { MapPin, Navigation } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

/**
 * Floating Location Enable Button
 * 
 * A prominent, always-visible button that allows users to enable location services.
 * Shows when location permission is denied or not granted yet.
 * 
 * Features:
 * - Eye-catching pulsing animation
 * - Clear icon and text
 * - Mobile-friendly touch target (44x44px)
 * - Accessible with ARIA labels
 * 
 * @param {Object} props
 * @param {Function} props.onEnableLocation - Callback when button is clicked
 * @param {boolean} props.isLoading - Whether location request is in progress
 */
export const EnableLocationButton = ({ onEnableLocation, isLoading = false }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="fixed bottom-32 right-4 z-40 pb-safe"
    >
      {/* Pulsing ring animation */}
      <motion.div
        className="absolute inset-0 bg-blue-500 rounded-2xl opacity-30"
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.3, 0.1, 0.3],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      
      {/* Main button */}
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button
          onClick={onEnableLocation}
          disabled={isLoading}
          className="relative bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-2xl min-h-[56px] px-6 rounded-2xl flex items-center gap-3 font-semibold text-sm border-0"
          aria-label="Enable location services"
        >
          <motion.div
            animate={isLoading ? { rotate: 360 } : {}}
            transition={isLoading ? { duration: 1, repeat: Infinity, ease: "linear" } : {}}
          >
            <Navigation className="w-5 h-5" />
          </motion.div>
          
          <span className="whitespace-nowrap">
            {isLoading ? 'Requesting...' : 'Enable Location'}
          </span>
          
          <motion.div
            animate={{
              x: [0, 3, 0],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <MapPin className="w-5 h-5" />
          </motion.div>
        </Button>
      </motion.div>

      {/* Helper text */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-center text-xs text-gray-600 mt-2 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-md"
      >
        Find mechanics near you
      </motion.p>
    </motion.div>
  );
};
