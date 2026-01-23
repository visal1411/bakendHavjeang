import { AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { MechanicCard } from './MechanicCard';
import { staggerContainer, staggerItem } from '@/lib/animations';

/**
 * Draggable bottom sheet with mechanics list
 * Enhanced with spring physics and stagger animations
 */
export const BottomSheet = ({
  bottomSheetRef,
  bottomSheetState,
  filteredMechanics,
  availableMechanics,
  onDragStart,
  onDragMove,
  onDragEnd,
  onToggle,
  onMechanicSelect,
  isMechanicSaved,
  onToggleSave,
  getBottomSheetHeight
}) => {
  return (
    <motion.div
      ref={bottomSheetRef}
      className="absolute left-0 right-0 bg-white rounded-t-3xl shadow-2xl z-40 safe-area-bottom border-0"
      style={{ 
        bottom: 0, 
        height: getBottomSheetHeight(),
        touchAction: 'none'
      }}
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', damping: 30, stiffness: 300 }}
    >
      {/* Drag Handle with hover effect */}
      <motion.div 
        className="py-4 cursor-grab active:cursor-grabbing"
        onTouchStart={onDragStart}
        onTouchMove={onDragMove}
        onTouchEnd={onDragEnd}
        onMouseDown={onDragStart}
        onMouseMove={onDragMove}
        onMouseUp={onDragEnd}
        onClick={onToggle}
        whileHover={{ paddingTop: 18, paddingBottom: 14 }}
        transition={{ duration: 0.2 }}
      >
        <motion.div 
          className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto"
          whileHover={{ width: 56, height: 6, backgroundColor: '#9ca3af' }}
          transition={{ duration: 0.2 }}
        />
      </motion.div>

      {/* Header with smooth entrance */}
      <motion.div 
        className="px-5 pb-4 border-b border-gray-100"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h2 className="text-lg font-bold text-gray-900 mb-2">Nearby Mechanics</h2>
        <div className="flex items-center gap-2 text-sm">
          <motion.span 
            className="text-gray-600 font-semibold"
            key={filteredMechanics.length}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {filteredMechanics.length} found
          </motion.span>
          <span className="text-gray-300">•</span>
          <div className="flex items-center gap-1">
            <motion.div 
              className="w-1.5 h-1.5 bg-green-500 rounded-full"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
            />
            <motion.span 
              className="text-green-700 font-semibold"
              key={availableMechanics.length}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {availableMechanics.length} online
            </motion.span>
          </div>
        </div>
      </motion.div>

      {/* Mechanics List with stagger animation */}
      <div className="overflow-y-auto px-5 py-4" style={{ height: 'calc(100% - 120px)' }}>
        <AnimatePresence mode="wait">
          {filteredMechanics.length === 0 ? (
            <motion.div 
              key="empty"
              className="text-center py-20"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                initial={{ y: 20 }}
                animate={{ y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              </motion.div>
              <motion.h3 
                className="text-lg font-bold text-gray-900 mb-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                No mechanics found
              </motion.h3>
              <motion.p 
                className="text-sm text-gray-600 max-w-xs mx-auto"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                Try adjusting your search or clearing filters
              </motion.p>
            </motion.div>
          ) : (
            <motion.div 
              key="list"
              className="space-y-3 pb-4"
              variants={staggerContainer}
              initial="initial"
              animate="animate"
            >
              <AnimatePresence>
                {filteredMechanics.map((mechanic, index) => (
                  <motion.div
                    key={mechanic.id}
                    variants={staggerItem}
                    layout
                  >
                    <MechanicCard
                      mechanic={mechanic}
                      onSelect={onMechanicSelect}
                      isSaved={isMechanicSaved(mechanic.id)}
                      onToggleSave={onToggleSave}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};
