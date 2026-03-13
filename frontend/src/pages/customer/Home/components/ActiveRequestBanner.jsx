import { LoaderCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const statusVariantMap = {
  pending: 'secondary',
  accepted: 'success',
  proposed: 'default',
};

const statusLabelMap = {
  pending: 'Waiting for mechanic',
  accepted: 'Mechanic accepted',
  proposed: 'Price proposed',
};

export const ActiveRequestBanner = ({
  activeRequest,
  isLoading,
  onRefresh,
  onCancel,
  onAcceptPrice,
  onDeclinePrice,
}) => {
  if (!isLoading && !activeRequest) {
    return null;
  }

  return (
    <div className="absolute left-4 right-4 top-16 z-40 sm:left-6 sm:right-6 sm:top-20">
      <Card className="border border-white/70 bg-white/95 shadow-xl backdrop-blur">
        <CardContent className="flex flex-col gap-3 p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-sm font-semibold text-gray-900">Current service request</p>
              {isLoading && !activeRequest ? (
                <div className="mt-2 flex items-center gap-2 text-sm text-gray-600">
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                  <span>Checking request status...</span>
                </div>
              ) : (
                <>
                  <p className="truncate text-sm text-gray-700">
                    {activeRequest?.serviceType || 'Service request'}
                  </p>
                  <p className="truncate text-xs text-gray-500">
                    {activeRequest?.mechanicName || 'Pending Assignment'}
                  </p>
                </>
              )}
            </div>
            {activeRequest ? (
              <Badge variant={statusVariantMap[activeRequest.status] || 'secondary'}>
                {statusLabelMap[activeRequest.status] || activeRequest.status}
              </Badge>
            ) : null}
          </div>

          {activeRequest ? (
            <>
              {activeRequest.status === 'proposed' ? (
                <p className="text-sm text-gray-700">
                  Proposed total: ${activeRequest.totalAmount || activeRequest.proposedPrice || 0}
                </p>
              ) : null}
              <div className="flex flex-wrap gap-2">
                <Button size="sm" variant="secondary" onClick={() => onRefresh(false)}>
                  Refresh
                </Button>
                {activeRequest.canCancel ? (
                  <Button size="sm" variant="outline" onClick={onCancel}>
                    Cancel request
                  </Button>
                ) : null}
                {activeRequest.canRespondToPriceChange ? (
                  <Button size="sm" onClick={onAcceptPrice}>
                    Accept price
                  </Button>
                ) : null}
                {activeRequest.canRespondToPriceChange ? (
                  <Button size="sm" variant="secondary" onClick={onDeclinePrice}>
                    Decline price
                  </Button>
                ) : null}
              </div>
            </>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
};
