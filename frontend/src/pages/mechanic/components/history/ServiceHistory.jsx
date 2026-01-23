import { useState } from 'react';
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
  Filter,
  Download,
  TrendingUp,
  Award,
  Clock,
  User,
  Sparkles,
  FileText,
  CheckCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';

/**
 * ServiceHistory Component
 * 
 * Interactive view of past completed jobs with beautiful UI
 */
export const ServiceHistory = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // all, completed, cancelled
  
  // Mock history data - in production, fetch from API
  const historyData = [
    {
      id: 1,
      customerName: 'Ratha Chea',
      customerPhone: '+855 12 111 222',
      serviceType: 'Emergency Roadside',
      vehicleType: 'Car',
      vehicleMake: 'Lexus RX350',
      completedAt: '2026-01-19T19:35:00',
      tripFee: 4.2,
      serviceFee: 25.0,
      totalAmount: 29.2,
      rating: 5,
      review: 'Very professional and quick response! Highly recommended.',
      location: 'National Road 1, Phnom Penh',
    },
    {
      id: 2,
      customerName: 'Sokha Lim',
      customerPhone: '+855 12 222 333',
      serviceType: 'Tire Replacement',
      vehicleType: 'Moto',
      vehicleMake: 'Honda Wave',
      completedAt: '2026-01-18T15:20:00',
      tripFee: 1.5,
      serviceFee: 20.0,
      totalAmount: 21.5,
      rating: 4,
      review: 'Good service, arrived on time.',
      location: 'St 63, Phnom Penh',
    },
    {
      id: 3,
      customerName: 'Dara Chan',
      customerPhone: '+855 12 333 444',
      serviceType: 'Battery Jump Start',
      vehicleType: 'Car',
      vehicleMake: 'Toyota Camry',
      completedAt: '2026-01-17T10:45:00',
      tripFee: 2.0,
      serviceFee: 12.0,
      totalAmount: 14.0,
      rating: 5,
      review: 'Fast and efficient. Thanks!',
      location: 'Russian Blvd, Phnom Penh',
    },
    {
      id: 4,
      customerName: 'Vibol Sok',
      customerPhone: '+855 12 444 555',
      serviceType: 'Engine Diagnosis',
      vehicleType: 'Car',
      vehicleMake: 'Honda Civic',
      completedAt: '2026-01-16T14:30:00',
      tripFee: 1.8,
      serviceFee: 40.0,
      totalAmount: 41.8,
      rating: 4,
      review: 'Professional work, fair pricing.',
      location: 'Monivong Blvd, Phnom Penh',
    },
  ];

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredHistory = historyData.filter(job => {
    const matchesSearch = 
      job.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.serviceType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.vehicleMake.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });

  const totalEarnings = filteredHistory.reduce((sum, job) => sum + job.totalAmount, 0);
  const totalJobs = filteredHistory.length;
  const averageRating = (filteredHistory.reduce((sum, job) => sum + job.rating, 0) / totalJobs).toFixed(1);

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
          <Button variant="outline" className="border-2 hover:border-primary-400">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </motion.div>
      </div>

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
                ${totalEarnings.toFixed(2)}
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
                ${totalJobs > 0 ? (totalEarnings / totalJobs).toFixed(2) : '0.00'}
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

      {/* History List */}
      <div className="space-y-4">
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
                {/* Status Bar */}
                <div className="h-2 bg-gradient-to-r from-success-400 via-success-500 to-success-600" />
                
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                    {/* Left: Customer & Service Info */}
                    <div className="flex-1 space-y-4">
                      {/* Customer Info */}
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
                        <motion.div 
                          className="flex items-center gap-1.5 bg-warning-100 px-3 py-1.5 rounded-full"
                          whileHover={{ scale: 1.05 }}
                        >
                          <Star className="w-4 h-4 fill-warning-500 text-warning-500" />
                          <span className="text-sm font-bold text-warning-700">{job.rating}.0</span>
                        </motion.div>
                      </div>

                      {/* Service Details */}
                      <div className="flex flex-wrap gap-2">
                        <Badge className="bg-primary-100 text-primary-700 border border-primary-200 flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" />
                          {job.serviceType}
                        </Badge>
                        <Badge className="bg-gray-100 text-gray-700 border border-gray-200">
                          {job.vehicleType}: {job.vehicleMake}
                        </Badge>
                        <div className="flex items-center gap-1.5 text-xs text-gray-600 bg-gray-50 px-3 py-1 rounded-full">
                          <Clock className="w-3.5 h-3.5" />
                          {formatDate(job.completedAt)}
                        </div>
                      </div>

                      {/* Location */}
                      <div className="flex items-start gap-2 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                        <MapPin className="w-4 h-4 text-primary-500 mt-0.5 flex-shrink-0" />
                        <span>{job.location}</span>
                      </div>

                      {/* Review */}
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

                    {/* Right: Payment Details */}
                    <div className="lg:w-64 space-y-3">
                      <div className="bg-gradient-to-br from-success-50 to-success-100 rounded-xl p-5 border-2 border-success-200">
                        <div className="space-y-3">
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-600 flex items-center gap-1">
                              <TrendingUp className="w-3.5 h-3.5" />
                              Trip Fee
                            </span>
                            <span className="font-semibold text-gray-900">${job.tripFee.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-600 flex items-center gap-1">
                              <DollarSign className="w-3.5 h-3.5" />
                              Service Fee
                            </span>
                            <span className="font-semibold text-gray-900">${job.serviceFee.toFixed(2)}</span>
                          </div>
                          <div className="border-t-2 border-success-300 pt-3 mt-2">
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-semibold text-gray-700">Total Earned</span>
                              <span className="text-2xl font-bold bg-gradient-secondary bg-clip-text text-transparent">
                                ${job.totalAmount.toFixed(2)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <a href={`tel:${job.customerPhone}`}>
                          <Button 
                            variant="outline" 
                            className="w-full border-2 hover:border-primary-400 hover:bg-primary-50 hover:text-primary-700"
                          >
                            <Phone className="w-4 h-4 mr-2" />
                            Call Customer
                          </Button>
                        </a>
                      </motion.div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Empty State */}
      {filteredHistory.length === 0 && (
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
