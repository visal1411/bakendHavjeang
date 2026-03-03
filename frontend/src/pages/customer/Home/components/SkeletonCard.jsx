import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { skeletonPulse } from '@/lib/animations';

/**
 * Skeleton loading card for mechanic cards
 * Provides visual feedback while data is loading
 */
export const SkeletonCard = () => {
  return (
    <Card className="shadow-sm">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          {/* Avatar Skeleton */}
          <motion.div 
            className="w-14 h-14 rounded-2xl bg-gray-200 flex-shrink-0"
            {...skeletonPulse}
          />

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1 min-w-0 mr-2">
                {/* Name Skeleton */}
                <motion.div 
                  className="h-5 bg-gray-200 rounded w-3/4 mb-2"
                  {...skeletonPulse}
                />
                {/* Rating and Distance Skeleton */}
                <div className="flex items-center gap-2">
                  <motion.div 
                    className="h-4 bg-gray-200 rounded w-16"
                    {...skeletonPulse}
                  />
                  <motion.div 
                    className="h-4 bg-gray-200 rounded w-12"
                    {...skeletonPulse}
                  />
                </div>
              </div>
              {/* Badge Skeleton */}
              <motion.div 
                className="h-6 w-20 bg-gray-200 rounded-full"
                {...skeletonPulse}
              />
            </div>

            {/* Work Hours Skeleton */}
            <motion.div 
              className="h-4 bg-gray-200 rounded w-32 mb-3"
              {...skeletonPulse}
            />

            {/* Service Badges Skeleton */}
            <div className="flex flex-wrap gap-1.5 mb-3">
              {[1, 2, 3].map((i) => (
                <motion.div 
                  key={i}
                  className="h-6 w-16 bg-gray-200 rounded"
                  {...skeletonPulse}
                  style={{ animationDelay: `${i * 0.1}s` }}
                />
              ))}
            </div>

            {/* Action Buttons Skeleton */}
            <div className="flex gap-2">
              <motion.div 
                className="flex-1 h-10 bg-gray-200 rounded"
                {...skeletonPulse}
              />
              <motion.div 
                className="flex-1 h-10 bg-gray-200 rounded"
                {...skeletonPulse}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

/**
 * Container for multiple skeleton cards with stagger animation
 */
export const SkeletonList = ({ count = 3 }) => {
  return (
    <div className="space-y-3 pb-4">
      {Array.from({ length: count }).map((_, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <SkeletonCard />
        </motion.div>
      ))}
    </div>
  );
};
