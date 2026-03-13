import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, TrendingUp } from 'lucide-react';

/**
 * EarningsSummary Component
 * 
 * Simplified earnings display showing total earnings
 */
export const EarningsSummary = ({ totalEarnings = 0 }) => {
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
        <div className="p-5 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              <span className="font-bold text-gray-700">Total Earnings</span>
            </div>
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
          </div>
          <p className="text-4xl font-bold text-green-700">
            ${totalEarnings.toFixed(2)}
          </p>
          <p className="text-sm text-gray-600 mt-2">From all completed jobs</p>
        </div>
      </CardContent>
    </Card>
  );
};
