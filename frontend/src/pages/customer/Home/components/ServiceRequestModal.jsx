import { 
  X, 
  Wrench, 
  MapPin, 
  CircleDollarSign, 
  AlertCircle, 
  MessageSquare, 
  Send,
  Camera,
  Image as ImageIcon,
  Trash2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { serviceTypes } from '@/data/mockData';
import { backdropFade, modalContent } from '@/lib/animations';

/**
 * Service request modal with smooth entrance/exit animations
 */
export const ServiceRequestModal = ({
  mechanic,
  calculatedTripFee,
  selectedServices,
  serviceDescription,
  photos,
  onClose,
  onServiceToggle,
  onDescriptionChange,
  onAddPhoto,
  onRemovePhoto,
  onSubmit
}) => {
  const handlePhotoUpload = (event) => {
    const files = Array.from(event.target.files);
    files.forEach((file) => onAddPhoto(file));
    event.target.value = ''; // Reset input
  };
  return (
    <motion.div 
      className="absolute inset-0 z-50 bg-black/50 flex items-end" 
      onClick={onClose}
      {...backdropFade}
    >
      <motion.div 
        className="bg-white rounded-t-3xl w-full max-h-[90%] overflow-y-auto safe-area-bottom"
        onClick={(e) => e.stopPropagation()}
        {...modalContent}
      >
        {/* Modal Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 px-5 py-4 z-10">
          <div className="flex items-center justify-between mb-3">
            <motion.h2 
              className="text-xl font-bold text-gray-900"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              Request Service
            </motion.h2>
            <motion.button 
              onClick={onClose}
              className="p-2 hover:bg-gray-50 rounded-full transition-colors"
              whileTap={{ scale: 0.9, rotate: 90 }}
              whileHover={{ scale: 1.1 }}
            >
              <X className="w-6 h-6 text-gray-500" />
            </motion.button>
          </div>
          
          {/* Mechanic Info with entrance animation */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <Card className="shadow-none border-0 bg-gray-50">
              <CardContent className="p-3">
                <div className="flex items-center gap-3">
                  <motion.div 
                    className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center flex-shrink-0"
                    whileHover={{ rotate: 10, scale: 1.05 }}
                  >
                    <Wrench className="w-6 h-6 text-white" />
                  </motion.div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-900 truncate">{mechanic.name}</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{mechanic.distance} km away</span>
                      <span>•</span>
                      <span className="text-green-700 font-semibold">{mechanic.responseTime}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Trip Fee with scale animation */}
          <motion.div 
            className="mt-3 bg-blue-50 rounded-xl p-3 flex items-center justify-between"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center gap-2">
              <CircleDollarSign className="w-5 h-5 text-blue-600" />
              <span className="font-semibold text-gray-900">Trip Fee</span>
            </div>
            <motion.span 
              className="text-xl font-bold text-blue-600"
              key={calculatedTripFee}
              initial={{ scale: 1.2, color: '#2563eb' }}
              animate={{ scale: 1, color: '#2563eb' }}
            >
              ${calculatedTripFee}
            </motion.span>
          </motion.div>
        </div>

        {/* Modal Content */}
        <div className="px-5 py-6">
          {/* Service Selection with stagger animation */}
          <motion.div 
            className="mb-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            <label className="block text-sm font-bold text-gray-900 mb-3">
              <AlertCircle className="w-4 h-4 inline mr-1" />
              What service do you need?
            </label>
            <div className="grid grid-cols-2 gap-2">
              {serviceTypes.map((service, index) => {
                const IconComponent = service.icon;
                const isSelected = selectedServices.includes(service.id);
                return (
                  <motion.div
                    key={service.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 + index * 0.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      onClick={() => onServiceToggle(service.id)}
                      variant={isSelected ? 'default' : 'secondary'}
                      className={`w-full justify-start h-auto py-3 transition-all ${
                        isSelected ? 'shadow-md' : ''
                      }`}
                    >
                      <motion.div
                        animate={isSelected ? { rotate: [0, -10, 10, 0] } : {}}
                        transition={{ duration: 0.3 }}
                      >
                        <IconComponent className="w-4 h-4" />
                      </motion.div>
                      <span className="text-xs">{service.label}</span>
                    </Button>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Issue Description with smooth entrance */}
          <motion.div 
            className="mb-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <label className="block text-sm font-bold text-gray-900 mb-3">
              <MessageSquare className="w-4 h-4 inline mr-1" />
              Describe your issue (optional)
            </label>
            <textarea
              value={serviceDescription}
              onChange={(e) => onDescriptionChange(e.target.value)}
              placeholder="e.g., Car won't start, strange noise from engine..."
              rows="4"
              className="w-full px-4 py-3 bg-gray-50 rounded-xl focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary/20 transition-all resize-none text-sm"
            />
          </motion.div>

          {/* Photo Upload Section */}
          <motion.div 
            className="mb-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.42 }}
          >
            <label className="block text-sm font-bold text-gray-900 mb-3">
              <Camera className="w-4 h-4 inline mr-1" />
              Add Photos (optional)
              <span className="text-xs font-normal text-gray-500 ml-2">
                Help mechanic see the problem
              </span>
            </label>

            {/* Photo Grid */}
            {photos && photos.length > 0 && (
              <div className="grid grid-cols-3 gap-2 mb-3">
                {photos.map((photo, index) => (
                  <motion.div
                    key={photo.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ delay: index * 0.05 }}
                    className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 group"
                  >
                    <img
                      src={photo.preview}
                      alt={`Problem photo ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <motion.button
                      onClick={() => onRemovePhoto(photo.id)}
                      className="absolute top-1 right-1 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                      whileTap={{ scale: 0.9 }}
                      whileHover={{ scale: 1.1 }}
                      aria-label="Remove photo"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </motion.button>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Upload Button */}
            <motion.div whileTap={{ scale: 0.98 }}>
              <label
                htmlFor="photo-upload"
                className={`
                  flex items-center justify-center gap-2 w-full px-4 py-3 
                  bg-gray-50 hover:bg-gray-100 border-2 border-dashed border-gray-300 
                  rounded-xl cursor-pointer transition-all
                  ${photos && photos.length >= 5 ? 'opacity-50 cursor-not-allowed' : ''}
                `}
              >
                <ImageIcon className="w-5 h-5 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">
                  {photos && photos.length > 0 
                    ? `Add More Photos (${photos.length}/5)` 
                    : 'Take or Upload Photos'}
                </span>
              </label>
              <input
                id="photo-upload"
                type="file"
                accept="image/*"
                multiple
                capture="environment"
                onChange={handlePhotoUpload}
                disabled={photos && photos.length >= 5}
                className="hidden"
                aria-label="Upload photos of the problem"
              />
            </motion.div>

            <p className="text-xs text-gray-500 mt-2">
              Max 5 photos, up to 5MB each. JPG, PNG supported.
            </p>
          </motion.div>

          {/* Submit Button with hover effect */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              onClick={onSubmit}
              size="lg"
              className="w-full shadow-lg hover:shadow-xl transition-shadow"
            >
              <Send className="w-5 h-5" />
              Send Request to Mechanic
            </Button>
          </motion.div>

          {/* Info Note */}
          <motion.div 
            className="mt-4 bg-yellow-50 rounded-xl p-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <p className="text-xs text-yellow-900 leading-relaxed">
              <strong>Note:</strong> The mechanic will be notified in real-time. 
              You'll receive a notification when they accept. Service fees will be 
              assessed on-site after diagnosis.
            </p>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};
