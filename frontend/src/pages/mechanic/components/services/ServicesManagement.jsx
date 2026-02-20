import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Wrench, 
  DollarSign, 
  CheckCircle, 
  XCircle, 
  TrendingUp, 
  Package, 
  Sparkles,
  Car,
  Battery,
  Settings,
  Disc,
  AlertOctagon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

/**
 * ServicesManagement Component
 * 
 * Interactive CRUD for managing mechanic's service offerings with beautiful UI
 */
export const ServicesManagement = () => {
  const [services, setServices] = useState([
    {
      id: 1,
      name: 'Tire Repair/Replacement',
      basePrice: 25.0,
      category: 'tire',
      description: 'Professional tire repair and replacement service',
      isActive: true,
    },
    {
      id: 2,
      name: 'Battery Jump/Replace',
      basePrice: 15.0,
      category: 'battery',
      description: 'Battery diagnosis, jump start, and replacement',
      isActive: true,
    },
    {
      id: 3,
      name: 'Engine Diagnosis',
      basePrice: 45.0,
      category: 'engine',
      description: 'Complete engine diagnostic and repair service',
      isActive: true,
    },
    {
      id: 4,
      name: 'Brake Service',
      basePrice: 35.0,
      category: 'brake',
      description: 'Brake inspection, pad replacement, and service',
      isActive: false,
    },
  ]);

  const [isAddingService, setIsAddingService] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    basePrice: '',
    category: 'tire',
    description: '',
    isActive: true,
  });

  const categories = [
    { value: 'tire', label: 'Tire', icon: Disc, color: 'bg-blue-100 text-blue-700 border-blue-300' },
    { value: 'battery', label: 'Battery', icon: Battery, color: 'bg-blue-100 text-blue-700 border-blue-300' },
    { value: 'engine', label: 'Engine', icon: Settings, color: 'bg-blue-100 text-blue-700 border-blue-300' },
    { value: 'brake', label: 'Brake', icon: TrendingUp, color: 'bg-blue-100 text-blue-700 border-blue-300' },
    { value: 'emergency', label: 'Emergency', icon: AlertOctagon, color: 'bg-blue-100 text-blue-700 border-blue-300' },
    { value: 'other', label: 'Other', icon: Wrench, color: 'bg-blue-100 text-blue-700 border-blue-300' },
  ];

  const handleAddService = () => {
    const price = parseFloat(formData.basePrice);
    if (price < 0 || isNaN(price)) {
      alert('Price must be a positive number');
      return;
    }
    const newService = {
      id: Date.now(),
      ...formData,
      basePrice: price,
    };
    setServices([...services, newService]);
    resetForm();
  };

  const handleUpdateService = () => {
    const price = parseFloat(formData.basePrice);
    if (price < 0 || isNaN(price)) {
      alert('Price must be a positive number');
      return;
    }
    setServices(services.map(s => 
      s.id === editingService.id 
        ? { ...s, ...formData, basePrice: price }
        : s
    ));
    resetForm();
  };

  const handleDeleteService = (id) => {
    if (confirm('Are you sure you want to delete this service?')) {
      setServices(services.filter(s => s.id !== id));
    }
  };

  const handleToggleActive = (id) => {
    setServices(services.map(s => 
      s.id === id ? { ...s, isActive: !s.isActive } : s
    ));
  };

  const handleEdit = (service) => {
    setEditingService(service);
    setFormData({
      name: service.name,
      basePrice: service.basePrice.toString(),
      category: service.category,
      description: service.description,
      isActive: service.isActive,
    });
    setIsAddingService(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      basePrice: '',
      category: 'tire',
      description: '',
      isActive: true,
    });
    setIsAddingService(false);
    setEditingService(null);
  };

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          whileHover={{ y: -4 }}
          className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-6 text-white shadow-xl"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Total Services</p>
              <p className="text-3xl font-bold mt-1">{services.length}</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Package className="w-6 h-6" />
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -4 }}
          className="bg-gradient-to-br from-green-600 to-green-700 rounded-2xl p-6 text-white shadow-xl"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">Active Services</p>
              <p className="text-3xl font-bold mt-1">{services.filter(s => s.isActive).length}</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-6 h-6" />
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -4 }}
          className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-xl"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Avg Price</p>
              <p className="text-3xl font-bold mt-1">
                ${services.length > 0 ? (services.reduce((sum, s) => sum + s.basePrice, 0) / services.length).toFixed(2) : '0.00'}
              </p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <DollarSign className="w-6 h-6" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-blue-600">
            Services Management
          </h2>
          <p className="text-sm text-gray-600 mt-1 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-500" />
            Manage your service offerings and pricing
          </p>
        </div>
        {!isAddingService && (
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={() => setIsAddingService(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white shadow-md"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Service
            </Button>
          </motion.div>
        )}
      </div>

      {/* Add/Edit Form */}
      <AnimatePresence>
        {isAddingService && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="border-2 border-blue-200 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 border-b">
                <CardTitle className="text-xl flex items-center gap-2">
                  <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                    <Wrench className="w-5 h-5 text-white" />
                  </div>
                  {editingService ? 'Edit Service' : 'Add New Service'}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-5">
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      Service Name *
                      <span className="text-error-500">*</span>
                    </label>
                    <Input
                      placeholder="e.g., Tire Replacement"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="border-2 focus:border-blue-400 transition-colors"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-blue-600" />
                        Base Price (USD) *
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">$</span>
                        <Input
                          type="number"
                          min="0"
                          step="0.50"
                          placeholder="25.00"
                          value={formData.basePrice}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (value === '' || parseFloat(value) >= 0) {
                              setFormData({ ...formData, basePrice: value });
                            }
                          }}
                          onKeyDown={(e) => {
                            if (e.key === '-' || e.key === 'e' || e.key === 'E') {
                              e.preventDefault();
                            }
                          }}
                          className="pl-8 border-2 focus:border-blue-400 transition-colors"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-semibold text-gray-700 mb-2 block">
                        Category *
                      </label>
                      <select
                        className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all bg-white"
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      >
                        {categories.map(cat => (
                          <option key={cat.value} value={cat.value}>
                            {cat.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-2 block">
                      Description
                    </label>
                    <textarea
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all min-h-[100px]"
                      placeholder="Describe the service in detail..."
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                  </div>

                  <motion.div 
                    className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border-2 border-gray-200"
                    whileHover={{ borderColor: '#2563eb' }}
                  >
                    <input
                      type="checkbox"
                      id="isActive"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                      className="w-5 h-5 text-blue-600 rounded focus:ring-blue-400 cursor-pointer"
                    />
                    <label htmlFor="isActive" className="text-sm font-medium text-gray-700 cursor-pointer flex-1">
                      Active (customers can request this service)
                    </label>
                    {formData.isActive ? (
                      <CheckCircle className="w-5 h-5 text-blue-600" />
                    ) : (
                      <XCircle className="w-5 h-5 text-gray-400" />
                    )}
                  </motion.div>

                  <div className="flex gap-3 pt-3">
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1">
                      <Button
                        onClick={editingService ? handleUpdateService : handleAddService}
                        disabled={!formData.name || !formData.basePrice}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {editingService ? 'Update Service' : 'Add Service'}
                      </Button>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button
                        onClick={resetForm}
                        variant="outline"
                        className="border-2 border-gray-300 hover:bg-gray-100 hover:border-gray-400"
                      >
                        Cancel
                      </Button>
                    </motion.div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Services List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <AnimatePresence>
          {services.map((service, index) => {
            const categoryInfo = categories.find(c => c.value === service.category);
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -20 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
                layout
              >
                <Card className={`overflow-hidden border-2 transition-all ${
                  service.isActive 
                    ? 'border-blue-200 hover:border-blue-400 shadow-card hover:shadow-xl' 
                    : 'border-gray-200 opacity-60 hover:opacity-100'
                }`}>
                  {/* Color Bar */}
                  <div className={`h-2 ${
                    service.isActive ? 'bg-gradient-to-r from-blue-600 to-blue-700' : 'bg-gray-300'
                  }`} />
                  
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {categoryInfo?.icon && <categoryInfo.icon className="w-6 h-6 text-blue-600" />}
                          <h3 className="font-bold text-gray-900 text-lg">{service.name}</h3>
                        </div>
                        <Badge className={`${categoryInfo?.color} font-medium border`}>
                          {categoryInfo?.label}
                        </Badge>
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="flex items-baseline gap-1 mb-2">
                        <DollarSign className="w-5 h-5 text-blue-600" />
                        <span className="text-3xl font-bold text-blue-700">
                          {service.basePrice.toFixed(2)}
                        </span>
                        <span className="text-sm text-gray-500">USD</span>
                      </div>
                    </div>

                    <p className="text-sm text-gray-600 mb-4 line-clamp-2 min-h-[40px]">
                      {service.description}
                    </p>

                    {/* Status Badge */}
                    <div className="mb-4">
                      <Badge className={`${
                        service.isActive 
                          ? 'bg-blue-100 text-blue-700 border border-blue-300' 
                          : 'bg-gray-100 text-gray-700 border border-gray-200'
                      } flex items-center gap-1 w-fit`}>
                        {service.isActive ? (
                          <><CheckCircle className="w-3 h-3" /> Active</>
                        ) : (
                          <><XCircle className="w-3 h-3" /> Inactive</>
                        )}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button
                          onClick={() => handleEdit(service)}
                          variant="outline"
                          size="sm"
                          className="w-full border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"
                        >
                          <Edit2 className="w-3.5 h-3.5 mr-1" />
                          Edit
                        </Button>
                      </motion.div>
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button
                          onClick={() => handleToggleActive(service.id)}
                          variant="outline"
                          size="sm"
                          className={`w-full border-2 ${
                            service.isActive 
                              ? 'border-gray-400 text-gray-600 hover:bg-gray-500 hover:text-white' 
                              : 'border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white'
                          }`}
                        >
                          {service.isActive ? 'Disable' : 'Enable'}
                        </Button>
                      </motion.div>
                    </div>

                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="mt-2">
                      <Button
                        onClick={() => handleDeleteService(service.id)}
                        variant="outline"
                        size="sm"
                        className="w-full border-2 border-red-500 text-red-600 hover:bg-red-500 hover:text-white"
                      >
                        <Trash2 className="w-3.5 h-3.5 mr-1" />
                        Delete Service
                      </Button>
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Empty State */}
      {services.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16 bg-gradient-to-br from-gray-50 to-blue-50 rounded-3xl border-2 border-dashed border-blue-300"
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="inline-block"
          >
            <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl">
              <Wrench className="w-10 h-10 text-white" />
            </div>
          </motion.div>
          <p className="text-gray-900 font-bold text-xl mb-2">No services added yet</p>
          <p className="text-gray-600 text-sm mb-6">
            Add your first service to start receiving requests from customers
          </p>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={() => setIsAddingService(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white shadow-md"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Your First Service
            </Button>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};
