import { Star, MapPin, Clock, Phone, Bookmark, Wrench, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { phnomPenhDistricts } from '@/data/mockData';

/**
 * Mechanic card component with smooth animations and hover effects
 * Enhanced with larger size and special styling for recommended/nearby mechanics
 */
export const MechanicCard = ({ mechanic, onSelect, isSaved, onToggleSave, isRecommended = false }) => {
  console.log(`MechanicCard ${mechanic.name}:`, { distance: mechanic.distance, trip_price: mechanic.trip_price, type: typeof mechanic.trip_price, isFinite: Number.isFinite(mechanic.trip_price), calculation: mechanic.trip_price ? (mechanic.trip_price / 1000).toFixed(1) : 'N/A' });
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ scale: mechanic.available ? (isRecommended ? 1.03 : 1.02) : 1 }}
      whileTap={{ scale: mechanic.available ? 0.98 : 1 }}
      transition={{ duration: 0.2 }}
    >
      <Card
        onClick={() => mechanic.available && onSelect(mechanic)}
        className={cn(
          "transition-all",
          mechanic.available
            ? 'hover:shadow-xl cursor-pointer'
            : 'opacity-60 cursor-not-allowed',
          isRecommended
            ? 'shadow-lg border-2 border-blue-200 bg-gradient-to-br from-white to-blue-50'
            : 'shadow-sm'
        )}
      >
        <CardContent className={cn(
          isRecommended ? "p-5" : "p-4"
        )}>
          <div className="flex items-start gap-3">
            {/* Mechanic Avatar with pulse animation when available - LARGER for recommended */}
            <motion.div
              className={cn(
                "relative rounded-2xl flex items-center justify-center flex-shrink-0",
                isRecommended ? "w-16 h-16" : "w-14 h-14",
                mechanic.available ? 'bg-gradient-to-br from-green-500 to-green-600' : 'bg-gray-400'
              )}
              whileHover={mechanic.available ? { rotate: 5, scale: 1.05 } : {}}
              transition={{ duration: 0.2 }}
            >
              <Wrench className={cn(
                "text-white",
                isRecommended ? "w-8 h-8" : "w-7 h-7"
              )} />
              {mechanic.available && (
                <motion.div
                  className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-green-400 rounded-full border-2 border-white shadow-lg"
                  animate={{
                    scale: [1, 1.3, 1],
                    boxShadow: [
                      '0 0 0 0 rgba(34, 197, 94, 0.7)',
                      '0 0 0 6px rgba(34, 197, 94, 0)',
                      '0 0 0 0 rgba(34, 197, 94, 0)'
                    ]
                  }}
                  transition={{ repeat: Infinity, duration: 2 }}
                />
              )}
            </motion.div>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1 min-w-0 mr-2">
                  <h3 className={cn(
                    "font-bold text-gray-900 truncate mb-1",
                    isRecommended ? "text-lg" : "text-base"
                  )}>{mechanic.name}</h3>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="flex items-center gap-1">
                      <Star className={cn(
                        "fill-yellow-500 text-yellow-500",
                        isRecommended ? "w-4 h-4" : "w-3.5 h-3.5"
                      )} />
                      <span className={cn(
                        "font-semibold text-gray-900",
                        isRecommended && "text-base"
                      )}>{mechanic.rating}</span>
                      <span className="text-gray-500 text-xs">({mechanic.totalReviews})</span>
                    </div>
                    {mechanic.distance !== undefined && (
                      <>
                        <span className="text-gray-300">•</span>
                        <div className="flex items-center gap-1 text-gray-600">
                          <MapPin className={cn(
                            isRecommended ? "w-4 h-4" : "w-3.5 h-3.5"
                          )} strokeWidth={2} />
                          <span className={cn(
                            "font-semibold",
                            isRecommended && "text-base text-green-700"
                          )}>{mechanic.distance?.toFixed(1) ?? "?"} km</span>
                        </div>
                        {Number.isFinite(mechanic.trip_price) && mechanic.trip_price > 0 && (
                          <>
                            <span className="text-gray-300">•</span>
                            <div className="text-sm font-semibold text-amber-600">
                              ${(mechanic.trip_price / 1000).toFixed(1)}k
                            </div>
                          </>
                        )}
                        {/* Zone Indicator */}
                        {mechanic.distance != null && mechanic.distance <= 5 ? (
                          <Badge className={cn(
                            "bg-green-100 text-green-700 border-green-300 px-2 py-0",
                            isRecommended ? "text-sm font-bold" : "text-xs"
                          )}>
                            ⚡ Nearby
                          </Badge>
                        ) : mechanic.distance != null ? (
                          <Badge variant="outline" className="text-orange-600 border-orange-300 text-xs px-2 py-0">
                            {mechanic.distance.toFixed(1)}km away
                          </Badge>
                        ) : null}
                      </>
                    )}
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
                      className={cn(
                        "flex-shrink-0",
                        isRecommended ? "h-9 w-9" : "h-8 w-8"
                      )}
                      aria-label={isSaved ? "Remove from saved" : "Save mechanic"}
                    >
                      <motion.div
                        animate={isSaved ? { scale: [1, 1.2, 1] } : {}}
                        transition={{ duration: 0.3 }}
                      >
                        <Bookmark
                          className={cn(
                            "transition-colors",
                            isRecommended ? "w-5 h-5" : "w-4 h-4",
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
                      <Badge variant="success" className={cn(
                        isRecommended && "text-sm px-3 py-1"
                      )}>Available</Badge>
                    </motion.div>
                  )}
                </div>
              </div>

              <div className={cn(
                "flex items-center gap-2 text-gray-600 mb-2",
                isRecommended ? "text-sm" : "text-xs"
              )}>
                <Clock className={cn(
                  isRecommended ? "w-4 h-4" : "w-3.5 h-3.5"
                )} strokeWidth={2} />
                <span className={cn(isRecommended && "font-medium")}>{mechanic.workHours}</span>
                {mechanic.available && (
                  <>
                    <span>•</span>
                    <span className={cn(
                      "text-green-700 font-bold",
                      isRecommended && "text-sm"
                    )}>{mechanic.responseTime}</span>
                  </>
                )}
                {mechanic.district && (
                  <>
                    <span>•</span>
                    <MapPin className={cn(
                      isRecommended ? "w-3.5 h-3.5" : "w-3 h-3"
                    )} />
                    <span className="font-medium">
                      {phnomPenhDistricts.find(d => d.id === mechanic.district)?.label || mechanic.location}
                    </span>
                  </>
                )}
              </div>

              <div className={cn(
                "flex flex-wrap gap-1.5 mb-3",
                isRecommended && "gap-2"
              )}>
                {mechanic.services.slice(0, 3).map((service) => (
                  <Badge key={service} variant="secondary" className={cn(
                    "capitalize",
                    isRecommended && "text-sm px-3 py-1"
                  )}>
                    {service}
                  </Badge>
                ))}
              </div>

              <div className="flex gap-2">
                <motion.div
                  className="flex-1"
                  whileTap={{ scale: 0.95 }}
                  whileHover={{ scale: isRecommended ? 1.02 : 1 }}
                >
                  <Button
                    variant="secondary"
                    className={cn(
                      "w-full",
                      isRecommended && "h-11 text-base font-semibold"
                    )}
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open(`tel:${mechanic.phone}`);
                    }}
                  >
                    <Phone className={cn(
                      isRecommended ? "w-5 h-5 mr-1" : "w-4 h-4"
                    )} />
                    Call
                  </Button>
                </motion.div>
                <motion.div
                  className="flex-1"
                  whileTap={{ scale: mechanic.available ? 0.95 : 1 }}
                  whileHover={{ scale: mechanic.available && isRecommended ? 1.02 : 1 }}
                >
                  <Button
                    variant={mechanic.available ? 'default' : 'secondary'}
                    className={cn(
                      "w-full",
                      isRecommended && "h-11 text-base font-semibold shadow-lg",
                      isRecommended && mechanic.available && "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                    )}
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
                          <ChevronRight className={cn(
                            isRecommended ? "w-5 h-5" : "w-4 h-4"
                          )} />
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
