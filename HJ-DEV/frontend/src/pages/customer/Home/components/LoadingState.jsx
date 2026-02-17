import { motion } from 'framer-motion';
import { MapPin, Wrench, Search } from 'lucide-react';

/**
 * Enhanced loading state with animated icons
 * More engaging than a simple spinner
 */
export const LoadingState = () => {
  const loadingDots = [0, 1, 2];
  
  return (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="text-center px-6">
        {/* Animated Icons */}
        <div className="relative w-32 h-32 mx-auto mb-6">
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          >
            <div className="w-24 h-24 rounded-full border-4 border-primary/20 border-t-primary" />
          </motion.div>
          
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center shadow-lg">
              <Search className="w-8 h-8 text-white" />
            </div>
          </motion.div>

          {/* Orbiting Icons */}
          {[MapPin, Wrench].map((Icon, index) => (
            <motion.div
              key={index}
              className="absolute"
              style={{
                top: '50%',
                left: '50%',
                marginLeft: '-12px',
                marginTop: '-12px',
              }}
              animate={{
                x: Math.cos((index * Math.PI) + Date.now() / 1000) * 40,
                y: Math.sin((index * Math.PI) + Date.now() / 1000) * 40,
              }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <div className="w-6 h-6 bg-white rounded-lg flex items-center justify-center shadow">
                <Icon className="w-4 h-4 text-primary" />
              </div>
            </motion.div>
          ))}
        </div>

        <motion.p 
          className="text-lg font-bold text-gray-900 mb-1"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Finding mechanics
          {loadingDots.map((dot) => (
            <motion.span
              key={dot}
              animate={{ opacity: [0, 1, 0] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: dot * 0.2,
              }}
            >
              .
            </motion.span>
          ))}
        </motion.p>
        
        <motion.p 
          className="text-sm text-gray-600"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          Scanning your area for available help
        </motion.p>
      </div>
    </div>
  );
};
