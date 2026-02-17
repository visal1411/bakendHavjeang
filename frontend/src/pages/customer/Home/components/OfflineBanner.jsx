import { WifiOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Offline banner component with smooth slide animation
 */
export const OfflineBanner = ({ isOnline }) => {
  return (
    <AnimatePresence>
      {!isOnline && (
        <motion.div 
          className="absolute top-0 left-0 right-0 z-50 bg-red-600 text-white py-3 px-4 flex items-center justify-center gap-2"
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          <motion.div
            animate={{ rotate: [0, -10, 10, -10, 0] }}
            transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
          >
            <WifiOff className="w-5 h-5" />
          </motion.div>
          <span className="text-sm font-bold">No internet connection</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
