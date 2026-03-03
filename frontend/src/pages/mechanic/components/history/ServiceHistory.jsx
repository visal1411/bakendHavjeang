import { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  Calendar, 
  DollarSign, 
  MapPin, 
  Phone, 
  Star,
  Download,
  TrendingUp,
  Award,
  Clock,
  Sparkles,
  FileText,
  CheckCircle,
  RefreshCw,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { serviceRequestsService } from '@/services';

const statusFilters = [
  { id: 'all', label: 'All' },
  { id: 'completed', label: 'Completed' },
  { id: 'cancelled', label: 'Cancelled' }
];

const statusStyles = {
  completed: 'bg-green-100 text-green-700 border-green-200',
  cancelled: 'bg-gray-100 text-gray-600 border-gray-200'
};

/**
 * ServiceHistory Component
 * 
 * Interactive view of past completed jobs with beautiful UI
 */
export const ServiceHistory = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState('');

  const fetchHistory = useCallback(async ({ initial } = { initial: false }) => {
    if (initial) {
      setIsLoading(true);
    } else {
      setIsRefreshing(true);
    }
    setError('');
    try {
      const data = await serviceRequestsService.getMechanicHistory();
      setHistory(Array.isArray(data) ? data : []);
    } catch (err) {
      const message = err?.response?.data?.message || 'Failed to load service history.';
      setError(message);
    } finally {
      if (initial) {
        setIsLoading(false);
      } else {
        setIsRefreshing(false);
      }
    }
  }, []);

  useEffect(() => {
    fetchHistory({ initial: true });
  }, [fetchHistory]);

  const normalizedHistory = useMemo(() => {
    return history.map((request) => {
      const services = Array.isArray(request?.service)
        ? request.service
            .map((svc) => svc?.name || svc?.serviceType)
            .filter(Boolean)
        : [];

      const tripFee = Number(request?.trip_price ?? 0);
      const servicesTotal = services.length && Array.isArray(request?.service)
        ? request.service.reduce((sum, svc) => sum + Number(svc?.price ?? 0), 0)
        : Number(request?.proposed_price ?? 0);

      let totalAmount = Number(request?.total_price ?? 0);
      if (!totalAmount) {
        totalAmount = tripFee + servicesTotal;
      }

      return {
        id: request.id,
        customerName: request?.customer?.name || 'Unknown customer',
        customerPhone: request?.customer?.phone || 'N/A',
        services,
        serviceSummary: services.length ? services.join(', ') : (request?.description || 'Custom request'),
        completedAt: request?.updated_at || request?.completedAt || request?.request_date,
        tripFee,
        serviceFee: servicesTotal,
        totalAmount,
        rating: typeof request?.rating === 'number' ? request.rating : null,
        review: request?.review || '',
        location: request?.address || 'No address provided',
        status: (request?.status || 'completed').toLowerCase()
      };
    });
  }, [history]);

  const filteredHistory = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return normalizedHistory.filter((job) => {
      const matchesSearch = term
        ? job.customerName.toLowerCase().includes(term) ||
          job.serviceSummary.toLowerCase().includes(term) ||
          job.location.toLowerCase().includes(term)
        : true;
      const matchesStatus = filterStatus === 'all' ? true : job.status === filterStatus;
      return matchesSearch && matchesStatus;
    });
  }, [normalizedHistory, searchTerm, filterStatus]);

  const totalJobs = filteredHistory.length;
  const totalEarnings = filteredHistory.reduce((sum, job) => sum + Number(job.totalAmount || 0), 0);
  const ratedJobs = filteredHistory.filter((job) => typeof job.rating === 'number');
  const averageRating = ratedJobs.length
    ? (ratedJobs.reduce((sum, job) => sum + job.rating, 0) / ratedJobs.length).toFixed(1)
    : '—';
  const averagePerJob = totalJobs ? (totalEarnings / totalJobs).toFixed(2) : '0.00';

  const formatDate = (dateString) => {
    if (!dateString) return 'Date unavailable';
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return 'Date unavailable';
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (value) => `$${Number(value || 0).toFixed(2)}`;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Service History
          </h2>
          <p className="text-sm text-gray-600 mt-1 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-accent" />
            View your completed jobs and customer reviews
          </p>
        </div>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="border-2 hover:border-primary-400"
              onClick={() => fetchHistory({ initial: true })}
              disabled={isLoading || isRefreshing}
            >
              <RefreshCw
                className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`}
              />
              Refresh
            </Button>
            <Button variant="outline" className="border-2 hover:border-primary-400">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </motion.div>
      </div>

      {error && (
        <div className="flex items-center justify-between gap-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3">
          <div className="flex items-center gap-2 text-sm font-medium text-red-700">
            <AlertCircle className="w-5 h-5" />
            <span>{error}</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="border-red-200 text-red-700 hover:bg-red-100"
            onClick={() => fetchHistory({ initial: true })}
          >
            Retry
          </Button>
        </div>
      )}

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          whileHover={{ y: -4 }}
          className="bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl p-6 text-white shadow-primary"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-primary-100 text-sm font-medium">Total Jobs</p>
              <p className="text-3xl font-bold mt-1">{totalJobs}</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Calendar className="w-6 h-6" />
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -4 }}
          className="bg-gradient-to-br from-success-500 to-success-600 rounded-2xl p-6 text-white shadow-soft"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-success-100 text-sm font-medium">Total Earned</p>
              <p className="text-3xl font-bold mt-1">
                {formatCurrency(totalEarnings)}
              </p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <DollarSign className="w-6 h-6" />
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -4 }}
          className="bg-gradient-to-br from-warning-500 to-warning-600 rounded-2xl p-6 text-white shadow-soft"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-warning-100 text-sm font-medium">Avg Rating</p>
              <div className="flex items-baseline gap-1 mt-1">
                <p className="text-3xl font-bold">{averageRating}</p>
                <Star className="w-5 h-5 fill-current" />
              </div>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Award className="w-6 h-6" />
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -4 }}
          className="bg-gradient-to-br from-accent-500 to-accent-600 rounded-2xl p-6 text-white shadow-soft"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-accent-100 text-sm font-medium">Avg Per Job</p>
              <p className="text-3xl font-bold mt-1">
                ${averagePerJob}
              </p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Search Bar */}
      <motion.div 
        className="relative"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <Input
          placeholder="Search by customer, service, or vehicle..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-12 py-6 text-base border-2 focus:border-primary-400 rounded-xl"
        />
      </motion.div>

      {/* Status Filters */}
      <div className="flex flex-wrap gap-3">
        {statusFilters.map((filter) => {
          const isActive = filterStatus === filter.id;
          return (
            <Button
              key={filter.id}
              variant={isActive ? 'default' : 'outline'}
              size="sm"
              className={`rounded-full border-2 ${isActive ? 'bg-primary text-white border-primary' : 'border-gray-200 text-gray-700'}`}
              onClick={() => setFilterStatus(filter.id)}
            >
              {filter.label}
            </Button>
          );
        })}
      </div>

      {/* History List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-600">
            <Loader2 className="w-10 h-10 animate-spin mb-3 text-primary" />
            Loading service history...
          </div>
        ) : (
          <AnimatePresence>
            {filteredHistory.map((job, index) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -4 }}
                layout
              >
                <Card className="border-2 border-gray-200 hover:border-primary-300 shadow-card hover:shadow-primary transition-all overflow-hidden">
                  <div className="h-2 bg-gradient-to-r from-success-400 via-success-500 to-success-600" />

                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                      <div className="flex-1 space-y-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center text-white font-bold text-lg">
                              {job.customerName.charAt(0)}
                            </div>
                            <div>
                              <h3 className="font-bold text-gray-900 text-lg">{job.customerName}</h3>
                              <div className="flex items-center gap-2 mt-1">
                                <Phone className="w-3.5 h-3.5 text-gray-400" />
                                <p className="text-sm text-gray-600">{job.customerPhone}</p>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className={`${statusStyles[job.status] || 'bg-gray-100 text-gray-600 border-gray-200'} capitalize`}>
                              {job.status}
                            </Badge>
                            {job.rating ? (
                              <motion.div 
                                className="flex items-center gap-1.5 bg-warning-100 px-3 py-1.5 rounded-full"
                                whileHover={{ scale: 1.05 }}
                              >
                                <Star className="w-4 h-4 fill-warning-500 text-warning-500" />
                                <span className="text-sm font-bold text-warning-700">{job.rating.toFixed(1)}</span>
                              </motion.div>
                            ) : null}
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          <Badge className="bg-primary-100 text-primary-700 border border-primary-200 flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" />
                            {job.serviceSummary}
                          </Badge>
                          <div className="flex items-center gap-1.5 text-xs text-gray-600 bg-gray-50 px-3 py-1 rounded-full">
                            <Clock className="w-3.5 h-3.5" />
                            {formatDate(job.completedAt)}
                          </div>
                        </div>

                        <div className="flex items-start gap-2 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                          <MapPin className="w-4 h-4 text-primary-500 mt-0.5 flex-shrink-0" />
                          <span>{job.location}</span>
                        </div>

                        {job.review && (
                          <motion.div 
                            className="bg-gradient-to-r from-accent-50 to-primary-50 rounded-xl p-4 border-2 border-accent-200"
                            whileHover={{ borderColor: '#A855F7' }}
                          >
                            <div className="flex items-start gap-2">
                              <FileText className="w-4 h-4 text-accent-500 mt-0.5 flex-shrink-0" />
                              <p className="text-sm text-gray-700 italic flex-1">"{job.review}"</p>
                            </div>
                          </motion.div>
                        )}
                      </div>

                      <div className="lg:w-64 space-y-3">
                        <div className="bg-gradient-to-br from-success-50 to-success-100 rounded-xl p-5 border-2 border-success-200">
                          <div className="space-y-3">
                            <div className="flex justify-between items-center text-sm">
                              <span className="text-gray-600 flex items-center gap-1">
                                <TrendingUp className="w-3.5 h-3.5" />
                                Trip Fee
                              </span>
                              <span className="font-semibold text-gray-900">{formatCurrency(job.tripFee)}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                              <span className="text-gray-600 flex items-center gap-1">
                                <DollarSign className="w-3.5 h-3.5" />
                                Service Fee
                              </span>
                              <span className="font-semibold text-gray-900">{formatCurrency(job.serviceFee)}</span>
                            </div>
                            <div className="border-t-2 border-success-300 pt-3 mt-2">
                              <div className="flex justify-between items-center">
                                <span className="text-sm font-semibold text-gray-700">Total Earned</span>
                                <span className="text-2xl font-bold bg-gradient-secondary bg-clip-text text-transparent">
                                  {formatCurrency(job.totalAmount)}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                          <Button 
                            variant="outline" 
                            className="w-full border-2 hover:border-primary-400 hover:bg-primary-50 hover:text-primary-700"
                            asChild
                            disabled={!job.customerPhone || job.customerPhone === 'N/A'}
                          >
                            <a href={job.customerPhone && job.customerPhone !== 'N/A' ? `tel:${job.customerPhone}` : undefined}>
                              <Phone className="w-4 h-4 mr-2" />
                              Call Customer
                            </a>
                          </Button>
                        </motion.div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      {/* Empty State */}
      {!isLoading && filteredHistory.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16 bg-gradient-to-br from-gray-50 to-primary-50 rounded-3xl border-2 border-dashed border-gray-300"
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="inline-block"
          >
            <div className="w-20 h-20 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-primary">
              <Calendar className="w-10 h-10 text-white" />
            </div>
          </motion.div>
          <p className="text-gray-900 font-bold text-xl mb-2">No jobs found</p>
          <p className="text-gray-600 text-sm">
            Try adjusting your search or complete more jobs to see your history
          </p>
        </motion.div>
      )}
    </div>
  );
};
