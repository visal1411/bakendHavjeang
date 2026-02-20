import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, History, Settings, BarChart3 } from 'lucide-react';

/**
 * QuickActions Component
 * 
 * Simplified with clear labels and bigger buttons
 */
export const QuickActions = ({ onActionClick }) => {
  const actions = [
    {
      id: 'map',
      label: 'Map View',
      description: 'See nearby customers',
      icon: MapPin,
      color: 'bg-primary hover:bg-blue-700',
    },
    {
      id: 'history',
      label: 'Job History',
      description: 'Past completed jobs',
      icon: History,
      color: 'bg-purple-500 hover:bg-purple-600',
    },
    {
      id: 'analytics',
      label: 'My Stats',
      description: 'Performance & earnings',
      icon: BarChart3,
      color: 'bg-green-500 hover:bg-green-600',
    },
    {
      id: 'settings',
      label: 'Settings',
      description: 'Account & preferences',
      icon: Settings,
      color: 'bg-gray-500 hover:bg-gray-600',
    },
  ];

  return (
    <Card className="shadow-sm border-2 border-gray-200">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-bold">Quick Access</CardTitle>
        <p className="text-sm text-gray-600 mt-1">Shortcuts to important features</p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {actions.map((action) => {
            const Icon = action.icon;
            return (
              <Button
                key={action.id}
                onClick={() => onActionClick?.(action.id)}
                className={`${action.color} text-white flex flex-col items-center gap-2 h-auto py-5 shadow-md`}
              >
                <Icon className="w-6 h-6" />
                <div className="text-center">
                  <span className="text-sm font-bold block">{action.label}</span>
                  <span className="text-xs opacity-90 block mt-0.5">{action.description}</span>
                </div>
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
