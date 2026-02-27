import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  User,
  Phone,
  Edit2,
  Save,
  X,
  Shield,
  ChevronLeft,
  LogOut
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import authService from '@/services/authService';
import { useNavigate } from 'react-router-dom';

/**
 * CustomerProfile Component
 * 
 * Displays and allows editing of customer profile info from the API.
 * API GET /api/auth/users/:id/profile returns: { name, phone, usertype }
 */
export const CustomerProfile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [profile, setProfile] = useState(null);
  const [editedProfile, setEditedProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError(null);
      try {
        if (user?.id) {
          const data = await authService.getProfileById(user.id);
          const profileData = data.profile || data;
          setProfile(profileData);
          setEditedProfile(profileData);
        }
      } catch (err) {
        console.error('Failed to load profile:', err);
        setError('Failed to load profile. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [user?.id]);

  const handleEdit = () => {
    setEditedProfile({ ...profile });
    setIsEditing(true);
    setSaveSuccess(false);
  };

  const handleCancel = () => {
    setEditedProfile({ ...profile });
    setIsEditing(false);
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);
    setSaveSuccess(false);
    try {
      await authService.updateProfileById(user.id, {
        name: editedProfile.name,
        phone: editedProfile.phone,
      });
      setProfile({ ...editedProfile });
      setIsEditing(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to save profile:', err);
      setError('Failed to save profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (field, value) => {
    setEditedProfile(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-gray-500 text-sm">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error && !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <X className="w-8 h-8 text-red-500" />
          </div>
          <p className="text-red-600 font-medium mb-2">{error}</p>
          <Button onClick={() => window.location.reload()} className="mt-2">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500">No profile data available.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header Card */}
      <Card className="overflow-hidden rounded-none shadow-sm">
        {/* Top navigation bar */}
        <div className="bg-gradient-to-r from-primary to-blue-700 px-4 pt-4 pb-0">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => navigate(-1)}
              className="w-9 h-9 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h1 className="text-white font-semibold text-lg">My Profile</h1>
            <div className="w-9" /> {/* Spacer */}
          </div>
        </div>

        <div className="bg-gradient-to-r from-primary to-blue-700 h-12"></div>
        <CardContent className="pt-0 pb-6">
          {/* Profile Avatar */}
          <div className="flex flex-col items-center -mt-12 mb-4">
            <motion.div
              className="w-24 h-24 bg-white rounded-full border-4 border-white shadow-lg flex items-center justify-center mb-3"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="w-20 h-20 bg-gradient-to-br from-primary to-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-2xl font-bold">
                  {profile.name ? profile.name.charAt(0).toUpperCase() : 'C'}
                </span>
              </div>
            </motion.div>

            <div className="text-center mb-3">
              <h2 className="text-2xl font-bold text-gray-900 mb-1">
                {profile.name}
              </h2>
              <div className="flex items-center justify-center gap-2">
                <Badge className="bg-blue-100 text-blue-700 border-blue-200">
                  <Shield className="w-3 h-3 mr-1" />
                  {profile.usertype === 'customer' ? 'Customer' : profile.usertype}
                </Badge>
              </div>
            </div>

            {/* Success message */}
            {saveSuccess && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-3 px-4 py-2 bg-green-100 text-green-700 rounded-lg text-sm font-medium"
              >
                ✅ Profile updated successfully!
              </motion.div>
            )}

            {/* Error message */}
            {error && profile && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-3 px-4 py-2 bg-red-100 text-red-700 rounded-lg text-sm font-medium"
              >
                ❌ {error}
              </motion.div>
            )}

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
                  value={editedProfile.name || ''}
                  onChange={(e) => handleChange('name', e.target.value)}
                  placeholder="Your name"
                />
              ) : (
                <p className="font-medium text-gray-900">{profile.name || 'Not set'}</p>
              )}
            </div>

            <div>
              <label className="text-sm text-gray-600 flex items-center gap-2 mb-1">
                <Phone className="w-4 h-4" />
                Phone Number
              </label>
              {isEditing ? (
                <Input
                  value={editedProfile.phone || ''}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  placeholder="0123456789"
                />
              ) : (
                <p className="font-medium text-gray-900">{profile.phone || 'Not set'}</p>
              )}
            </div>

            <div>
              <label className="text-sm text-gray-600 flex items-center gap-2 mb-1">
                <Shield className="w-4 h-4" />
                Account Type
              </label>
              <p className="font-medium text-gray-900 capitalize">{profile.usertype || 'customer'}</p>
            </div>
          </CardContent>
        </Card>

        {/* Logout */}
        <Card className="shadow-sm">
          <CardContent className="py-4">
            <motion.button
              onClick={handleLogout}
              className="w-full text-left p-4 rounded-xl border border-red-200 hover:bg-red-50 hover:border-red-300 transition-all"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
                  <LogOut className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <span className="font-semibold text-red-600 block">Log Out</span>
                  <span className="text-xs text-gray-500">Sign out of your account</span>
                </div>
              </div>
            </motion.button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
