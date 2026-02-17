import { motion, AnimatePresence } from 'framer-motion';
import { Navigation } from 'lucide-react';

/**
 * Clean Location Status Indicator
 * 
 * Minimalist location status with clean design for mobile and web
 * Shows status in top-right, prominent enable button when needed
 * 
 * Design Principles:
 * - Ultra-minimal and clean
 * - Responsive for mobile and desktop
 * - Clear call-to-action
 * - Modern flat design
 * 
 * @param {Object} props
 * @param {string} props.permission - Location permission status ('granted', 'denied', 'pending')
 * @param {Function} props.onEnableLocation - Callback to request location
 * @param {boolean} props.isLoading - Whether location request is in progress
 */
export const LocationStatusIndicator = ({ permission, onEnableLocation, isLoading = false }) => {
  const isOn = permission === 'granted';
  const isDenied = permission === 'denied';

  return (
    <>
      {/* Compact top-right status indicator */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="fixed top-3 right-3 md:top-4 md:right-4 z-40 safe-area-top"
      >
        {isOn ? (
          <div className="bg-white rounded-full px-2.5 py-1.5 md:px-3 md:py-2 shadow-sm border border-gray-100 flex items-center gap-1.5">
            <motion.div 
              className="w-1.5 h-1.5 bg-green-500 rounded-full"
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            />
            <span className="text-[10px] md:text-xs font-medium text-gray-600">
              Live
            </span>
          </div>
        ) : (
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={onEnableLocation}
            disabled={isLoading}
            className="bg-white rounded-full px-2.5 py-1.5 md:px-3 md:py-2 shadow-sm border border-gray-200 hover:border-primary/30 transition-all flex items-center gap-1.5 active:bg-gray-50"
            aria-label="Enable location"
          >
            <div className="w-1.5 h-1.5 bg-gray-300 rounded-full" />
            <span className="text-[10px] md:text-xs font-medium text-gray-500">
              {isLoading ? 'Enabling' : 'Off'}
            </span>
          </motion.button>
        )}
      </motion.div>

      {/* Clean enable button when denied */}
      <AnimatePresence>
        {isDenied && !isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed bottom-20 md:bottom-24 left-1/2 -translate-x-1/2 z-50 px-4 w-full max-w-sm"
          >
            <motion.button
              onClick={onEnableLocation}
              whileTap={{ scale: 0.97 }}
              className="w-full bg-primary text-white px-5 py-3 md:py-3.5 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2.5 font-medium text-sm md:text-base group"
            >
              <Navigation className="w-4 h-4 md:w-5 md:h-5 group-active:rotate-12 transition-transform" />
              <span>Enable Live Location</span>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
