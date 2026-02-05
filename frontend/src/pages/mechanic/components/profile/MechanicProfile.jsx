import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Phone, 
  MapPin, 
  Briefcase, 
  Clock, 
  Star,
  Edit2,
  Save,
  X,
  Wrench,
  Calendar,
  Mail,
  Shield,
  Navigation
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useGeolocation } from '../../hooks';

/**
 * MechanicProfile Component
 * 
 * Allows mechanics to view and edit their profile information
 * Auto-populates location from GPS to improve UX
 */
export const MechanicProfile = () => {
  const { user } = useAuth();
  const { position: gpsPosition, error: gpsError } = useGeolocation();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [locationAddress, setLocationAddress] = useState('');
  
  // Mock profile data - In real app, fetch from API
  const [profile, setProfile] = useState({
    name: user?.name || 'Sok Piseth',
    workshopName: 'Sok Piseth Auto Repair',
    phone: user?.phone || '+855 12 345 678',
    email: 'sokpiseth@example.com',
    location: 'Daun Penh, Phnom Penh',
    gpsCoordinates: null, // Will be populated from GPS
    specialty: 'Engine & Brake Specialist',
    experience: 8,
    workHours: '08:00 - 18:00',
    services: ['Tire Repair', 'Engine Diagnosis', 'Brake Service', 'Battery Service'],
    vehicleTypes: ['Car', 'Moto', 'Truck'],
    rating: 4.8,
    totalReviews: 127,
    totalJobs: 234,
    joinedDate: '2018-03-15',
    certifications: ['ASE Certified', 'Master Mechanic'],
    baseTripFee: 2.0,
  });

  const [editedProfile, setEditedProfile] = useState(profile);

  // Auto-populate GPS coordinates when available
  useEffect(() => {
    if (gpsPosition && !profile.gpsCoordinates) {
      const coords = {
        lat: gpsPosition.lat,
        lng: gpsPosition.lng
      };
      setProfile(prev => ({ ...prev, gpsCoordinates: coords }));
      setEditedProfile(prev => ({ ...prev, gpsCoordinates: coords }));
      
      // Convert coordinates to address (reverse geocoding)
      reverseGeocode(coords.lat, coords.lng);
    }
  }, [gpsPosition]);

  /**
   * Convert GPS coordinates to human-readable address
   */
  const reverseGeocode = async (lat, lng) => {
    setIsLoadingLocation(true);
    try {
      // Using Nominatim (OpenStreetMap) reverse geocoding service
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
      );
      const data = await response.json();
      
      if (data && data.display_name) {
        // Extract relevant parts of the address (district, city)
        const address = data.address;
        const locationString = [
          address.suburb || address.neighbourhood || address.quarter,
          address.city || address.town || address.village || 'Phnom Penh'
        ].filter(Boolean).join(', ');
        
        setLocationAddress(locationString);
        setProfile(prev => ({ ...prev, location: locationString }));
        setEditedProfile(prev => ({ ...prev, location: locationString }));
      }
    } catch (error) {
      console.error('Error reverse geocoding:', error);
      setLocationAddress('');
    } finally {
      setIsLoadingLocation(false);
    }
  };

  /**
   * Manually refresh GPS location
   */
  const handleRefreshLocation = () => {
    if (gpsPosition) {
      reverseGeocode(gpsPosition.lat, gpsPosition.lng);
    }
  };

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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'long', 
      year: 'numeric' 
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header Card */}
      <Card className="overflow-hidden rounded-none shadow-sm">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 h-24"></div>
        <CardContent className="pt-0 pb-6">
          {/* Profile Picture */}
          <div className="flex flex-col items-center -mt-12 mb-4">
            <motion.div 
              className="w-24 h-24 bg-white rounded-full border-4 border-white shadow-lg flex items-center justify-center mb-3"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                <Wrench className="w-10 h-10 text-white" />
              </div>
            </motion.div>
            
            <div className="text-center mb-3">
              <h2 className="text-2xl font-bold text-gray-900 mb-1">
                {profile.name}
              </h2>
              <p className="text-sm text-gray-600 font-medium mb-1">{profile.workshopName}</p>
              <p className="text-xs text-gray-500 flex items-center justify-center gap-1">
                <Shield className="w-3.5 h-3.5" />
                Verified Mechanic
              </p>
            </div>

            {/* Edit/Save Buttons */}
            {!isEditing ? (
              <Button
                onClick={handleEdit}
                className="bg-blue-600 hover:bg-blue-700 text-white shadow-md"
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
              <p className="text-2xl font-bold text-blue-600">{profile.totalJobs}</p>
              <p className="text-xs text-gray-600 mt-1">Requests</p>
            </motion.div>
            <motion.div 
              className="text-center p-3 bg-yellow-50 rounded-xl border border-yellow-100"
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center justify-center gap-1 mb-1">
                <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                <p className="text-2xl font-bold text-yellow-600">{profile.rating}</p>
              </div>
              <p className="text-xs text-gray-600">Rating</p>
            </motion.div>
            <motion.div 
              className="text-center p-3 bg-green-50 rounded-xl border border-green-100"
              whileHover={{ scale: 1.02 }}
            >
              <p className="text-2xl font-bold text-green-600">{profile.experience}</p>
              <p className="text-xs text-gray-600 mt-1">Years Exp</p>
            </motion.div>
          </div>
        </CardContent>
      </Card>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-4">
        {/* Contact Information */}
        <Card className="shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Phone className="w-5 h-5 text-blue-600" />
              Contact Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
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
                Email Address
              </label>
              {isEditing ? (
                <Input
                  value={editedProfile.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  placeholder="email@example.com"
                  type="email"
                />
              ) : (
                <p className="font-medium text-gray-900">{profile.email}</p>
              )}
            </div>

            <div>
              <label className="text-sm text-gray-600 flex items-center gap-2 mb-1">
                <MapPin className="w-4 h-4" />
                Location {gpsPosition && <span className="text-xs text-blue-600">(GPS)</span>}
              </label>
              <div className="space-y-2">
                {isEditing ? (
                  <div className="flex gap-2">
                    <Input
                      value={editedProfile.location}
                      onChange={(e) => handleChange('location', e.target.value)}
                      placeholder="District, City"
                      disabled={isLoadingLocation}
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      onClick={handleRefreshLocation}
                      disabled={!gpsPosition || isLoadingLocation}
                      variant="outline"
                      className="flex-shrink-0"
                      title="Refresh GPS location"
                    >
                      <Navigation className={`w-4 h-4 ${isLoadingLocation ? 'animate-spin' : ''}`} />
                    </Button>
                  </div>
                ) : (
                  <p className="font-medium text-gray-900">{profile.location}</p>
                )}
                {gpsError && (
                  <p className="text-xs text-orange-600 flex items-start gap-1">
                    <span className="flex-shrink-0">⚠️</span>
                    <span>{gpsError}</span>
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Business Information */}
        <Card className="shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Briefcase className="w-5 h-5 text-blue-600" />
              Business Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm text-gray-600 flex items-center gap-2 mb-1">
                <Wrench className="w-4 h-4" />
                Workshop Name
              </label>
              {isEditing ? (
                <Input
                  value={editedProfile.workshopName}
                  onChange={(e) => handleChange('workshopName', e.target.value)}
                  placeholder="Workshop Name"
                />
              ) : (
                <p className="font-medium text-gray-900">{profile.workshopName}</p>
              )}
            </div>

            <div>
              <label className="text-sm text-gray-600 flex items-center gap-2 mb-1">
                <Briefcase className="w-4 h-4" />
                Specialty
              </label>
              {isEditing ? (
                <Input
                  value={editedProfile.specialty}
                  onChange={(e) => handleChange('specialty', e.target.value)}
                  placeholder="Your specialty"
                />
              ) : (
                <p className="font-medium text-gray-900">{profile.specialty}</p>
              )}
            </div>

            <div>
              <label className="text-sm text-gray-600 flex items-center gap-2 mb-1">
                <Clock className="w-4 h-4" />
                Work Hours
              </label>
              {isEditing ? (
                <Input
                  value={editedProfile.workHours}
                  onChange={(e) => handleChange('workHours', e.target.value)}
                  placeholder="08:00 - 18:00"
                />
              ) : (
                <p className="font-medium text-gray-900">{profile.workHours}</p>
              )}
            </div>

            <div>
              <label className="text-sm text-gray-600 flex items-center gap-2 mb-1">
                <span className="text-base">💰</span>
                Base Trip Fee
              </label>
              {isEditing ? (
                <Input
                  type="number"
                  min="0"
                  step="0.5"
                  value={editedProfile.baseTripFee}
                  onChange={(e) => {
                    const value = parseFloat(e.target.value);
                    if (!isNaN(value) && value >= 0) {
                      handleChange('baseTripFee', value);
                    } else if (e.target.value === '') {
                      handleChange('baseTripFee', 0);
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === '-' || e.key === 'e' || e.key === 'E') {
                      e.preventDefault();
                    }
                  }}
                  placeholder="2.0"
                  className="max-w-[200px]"
                />
              ) : (
                <p className="font-medium text-gray-900">
                  ${profile.baseTripFee.toFixed(2)} <span className="text-sm text-gray-600">per km</span>
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Services & Expertise */}
        <Card className="shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Wrench className="w-5 h-5 text-blue-600" />
              Services & Expertise
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm text-gray-600 mb-2 block font-medium">Services Offered</label>
              <div className="flex flex-wrap gap-2">
                {profile.services.map((service, index) => (
                  <Badge
                    key={index}
                    className="bg-blue-100 text-blue-700 border-blue-200 px-3 py-1"
                  >
                    {service}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm text-gray-600 mb-2 block font-medium">Vehicle Types</label>
              <div className="flex flex-wrap gap-2">
                {profile.vehicleTypes.map((type, index) => (
                  <Badge
                    key={index}
                    className="bg-blue-100 text-blue-700 border-blue-200"
                  >
                    {type}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Certifications */}
        <Card className="shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Shield className="w-5 h-5 text-blue-600" />
              Certifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {profile.certifications.map((cert, index) => (
              <motion.div
                key={index}
                className="p-4 rounded-xl border border-blue-200 bg-blue-50 hover:bg-blue-100 transition-all"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center">
                    <Shield className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-semibold text-gray-900">{cert}</span>
                </div>
              </motion.div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
