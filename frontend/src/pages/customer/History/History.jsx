import { useState } from 'react';
import { 
  Clock, 
  MapPin, 
  DollarSign, 
  CheckCircle2, 
  Star,
  Phone,
  ChevronRight,
  Calendar,
  Wrench,
  Receipt,
  FileText,
  TrendingUp,
  Award,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCustomerHistory } from './useCustomerHistory';
import { cn } from '@/lib/utils';
import { staggerContainer, staggerItem, fadeIn, modalContainer, modalContent, backdropFade } from '@/lib/animations';

const History = () => {
  const [selectedHistory, setSelectedHistory] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'active', 'completed'
  
  // Use custom hook to fetch history from backend
  const { history: historyData, isLoading, cancelRequest, acceptProposedPrice, declineProposedPrice } = useCustomerHistory();

  const handleViewDetails = (item) => {
    setSelectedHistory(item);
    setShowDetails(true);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'completed': return 'bg-green-100 text-green-700 border-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'accepted': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'in-progress': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'cancelled': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  // Filter history based on active tab
  const filteredHistory = historyData.filter(item => {
    if (activeTab === 'all') return true;
    if (activeTab === 'active') {
      return ['pending', 'accepted', 'in-progress'].includes(item.status.toLowerCase());
    }
    if (activeTab === 'completed') {
      return ['completed', 'cancelled'].includes(item.status.toLowerCase());
    }
    return true;
  });

  const activeCount = historyData.filter(item => 
    ['pending', 'accepted', 'in-progress'].includes(item.status.toLowerCase())
  ).length;

  const completedCount = historyData.filter(item => 
    ['completed', 'cancelled'].includes(item.status.toLowerCase())
  ).length;

  return (
    <div className="h-screen flex flex-col bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Header with animation */}
      <motion.div 
        className="bg-white border-b border-gray-100 px-4 md:px-6 py-4 md:py-6 z-30 safe-area-top shadow-sm flex-shrink-0"
        {...fadeIn}
      >
        <div className="max-w-4xl mx-auto text-center md:text-left">
          <motion.h1 
            className="text-xl md:text-3xl font-bold text-gray-900 mb-1.5 md:mb-2 flex items-center justify-center md:justify-start gap-2"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Receipt className="w-6 h-6 md:w-8 md:h-8 text-primary" />
            Service History
          </motion.h1>
          <motion.div 
            className="flex items-center justify-center md:justify-start gap-2 md:gap-3 text-xs md:text-base"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <p className="text-gray-600">Your past mechanic services</p>
            {historyData.length > 0 && (
              <>
                <span className="text-gray-300 hidden md:inline">•</span>
                <Badge variant="secondary" className="font-semibold text-xs">
                  {historyData.length} {historyData.length === 1 ? 'service' : 'services'}
                </Badge>
              </>
            )}
          </motion.div>
        </div>
      </motion.div>

      {/* History List */}
      <div className="flex-1 overflow-y-auto px-4 md:px-6 py-5 md:py-7 pb-20 md:pb-8">
        <div className="max-w-4xl mx-auto">
        {historyData.length === 0 ? (
          <motion.div 
            className="text-center py-24 bg-white rounded-3xl shadow-sm"
            {...fadeIn}
          >
            <motion.div
              animate={{ 
                y: [0, -10, 0],
                rotate: [0, -5, 5, 0]
              }}
              transition={{ 
                duration: 3, 
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <Receipt className="w-20 h-20 md:w-24 md:h-24 text-gray-300 mx-auto mb-6" />
            </motion.div>
            <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">No Service History</h3>
            <p className="text-base md:text-lg text-gray-600 max-w-sm mx-auto">Your completed services will appear here</p>
          </motion.div>
        ) : (
          <>
            {/* Tab Navigation */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              <button
                onClick={() => setActiveTab('all')}
                className={`p-4 rounded-xl text-center transition-all border-2 ${
                  activeTab === 'all'
                    ? 'bg-primary text-white border-primary shadow-lg'
                    : 'bg-white text-gray-700 border-gray-200 hover:border-primary hover:shadow-md'
                }`}
              >
                <p className={`font-bold text-sm ${
                  activeTab === 'all' ? 'text-white' : 'text-gray-900'
                }`}>All</p>
                <p className={`text-xs ${
                  activeTab === 'all' ? 'text-blue-100' : 'text-gray-600'
                }`}>{historyData.length} services</p>
              </button>
              <button
                onClick={() => setActiveTab('active')}
                className={`p-4 rounded-xl text-center transition-all border-2 ${
                  activeTab === 'active'
                    ? 'bg-primary text-white border-primary shadow-lg'
                    : 'bg-white text-gray-700 border-gray-200 hover:border-primary hover:shadow-md'
                }`}
              >
                <p className={`font-bold text-sm ${
                  activeTab === 'active' ? 'text-white' : 'text-gray-900'
                }`}>Active</p>
                <p className={`text-xs ${
                  activeTab === 'active' ? 'text-blue-100' : 'text-gray-600'
                }`}>{activeCount} ongoing</p>
              </button>
              <button
                onClick={() => setActiveTab('completed')}
                className={`p-4 rounded-xl text-center transition-all border-2 ${
                  activeTab === 'completed'
                    ? 'bg-primary text-white border-primary shadow-lg'
                    : 'bg-white text-gray-700 border-gray-200 hover:border-primary hover:shadow-md'
                }`}
              >
                <p className={`font-bold text-sm ${
                  activeTab === 'completed' ? 'text-white' : 'text-gray-900'
                }`}>Completed</p>
                <p className={`text-xs ${
                  activeTab === 'completed' ? 'text-blue-100' : 'text-gray-600'
                }`}>{completedCount} done</p>
              </button>
            </div>

            {/* Stats Summary */}
            <motion.div 
              className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6"
              variants={staggerContainer}
              initial="initial"
              animate="animate"
            >
              <motion.div 
                className="bg-white rounded-2xl p-4 shadow-sm"
                variants={staggerItem}
              >
                <div className="flex items-center gap-2 mb-1">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  <span className="text-xs font-semibold text-gray-600">Completed</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">{historyData.filter(h => h.status === 'completed').length}</p>
              </motion.div>
              <motion.div 
                className="bg-white rounded-2xl p-4 shadow-sm"
                variants={staggerItem}
              >
                <div className="flex items-center gap-2 mb-1">
                  <DollarSign className="w-4 h-4 text-green-600" />
                  <span className="text-xs font-semibold text-gray-600">Total Spent</span>
                </div>
                <p className="text-2xl font-bold text-green-600">${historyData.reduce((sum, h) => sum + h.price, 0).toFixed(0)}</p>
              </motion.div>
              <motion.div 
                className="bg-white rounded-2xl p-4 shadow-sm"
                variants={staggerItem}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span className="text-xs font-semibold text-gray-600">Avg Rating</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">{(historyData.reduce((sum, h) => sum + h.rating, 0) / historyData.length).toFixed(1)}</p>
              </motion.div>
              <motion.div 
                className="bg-white rounded-2xl p-4 shadow-sm"
                variants={staggerItem}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Wrench className="w-4 h-4 text-primary" />
                  <span className="text-xs font-semibold text-gray-600">Services</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">{historyData.length}</p>
              </motion.div>
            </motion.div>

            <motion.div 
              className="space-y-4"
              variants={staggerContainer}
              initial="initial"
              animate="animate"
            >
              {filteredHistory.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-2xl">
                  <CheckCircle2 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-600 font-medium">No {activeTab} services</p>
                </div>
              ) : (
                filteredHistory.map((item, index) => (
                <motion.div key={item.id} variants={staggerItem}>
                  <motion.div
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Card 
                      className="shadow-md hover:shadow-xl transition-shadow cursor-pointer border-0 overflow-hidden"
                      onClick={() => handleViewDetails(item)}
                    >
                      <CardContent className="p-5 md:p-6 relative">
                        {/* Decorative gradient background */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/5 to-transparent rounded-bl-full" />
                        
                        {/* Header Row */}
                        <div className="flex items-start justify-between mb-4 relative">
                          <div className="flex items-start gap-3 md:gap-4 flex-1 min-w-0">
                            <motion.div 
                              className="w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-green-600 to-green-700 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg"
                              whileHover={{ rotate: 5, scale: 1.05 }}
                            >
                              <Wrench className="w-7 h-7 md:w-8 md:h-8 text-white" />
                            </motion.div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-bold text-gray-900 text-lg md:text-xl mb-1.5">
                                {item.mechanicName}
                              </h3>
                              <p className="text-base md:text-lg text-gray-700 font-semibold mb-2">
                                {item.serviceType}
                              </p>
                            </div>
                          </div>
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.1 + index * 0.05, type: 'spring' }}
                          >
                            <Badge className={cn("text-xs font-bold border-2 flex-shrink-0 ml-2 px-3 py-1 shadow-sm", getStatusColor(item.status))}>
                              <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />
                              {item.status}
                            </Badge>
                          </motion.div>
                        </div>

                        {/* Details Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4 bg-gray-50 p-4 rounded-xl">
                          <div className="flex items-center gap-2.5">
                            <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center shadow-sm">
                              <Calendar className="w-4.5 h-4.5 text-primary" />
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 font-medium">Service Date</p>
                              <p className="text-sm font-bold text-gray-900">{formatDate(item.serviceDate)}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2.5">
                            <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center shadow-sm">
                              <MapPin className="w-4.5 h-4.5 text-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs text-gray-500 font-medium">Location</p>
                              <p className="text-sm font-bold text-gray-900 truncate">{item.location}</p>
                            </div>
                          </div>
                        </div>

                        {/* Price & Rating */}
                        <div className="flex items-center justify-between pt-4 border-t-2 border-gray-100">
                          <div className="flex items-center gap-2">
                            <div className="bg-green-50 rounded-xl p-2">
                              <DollarSign className="w-5 h-5 text-green-600" />
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 font-medium">Total Cost</p>
                              <span className="text-2xl md:text-3xl font-bold text-green-600">${item.price.toFixed(2)}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1.5 bg-yellow-50 px-3 py-2 rounded-xl">
                              <Star className="w-5 h-5 fill-yellow-500 text-yellow-500" />
                              <span className="font-bold text-gray-900 text-base">{item.rating}</span>
                            </div>
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                              <Button size="default" variant="default" className="shadow-md hover:shadow-lg transition-shadow">
                                Details
                                <motion.div
                                  animate={{ x: [0, 4, 0] }}
                                  transition={{ repeat: Infinity, duration: 1.5 }}
                                >
                                  <ChevronRight className="w-4 h-4" />
                                </motion.div>
                              </Button>
                            </motion.div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </motion.div>
              )))
              }
            </motion.div>
          </>
        )}
        </div>
      </div>

      {/* Details Modal */}
      <AnimatePresence>
        {showDetails && selectedHistory && (
          <motion.div 
            className="fixed inset-0 bg-black/50 z-50 flex items-end md:items-center md:justify-center"
            onClick={() => setShowDetails(false)}
            {...backdropFade}
          >
            <motion.div 
              className="bg-white rounded-t-3xl md:rounded-2xl w-full md:max-w-2xl max-h-[90vh] overflow-y-auto safe-area-bottom"
              onClick={(e) => e.stopPropagation()}
              {...modalContent}
            >
              {/* Modal Header */}
              <div className="sticky top-0 bg-white border-b border-gray-100 px-5 md:px-6 py-5 md:py-6 rounded-t-3xl md:rounded-t-2xl z-10 shadow-sm">
                <div className="flex items-center justify-between">
                  <motion.h2 
                    className="text-xl md:text-2xl font-bold text-gray-900 flex items-center gap-2"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    <FileText className="w-6 h-6 text-primary" />
                    Service Details
                  </motion.h2>
                  <motion.div whileHover={{ scale: 1.1, rotate: 90 }} whileTap={{ scale: 0.9 }}>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => setShowDetails(false)}
                      className="hover:bg-gray-100"
                    >
                      <X className="w-5 h-5" />
                    </Button>
                  </motion.div>
                </div>
              </div>

            {/* Modal Content */}
            <div className="px-5 md:px-6 py-5 md:py-6">
              {/* Mechanic Info */}
              <div className="bg-gray-50 rounded-2xl p-4 mb-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-14 h-14 bg-green-600 rounded-xl flex items-center justify-center">
                    <Wrench className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-900">{selectedHistory.mechanicName}</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4" />
                      {selectedHistory.location}
                    </div>
                  </div>
                </div>
                <Button 
                  variant="secondary" 
                  size="sm" 
                  className="w-full"
                  onClick={() => window.open(`tel:${selectedHistory.mechanicPhone}`)}
                >
                  <Phone className="w-4 h-4" />
                  {selectedHistory.mechanicPhone}
                </Button>
              </div>

              {/* Service Info */}
              <div className="space-y-4 mb-5">
                <div>
                  <label className="text-sm font-semibold text-gray-600 mb-1 block">Service Type</label>
                  <p className="text-base font-medium text-gray-900">{selectedHistory.serviceType}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-600 mb-1 block">Service Date</label>
                  <p className="text-base font-medium text-gray-900">{formatDate(selectedHistory.serviceDate)}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-600 mb-1 block">Status</label>
                  <Badge className={cn("text-sm font-semibold border", getStatusColor(selectedHistory.status))}>
                    <CheckCircle2 className="w-4 h-4 mr-1" />
                    {selectedHistory.status}
                  </Badge>
                </div>
                {selectedHistory.notes && (
                  <div>
                    <label className="text-sm font-semibold text-gray-600 mb-1 block">Notes</label>
                    <p className="text-sm text-gray-700 leading-relaxed bg-blue-50 p-3 rounded-xl">
                      {selectedHistory.notes}
                    </p>
                  </div>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="bg-gray-50 rounded-2xl p-4">
                <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <Receipt className="w-5 h-5" />
                  Price Breakdown
                </h4>
                <div className="space-y-2 mb-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Trip Fee</span>
                    <div className="flex items-center gap-1">
                      <DollarSign className="w-4 h-4 text-gray-500" />
                      <span className="font-semibold text-gray-900">{selectedHistory.tripFee.toFixed(2)}</span>
                    </div>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Service Fee</span>
                    <div className="flex items-center gap-1">
                      <DollarSign className="w-4 h-4 text-gray-500" />
                      <span className="font-semibold text-gray-900">{selectedHistory.serviceFee.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                  <span className="font-bold text-gray-900">Total Amount</span>
                  <div className="flex items-center gap-1">
                    <DollarSign className="w-6 h-6 text-green-600" />
                    <span className="text-2xl font-bold text-green-600">{selectedHistory.totalAmount.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Rating */}
              <div className="mt-5 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <span className="text-sm font-semibold text-gray-600">Your Rating:</span>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={cn(
                          "w-5 h-5",
                          i < selectedHistory.rating 
                            ? "fill-yellow-500 text-yellow-500" 
                            : "text-gray-300"
                        )} 
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default History;
