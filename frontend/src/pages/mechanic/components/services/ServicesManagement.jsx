import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Edit2,
  Trash2,
  Wrench,
  DollarSign,
  Package,
  Sparkles,
  Car,
  Bike,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import servicesService from "@/services/servicesService";

const SERVICE_TYPE_OPTIONS = [
  {
    value: "moto",
    label: "Motorcycle Service",
    icon: Bike,
    color: "bg-blue-100 text-blue-700 border-blue-300"
  },
  {
    value: "car",
    label: "Car Service",
    icon: Car,
    color: "bg-indigo-100 text-indigo-700 border-indigo-300"
  }
];

const SERVICE_TYPE_META = SERVICE_TYPE_OPTIONS.reduce((acc, option) => {
  acc[option.value] = option;
  return acc;
}, {});

const INITIAL_FORM_STATE = {
  name: "",
  price: "",
  serviceType: SERVICE_TYPE_OPTIONS[0].value
};

/**
 * ServicesManagement Component
 * 
 * Interactive CRUD for managing mechanic's service offerings with beautiful UI
 */
export const ServicesManagement = () => {
  const [services, setServices] = useState([]);
  const [isAddingService, setIsAddingService] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [formError, setFormError] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  const fetchServices = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await servicesService.getMyServices();
      setServices(Array.isArray(data) ? data : []);
    } catch (fetchError) {
      const message = fetchError?.response?.data?.message ?? "Failed to load services.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const resetForm = () => {
    setFormData(INITIAL_FORM_STATE);
    setIsAddingService(false);
    setEditingService(null);
    setFormError("");
  };

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      setFormError("Service name is required");
      return;
    }

    if (formData.price === "") {
      setFormError("Price is required");
      return;
    }

    const numericPrice = Number(formData.price);
    if (Number.isNaN(numericPrice) || numericPrice < 0) {
      setFormError("Price must be a valid non-negative number");
      return;
    }

    const payload = {
      name: formData.name.trim(),
      price: Math.round(numericPrice),
      serviceType: formData.serviceType
    };

    setSubmitting(true);
    setFormError("");

    try {
      if (editingService) {
        const { service } = await servicesService.updateService(editingService.id, payload);
        setServices((prev) => prev.map((item) => (item.id === service.id ? service : item)));
      } else {
        const { service } = await servicesService.createService(payload);
        setServices((prev) => [...prev, service]);
      }
      resetForm();
    } catch (submitError) {
      const message = submitError?.response?.data?.message ?? "Unable to save service. Please try again.";
      setFormError(message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (service) => {
    setEditingService(service);
    setFormData({
      name: service.name,
      price: service.price?.toString() ?? "",
      serviceType: service.serviceType ?? SERVICE_TYPE_OPTIONS[0].value
    });
    setIsAddingService(true);
  };

  const handleDeleteService = async (id) => {
    if (!confirm("Are you sure you want to delete this service?")) {
      return;
    }

    setDeletingId(id);
    try {
      await servicesService.deleteService(id);
      setServices((prev) => prev.filter((service) => service.id !== id));
    } catch (deleteError) {
      const message = deleteError?.response?.data?.message ?? "Unable to delete service.";
      setError(message);
    } finally {
      setDeletingId(null);
    }
  };

  const totalServices = services.length;
  const motoCount = services.filter((service) => service.serviceType === "moto").length;
  const carCount = services.filter((service) => service.serviceType === "car").length;
  const averagePrice = totalServices
    ? (
        services.reduce((sum, service) => sum + Number(service.price ?? 0), 0) /
        totalServices
      ).toFixed(2)
    : "0.00";

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <motion.div
          whileHover={{ y: -4 }}
          className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-6 text-white shadow-xl"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Total Services</p>
              <p className="text-3xl font-bold mt-1">{totalServices}</p>
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
              <p className="text-green-100 text-sm font-medium">Moto Services</p>
              <p className="text-3xl font-bold mt-1">{motoCount}</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Bike className="w-6 h-6" />
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -4 }}
          className="bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-2xl p-6 text-white shadow-xl"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-indigo-100 text-sm font-medium">Car Services</p>
              <p className="text-3xl font-bold mt-1">{carCount}</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Car className="w-6 h-6" />
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
              <p className="text-3xl font-bold mt-1">${averagePrice}</p>
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

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 flex items-center justify-between gap-4">
          <span>{error}</span>
          <Button
            variant="outline"
            size="sm"
            className="border-red-200 text-red-700 hover:bg-red-100"
            onClick={fetchServices}
          >
            Retry
          </Button>
        </div>
      )}

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
                        Price (USD) *
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">$</span>
                        <Input
                          type="number"
                          min="0"
                          step="0.10"
                          placeholder="25.00"
                          value={formData.price}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (value === '' || parseFloat(value) >= 0) {
                              setFormData({ ...formData, price: value });
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
                        Vehicle Type *
                      </label>
                      <select
                        className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all bg-white"
                        value={formData.serviceType}
                        onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
                      >
                        {SERVICE_TYPE_OPTIONS.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {formError && (
                    <p className="text-sm text-red-600 font-medium">{formError}</p>
                  )}

                  <div className="flex gap-3 pt-3">
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1">
                      <Button
                        onClick={handleSubmit}
                        disabled={submitting || !formData.name || !formData.price}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {submitting ? (
                          <span className="flex items-center justify-center gap-2">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            {editingService ? "Updating..." : "Saving..."}
                          </span>
                        ) : (
                          editingService ? "Update Service" : "Add Service"
                        )}
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
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <AnimatePresence>
            {services.map((service, index) => {
              const meta = SERVICE_TYPE_META[service.serviceType] ?? SERVICE_TYPE_OPTIONS[0];
              const Icon = meta.icon;
              const price = Number(service.price ?? 0);
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
                  <Card className="overflow-hidden border-2 border-blue-50 hover:border-blue-200 transition-all shadow-card hover:shadow-xl">
                    <div className="h-2 bg-gradient-to-r from-blue-600 to-blue-700" />

                    <CardContent className="p-5">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            {Icon && <Icon className="w-6 h-6 text-blue-600" />}
                            <h3 className="font-bold text-gray-900 text-lg">{service.name}</h3>
                          </div>
                          <Badge className={`${meta.color} font-medium border`}>
                            {meta.label}
                          </Badge>
                        </div>
                      </div>

                      <div className="mb-6">
                        <div className="flex items-baseline gap-1">
                          <DollarSign className="w-5 h-5 text-blue-600" />
                          <span className="text-3xl font-bold text-blue-700">
                            {price.toFixed(2)}
                          </span>
                          <span className="text-sm text-gray-500">USD</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-2">
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
                            onClick={() => handleDeleteService(service.id)}
                            variant="outline"
                            size="sm"
                            disabled={deletingId === service.id}
                            className="w-full border-2 border-red-500 text-red-600 hover:bg-red-500 hover:text-white disabled:opacity-60"
                          >
                            {deletingId === service.id ? (
                              <span className="flex items-center justify-center gap-2">
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                Removing...
                              </span>
                            ) : (
                              <>
                                <Trash2 className="w-3.5 h-3.5 mr-1" />
                                Delete Service
                              </>
                            )}
                          </Button>
                        </motion.div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* Empty State */}
      {!loading && services.length === 0 && (
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
