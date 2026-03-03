import { useState } from 'react';
import { 
  Star, 
  MapPin, 
  Phone, 
  Clock,
  Heart,
  Trash2,
  Navigation,
  Wrench,
  AlertCircle,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { savedMechanics } from '@/data/mockData';
import { cn } from '@/lib/utils';
import { staggerContainer, staggerItem, fadeIn } from '@/lib/animations';

const Saved = () => {
  const [mechanics, setMechanics] = useState(savedMechanics);
  const [removingId, setRemovingId] = useState(null);

  const handleRemove = (id) => {
    setRemovingId(id);
    // Animate out then remove
    setTimeout(() => {
      setMechanics(prev => prev.filter(m => m.id !== id));
      setRemovingId(null);
    }, 300);
  };

  const handleCall = (phone) => {
    window.open(`tel:${phone}`);
  };

  const handleNavigate = (location) => {
    // In production: Open maps app with location
    console.log('Navigate to:', location);
    alert(`Opening maps to: ${location}`);
  };

  const formatSavedDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      year: 'numeric' 
    });
  };

  return (
    <div className="h-screen flex flex-col bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Header with animation */}
      <motion.div 
        className="bg-white border-b border-gray-100 px-4 md:px-6 py-4 md:py-6 z-30 safe-area-top shadow-sm flex-shrink-0"
        {...fadeIn}
      >
        <div className="max-w-4xl mx-auto text-center md:text-left">
          <motion.h1 
            className="text-xl md:text-3xl font-bold text-gray-900 mb-1.5 md:mb-2 flex items-center justify-center md:justify-start gap-2"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            >
              <Heart className="w-6 h-6 md:w-8 md:h-8 text-red-500 fill-red-500" />
            </motion.div>
            Saved Mechanics
          </motion.h1>
          <motion.p 
            className="text-xs md:text-base text-gray-600 flex items-center justify-center md:justify-start gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Your favorite mechanics
            {mechanics.length > 0 && (
              <Badge variant="secondary" className="font-semibold text-xs">
                {mechanics.length} saved
              </Badge>
            )}
          </motion.p>
        </div>
      </motion.div>

      {/* Saved Mechanics List */}
      <div className="flex-1 overflow-y-auto px-4 md:px-6 py-5 md:py-7 pb-20 md:pb-8">
        <div className="max-w-4xl mx-auto">
        <AnimatePresence mode="wait">
          {mechanics.length === 0 ? (
            <motion.div 
              key="empty"
              className="text-center py-24 bg-white rounded-3xl shadow-sm"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <motion.div
                animate={{ 
                  y: [0, -15, 0],
                  rotate: [0, -10, 10, 0]
                }}
                transition={{ 
                  duration: 4, 
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <Heart className="w-20 h-20 md:w-24 md:h-24 text-gray-300 mx-auto mb-6" />
              </motion.div>
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">No Saved Mechanics</h3>
              <p className="text-base md:text-lg text-gray-600 max-w-sm mx-auto leading-relaxed">
                Save your favorite mechanics for quick access later
              </p>
              <motion.div 
                className="mt-6 inline-flex items-center gap-2 text-sm text-primary font-medium"
                animate={{ x: [-3, 3, -3] }}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                <Sparkles className="w-4 h-4" />
                Tap the bookmark icon to save mechanics
              </motion.div>
            </motion.div>
          ) : (
            <motion.div 
              key="list"
              className="space-y-4"
              variants={staggerContainer}
              initial="initial"
              animate="animate"
            >
              {mechanics.map((mechanic, index) => (
                <motion.div
                  key={mechanic.id}
                  variants={staggerItem}
                  layout
                  exit={{ opacity: 0, x: -100, scale: 0.9 }}
                >
                  <motion.div
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className={cn(
                      "transition-all",
                      removingId === mechanic.id && "opacity-0 scale-95"
                    )}
                  >
                    <Card className="shadow-md hover:shadow-xl transition-shadow border-0 overflow-hidden">
                      <CardContent className="p-5 md:p-6 relative">
                        {/* Decorative gradient background */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-red-50 to-transparent rounded-bl-full" />
                        
                        {/* Header Row */}
                        <div className="flex items-start gap-3 md:gap-4 mb-5 relative">
                          <motion.div 
                            className="w-16 h-16 md:w-18 md:h-18 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg"
                            whileHover={{ rotate: 10, scale: 1.05 }}
                          >
                            <Wrench className="w-8 h-8 md:w-9 md:h-9 text-white" />
                          </motion.div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-gray-900 text-lg md:text-xl mb-2">
                              {mechanic.name}
                            </h3>
                            <div className="flex items-center gap-2 mb-2">
                              <div className="flex items-center gap-1.5 bg-yellow-50 px-2.5 py-1 rounded-lg">
                                <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                                <span className="font-bold text-gray-900 text-sm">{mechanic.rating}</span>
                                <span className="text-gray-500 text-xs">({mechanic.totalReviews})</span>
                              </div>
                              {mechanic.available && (
                                <>
                                  <span className="text-gray-300">•</span>
                                  <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.1 + index * 0.05, type: 'spring' }}
                                  >
                                    <Badge variant="success" className="text-xs font-bold shadow-sm">
                                      <motion.div
                                        animate={{ scale: [1, 1.2, 1] }}
                                        transition={{ repeat: Infinity, duration: 2 }}
                                        className="w-2 h-2 bg-green-400 rounded-full mr-1.5"
                                      />
                                      Available
                                    </Badge>
                                  </motion.div>
                                </>
                              )}
                            </div>
                            <p className="text-sm md:text-base text-gray-600 font-semibold">
                              {mechanic.specialty}
                            </p>
                          </div>
                        </div>

                        {/* Info Grid */}
                        <div className="space-y-3 mb-5 bg-gray-50 p-4 rounded-xl">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center shadow-sm flex-shrink-0">
                              <MapPin className="w-4.5 h-4.5 text-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs text-gray-500 font-medium">Location</p>
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-bold text-gray-900 truncate">{mechanic.location}</span>
                                <span className="text-sm font-bold text-primary whitespace-nowrap ml-2">{mechanic.distance} km</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center shadow-sm flex-shrink-0">
                              <Clock className="w-4.5 h-4.5 text-primary" />
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 font-medium">Working Hours</p>
                              <span className="text-sm font-bold text-gray-900">{mechanic.workHours}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center shadow-sm flex-shrink-0">
                              <Phone className="w-4.5 h-4.5 text-primary" />
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 font-medium">Contact</p>
                              <span className="text-sm font-bold text-gray-900">{mechanic.phone}</span>
                            </div>
                          </div>
                        </div>

                        {/* Services Badges */}
                        <div className="mb-4">
                          <p className="text-xs font-semibold text-gray-500 mb-2">Services Offered</p>
                          <div className="flex flex-wrap gap-2">
                            {mechanic.services.map((service, idx) => (
                              <motion.div
                                key={service}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.05 * idx }}
                              >
                                <Badge variant="secondary" className="text-xs capitalize font-medium">
                                  {service}
                                </Badge>
                              </motion.div>
                            ))}
                          </div>
                        </div>

                        {/* Saved Date */}
                        <div className="flex items-center gap-2 text-xs text-gray-500 mb-5 bg-red-50 px-3 py-2 rounded-lg">
                          <motion.div
                            animate={{ scale: [1, 1.3, 1] }}
                            transition={{ repeat: Infinity, duration: 2 }}
                          >
                            <Heart className="w-4 h-4 fill-red-500 text-red-500" />
                          </motion.div>
                          <span className="font-medium">Saved {formatSavedDate(mechanic.savedDate)}</span>
                        </div>

                        {/* Action Buttons */}
                        <div className="grid grid-cols-3 gap-3">
                          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button
                              variant="secondary"
                              size="default"
                              onClick={() => handleCall(mechanic.phone)}
                              className="w-full shadow-md hover:shadow-lg transition-shadow"
                            >
                              <Phone className="w-4 h-4" />
                              <span className="text-sm font-semibold">Call</span>
                            </Button>
                          </motion.div>
                          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button
                              variant="default"
                              size="default"
                              onClick={() => handleNavigate(mechanic.location)}
                              className="w-full shadow-md hover:shadow-lg transition-shadow"
                            >
                              <Navigation className="w-4 h-4" />
                              <span className="text-sm font-semibold">Navigate</span>
                            </Button>
                          </motion.div>
                          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button
                              variant="destructive"
                              size="default"
                              onClick={() => handleRemove(mechanic.id)}
                              className="w-full shadow-md hover:shadow-lg transition-shadow"
                            >
                              <Trash2 className="w-4 h-4" />
                              <span className="text-sm font-semibold">Remove</span>
                            </Button>
                          </motion.div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
        </div>
      </div>

      {/* Info Banner */}
      <AnimatePresence>
        {mechanics.length > 0 && (
          <motion.div 
            className="fixed bottom-20 md:bottom-8 left-4 right-4 md:left-auto md:right-8 md:max-w-sm z-20"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ delay: 0.5 }}
          >
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 rounded-2xl p-4 shadow-xl">
              <div className="flex items-start gap-3">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 3 }}
                >
                  <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                </motion.div>
                <div>
                  <h4 className="font-bold text-blue-900 text-sm mb-1">Quick Actions</h4>
                  <p className="text-xs text-blue-700 leading-relaxed">
                    Tap <strong>Navigate</strong> for directions or <strong>Call</strong> to contact directly.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Saved;
