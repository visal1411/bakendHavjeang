import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, TrendingUp, Calendar } from 'lucide-react';

/**
 * EarningsSummary Component
 * 
 * Simplified earnings display - easy to understand at a glance
 */
export const EarningsSummary = ({ earnings }) => {
  const periods = [
    {
      label: 'Today',
      amount: earnings?.today?.amount || 0,
      jobs: earnings?.today?.jobs || 0,
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
    },
    {
      label: 'This Week',
      amount: earnings?.thisWeek?.amount || 0,
      jobs: earnings?.thisWeek?.jobs || 0,
      icon: TrendingUp,
      color: 'text-primary',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
    },
    {
      label: 'This Month',
      amount: earnings?.thisMonth?.amount || 0,
      jobs: earnings?.thisMonth?.jobs || 0,
      icon: Calendar,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
    },
  ];

  return (
    <Card className="shadow-sm border-2 border-gray-200">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-bold flex items-center gap-2">
          <DollarSign className="w-5 h-5" />
          Your Earnings
        </CardTitle>
        <p className="text-sm text-gray-600 mt-1">How much you've made</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {periods.map((period) => {
            const Icon = period.icon;
            return (
              <div
                key={period.label}
                className={`p-4 rounded-xl ${period.bgColor} border-2 ${period.borderColor}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Icon className={`w-5 h-5 ${period.color}`} />
                    <span className="font-bold text-gray-700">
                      {period.label}
                    </span>
                  </div>
                  <p className={`text-2xl font-bold ${period.color}`}>
                    ${period.amount.toFixed(2)}
                  </p>
                </div>
                <p className="text-sm text-gray-600 text-right">
                  {period.jobs} {period.jobs === 1 ? 'job' : 'jobs'} completed
                </p>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
