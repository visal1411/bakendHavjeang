import { Star, MapPin, Clock, Phone, Bookmark, Wrench, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

/**
 * Mechanic card component with smooth animations and hover effects
 */
export const MechanicCard = ({ mechanic, onSelect, isSaved, onToggleSave }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ scale: mechanic.available ? 1.02 : 1 }}
      whileTap={{ scale: mechanic.available ? 0.98 : 1 }}
      transition={{ duration: 0.2 }}
    >
      <Card
        onClick={() => mechanic.available && onSelect(mechanic)}
        className={cn(
          "transition-all shadow-sm",
          mechanic.available 
            ? 'hover:shadow-lg cursor-pointer' 
            : 'opacity-60 cursor-not-allowed'
        )}
      >
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            {/* Mechanic Avatar with pulse animation when available */}
            <motion.div 
              className={cn(
                "relative w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0",
                mechanic.available ? 'bg-green-600' : 'bg-gray-400'
              )}
              whileHover={mechanic.available ? { rotate: 5 } : {}}
              transition={{ duration: 0.2 }}
            >
              <Wrench className="w-7 h-7 text-white" />
              {mechanic.available && (
                <motion.div 
                  className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                />
              )}
            </motion.div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1 min-w-0 mr-2">
                <h3 className="font-bold text-gray-900 truncate text-base mb-1">{mechanic.name}</h3>
                <div className="flex items-center gap-2 text-sm">
                  <div className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-yellow-500 text-yellow-500" />
                    <span className="font-semibold text-gray-900">{mechanic.rating}</span>
                    <span className="text-gray-500 text-xs">({mechanic.totalReviews})</span>
                  </div>
                  <span className="text-gray-300">•</span>
                  <div className="flex items-center gap-1 text-gray-600">
                    <MapPin className="w-3.5 h-3.5" strokeWidth={2} />
                    <span className="font-semibold">{mechanic.distance} km</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {/* Save/Bookmark Button with animation */}
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleSave(mechanic.id);
                    }}
                    className="h-8 w-8 flex-shrink-0"
                    aria-label={isSaved ? "Remove from saved" : "Save mechanic"}
                  >
                    <motion.div
                      animate={isSaved ? { scale: [1, 1.2, 1] } : {}}
                      transition={{ duration: 0.3 }}
                    >
                      <Bookmark 
                        className={cn(
                          "w-4 h-4 transition-colors",
                          isSaved 
                            ? "fill-primary text-primary" 
                            : "text-gray-400 hover:text-primary"
                        )} 
                      />
                    </motion.div>
                  </Button>
                </motion.div>
                {mechanic.available && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                  >
                    <Badge variant="success">Available</Badge>
                  </motion.div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-gray-600 mb-2">
              <Clock className="w-3.5 h-3.5" strokeWidth={2} />
              <span>{mechanic.workHours}</span>
              {mechanic.available && (
                <>
                  <span>•</span>
                  <span className="text-green-700 font-bold">{mechanic.responseTime}</span>
                </>
              )}
            </div>

            <div className="flex flex-wrap gap-1.5 mb-3">
              {mechanic.services.slice(0, 3).map((service) => (
                <Badge key={service} variant="secondary" className="capitalize">
                  {service}
                </Badge>
              ))}
            </div>

            <div className="flex gap-2">
              <motion.div className="flex-1" whileTap={{ scale: 0.95 }}>
                <Button
                  variant="secondary"
                  className="w-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(`tel:${mechanic.phone}`);
                  }}
                >
                  <Phone className="w-4 h-4" />
                  Call
                </Button>
              </motion.div>
              <motion.div 
                className="flex-1" 
                whileTap={{ scale: mechanic.available ? 0.95 : 1 }}
              >
                <Button
                  variant={mechanic.available ? 'default' : 'secondary'}
                  className="w-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    mechanic.available && onSelect(mechanic);
                  }}
                  disabled={!mechanic.available}
                >
                  {mechanic.available ? (
                    <>
                      Request
                      <motion.div
                        animate={{ x: [0, 3, 0] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                      >
                        <ChevronRight className="w-4 h-4" />
                      </motion.div>
                    </>
                  ) : (
                    'Unavailable'
                  )}
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
    </motion.div>
  );
};
