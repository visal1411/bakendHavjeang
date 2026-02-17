import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

/**
 * StatsCard Component
 * 
 * Displays a single statistic with icon, label, and value
 */
export const StatsCard = ({ icon: Icon, label, value, subValue, trend, className }) => {
  return (
    <Card className={cn("shadow-sm hover:shadow-md transition-shadow", className)}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              {Icon && <Icon className="w-4 h-4 text-gray-500" />}
              <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                {label}
              </p>
            </div>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            {subValue && (
              <p className="text-xs text-gray-500 mt-1">{subValue}</p>
            )}
          </div>
          {trend && (
            <div className={cn(
              "flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium",
              trend.type === 'up' ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
            )}>
              {trend.type === 'up' ? '↑' : '↓'}
              <span>{trend.value}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
