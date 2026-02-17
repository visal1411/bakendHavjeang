import { Navigation2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

/**
 * Map recenter button with pulse animation hint
 */
export const RecenterButton = ({ onClick }) => {
  return (
    <motion.div
      className="absolute right-4 bottom-[200px] md:bottom-[220px] z-40"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.5, type: 'spring', stiffness: 300 }}
    >
      <motion.div
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button
          variant="secondary"
          size="icon"
          className="shadow-xl hover:shadow-2xl transition-all h-12 w-12 bg-white border-0 rounded-xl"
          onClick={onClick}
          aria-label="Recenter map"
        >
          <motion.div
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.6 }}
          >
            <Navigation2 className="w-5 h-5 text-primary" />
          </motion.div>
        </Button>
      </motion.div>
    </motion.div>
  );
};
