import { useState } from 'react';
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
  Shield
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';

/**
 * MechanicProfile Component
 * 
 * Allows mechanics to view and edit their profile information
 */
export const MechanicProfile = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Mock profile data - In real app, fetch from API
  const [profile, setProfile] = useState({
    name: user?.name || 'Sok Piseth',
    workshopName: 'Sok Piseth Auto Repair',
    phone: user?.phone || '+855 12 345 678',
    email: 'sokpiseth@example.com',
    location: 'Daun Penh, Phnom Penh',
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
    <div className="space-y-6">
      {/* Header Card */}
      <Card className="overflow-hidden">
        <div className="bg-gradient-to-r from-primary to-blue-700 h-32"></div>
        <CardContent className="relative pt-0 pb-6">
          {/* Profile Picture */}
          <div className="flex justify-between items-start -mt-16 mb-4">
            <div className="flex items-end gap-4">
              <div className="w-32 h-32 bg-white rounded-full border-4 border-white shadow-lg flex items-center justify-center">
                <User className="w-16 h-16 text-gray-400" />
              </div>
              <div className="pb-2">
                <h2 className="text-2xl font-bold text-gray-900">
                  {profile.name}
                </h2>
                <p className="text-gray-600">{profile.workshopName}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  <span className="font-bold text-gray-900">{profile.rating}</span>
                  <span className="text-sm text-gray-600">
                    ({profile.totalReviews} reviews)
                  </span>
                </div>
              </div>
            </div>
            
            {!isEditing ? (
              <Button
                onClick={handleEdit}
                className="bg-primary hover:bg-blue-700 text-white"
              >
                <Edit2 className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {isSaving ? 'Saving...' : 'Save'}
                </Button>
                <Button
                  onClick={handleCancel}
                  variant="outline"
                  disabled={isSaving}
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
              </div>
            )}
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-2xl font-bold text-primary">{profile.totalJobs}</p>
              <p className="text-sm text-gray-600">Total Jobs</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-2xl font-bold text-green-600">{profile.experience}</p>
              <p className="text-sm text-gray-600">Years Experience</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <p className="text-2xl font-bold text-purple-600">
                {formatDate(profile.joinedDate)}
              </p>
              <p className="text-sm text-gray-600">Member Since</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="w-5 h-5 text-primary" />
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
                Location
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

        {/* Business Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-primary" />
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
          </CardContent>
        </Card>

        {/* Services Offered */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wrench className="w-5 h-5 text-primary" />
              Services Offered
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {profile.services.map((service, index) => (
                <Badge
                  key={index}
                  className="bg-blue-100 text-primary border-blue-200"
                >
                  {service}
                </Badge>
              ))}
            </div>
            <div className="mt-4">
              <label className="text-sm text-gray-600 mb-2 block">Vehicle Types</label>
              <div className="flex flex-wrap gap-2">
                {profile.vehicleTypes.map((type, index) => (
                  <Badge
                    key={index}
                    className="bg-green-100 text-green-700 border-green-200"
                  >
                    {type}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Certifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              Certifications & Credentials
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {profile.certifications.map((cert, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg border border-purple-200"
                >
                  <Shield className="w-5 h-5 text-purple-600" />
                  <span className="font-medium text-gray-900">{cert}</span>
                </div>
              ))}
            </div>
            
            <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <label className="text-sm text-gray-600 mb-1 block">Base Trip Fee</label>
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
                <p className="text-2xl font-bold text-primary">
                  ${profile.baseTripFee.toFixed(2)} <span className="text-sm font-normal text-gray-600">per km</span>
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
