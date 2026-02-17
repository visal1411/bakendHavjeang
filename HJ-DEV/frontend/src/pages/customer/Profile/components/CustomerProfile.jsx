import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Phone, 
  MapPin, 
  Mail,
  Edit2,
  Save,
  X,
  Calendar,
  Shield,
  Heart,
  Clock
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';

/**
 * CustomerProfile Component
 * 
 * Allows customers to view and edit their profile information
 */
export const CustomerProfile = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Mock profile data - In real app, fetch from API
  const [profile, setProfile] = useState({
    name: user?.name || 'Chea Dara',
    phone: user?.phone || '+855 12 345 678',
    email: 'cheadara@example.com',
    location: 'Chamkar Mon, Phnom Penh',
    joinedDate: '2024-01-15',
    totalRequests: 12,
    savedMechanics: 5,
    vehicleInfo: {
      make: 'Honda',
      model: 'Civic',
      year: '2018',
      plateNumber: 'PP 1234',
    }
  });

  const [editedProfile, setEditedProfile] = useState(profile);

  const handleEdit = () => {
    setEditedProfile(profile);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setEditedProfile(profile);
    setIsEditing(false);
  };

  const handleSave = async () => {
    setIsSaving(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setProfile(editedProfile);
    setIsEditing(false);
    setIsSaving(false);
    
    console.log('✅ Profile updated:', editedProfile);
  };

  const handleChange = (field, value) => {
    setEditedProfile(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleVehicleChange = (field, value) => {
    setEditedProfile(prev => ({
      ...prev,
      vehicleInfo: {
        ...prev.vehicleInfo,
        [field]: value,
      },
    }));
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric',
      year: 'numeric' 
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header Card */}
      <Card className="overflow-hidden rounded-none shadow-sm">
        <div className="bg-gradient-to-r from-primary to-blue-700 h-24"></div>
        <CardContent className="pt-0 pb-6">
          {/* Profile Picture - Not Covered */}
          <div className="flex flex-col items-center -mt-12 mb-4">
            <motion.div 
              className="w-24 h-24 bg-white rounded-full border-4 border-white shadow-lg flex items-center justify-center mb-3"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <User className="w-12 h-12 text-gray-400" />
            </motion.div>
            
            <div className="text-center mb-3">
              <h2 className="text-2xl font-bold text-gray-900 mb-1">
                {profile.name}
              </h2>
              <p className="text-sm text-gray-600 flex items-center justify-center gap-1">
                <Shield className="w-3.5 h-3.5" />
                Customer Account
              </p>
            </div>

            {/* Edit/Save Buttons */}
            {!isEditing ? (
              <Button
                onClick={handleEdit}
                className="bg-primary hover:bg-blue-700 text-white shadow-md"
              >
                <Edit2 className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="bg-green-600 hover:bg-green-700 text-white shadow-md"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {isSaving ? 'Saving...' : 'Save'}
                </Button>
                <Button
                  onClick={handleCancel}
                  variant="outline"
                  disabled={isSaving}
                  className="shadow-sm"
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
              </div>
            )}
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-3 mt-6">
            <motion.div 
              className="text-center p-3 bg-blue-50 rounded-xl border border-blue-100"
              whileHover={{ scale: 1.02 }}
            >
              <p className="text-2xl font-bold text-primary">{profile.totalRequests}</p>
              <p className="text-xs text-gray-600 mt-1">Requests</p>
            </motion.div>
            <motion.div 
              className="text-center p-3 bg-pink-50 rounded-xl border border-pink-100"
              whileHover={{ scale: 1.02 }}
            >
              <p className="text-2xl font-bold text-pink-600">{profile.savedMechanics}</p>
              <p className="text-xs text-gray-600 mt-1">Saved</p>
            </motion.div>
            <motion.div 
              className="text-center p-3 bg-green-50 rounded-xl border border-green-100"
              whileHover={{ scale: 1.02 }}
            >
              <Calendar className="w-5 h-5 text-green-600 mx-auto mb-1" />
              <p className="text-xs text-gray-600 font-medium">{formatDate(profile.joinedDate).split(',')[0]}</p>
            </motion.div>
          </div>
        </CardContent>
      </Card>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-4">
        {/* Contact Information */}
        <Card className="shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Phone className="w-5 h-5 text-primary" />
              Contact Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm text-gray-600 flex items-center gap-2 mb-1">
                <User className="w-4 h-4" />
                Full Name
              </label>
              {isEditing ? (
                <Input
                  value={editedProfile.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  placeholder="Your name"
                />
              ) : (
                <p className="font-medium text-gray-900">{profile.name}</p>
              )}
            </div>

            <div>
              <label className="text-sm text-gray-600 flex items-center gap-2 mb-1">
                <Phone className="w-4 h-4" />
                Phone Number
              </label>
              {isEditing ? (
                <Input
                  value={editedProfile.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  placeholder="+855 12 345 678"
                />
              ) : (
                <p className="font-medium text-gray-900">{profile.phone}</p>
              )}
            </div>

            <div>
              <label className="text-sm text-gray-600 flex items-center gap-2 mb-1">
                <Mail className="w-4 h-4" />
                Email Address (Optional)
              </label>
              {isEditing ? (
                <Input
                  value={editedProfile.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  placeholder="email@example.com"
                  type="email"
                />
              ) : (
                <p className="font-medium text-gray-900">{profile.email || 'Not provided'}</p>
              )}
            </div>

            <div>
              <label className="text-sm text-gray-600 flex items-center gap-2 mb-1">
                <MapPin className="w-4 h-4" />
                Default Location
              </label>
              {isEditing ? (
                <Input
                  value={editedProfile.location}
                  onChange={(e) => handleChange('location', e.target.value)}
                  placeholder="District, City"
                />
              ) : (
                <p className="font-medium text-gray-900">{profile.location}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Vehicle Information */}
        <Card className="shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
              </svg>
              Vehicle Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-600 mb-1 block">Make</label>
                {isEditing ? (
                  <Input
                    value={editedProfile.vehicleInfo.make}
                    onChange={(e) => handleVehicleChange('make', e.target.value)}
                    placeholder="Honda"
                  />
                ) : (
                  <p className="font-medium text-gray-900">{profile.vehicleInfo.make}</p>
                )}
              </div>

              <div>
                <label className="text-sm text-gray-600 mb-1 block">Model</label>
                {isEditing ? (
                  <Input
                    value={editedProfile.vehicleInfo.model}
                    onChange={(e) => handleVehicleChange('model', e.target.value)}
                    placeholder="Civic"
                  />
                ) : (
                  <p className="font-medium text-gray-900">{profile.vehicleInfo.model}</p>
                )}
              </div>

              <div>
                <label className="text-sm text-gray-600 mb-1 block">Year</label>
                {isEditing ? (
                  <Input
                    value={editedProfile.vehicleInfo.year}
                    onChange={(e) => handleVehicleChange('year', e.target.value)}
                    placeholder="2018"
                  />
                ) : (
                  <p className="font-medium text-gray-900">{profile.vehicleInfo.year}</p>
                )}
              </div>

              <div>
                <label className="text-sm text-gray-600 mb-1 block">Plate Number</label>
                {isEditing ? (
                  <Input
                    value={editedProfile.vehicleInfo.plateNumber}
                    onChange={(e) => handleVehicleChange('plateNumber', e.target.value)}
                    placeholder="PP 1234"
                  />
                ) : (
                  <p className="font-medium text-gray-900">{profile.vehicleInfo.plateNumber}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Links */}
        <Card className="shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Shield className="w-5 h-5 text-primary" />
              Quick Links
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <motion.button 
              className="w-full text-left p-4 rounded-xl border border-gray-200 hover:bg-blue-50 hover:border-blue-300 transition-all"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <span className="font-semibold text-gray-900 block">Service History</span>
                    <span className="text-xs text-gray-500">View past services</span>
                  </div>
                </div>
                <span className="text-sm text-primary font-medium">→</span>
              </div>
            </motion.button>

            <motion.button 
              className="w-full text-left p-4 rounded-xl border border-gray-200 hover:bg-pink-50 hover:border-pink-300 transition-all"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-pink-100 flex items-center justify-center">
                    <Heart className="w-5 h-5 text-pink-600" />
                  </div>
                  <div>
                    <span className="font-semibold text-gray-900 block">Saved Mechanics</span>
                    <span className="text-xs text-gray-500">Your favorites</span>
                  </div>
                </div>
                <span className="text-sm text-pink-600 font-medium">→</span>
              </div>
            </motion.button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
