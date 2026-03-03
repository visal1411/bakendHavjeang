import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { authService } from '@/services';
import { Eye, EyeOff, Phone, Lock, User, Briefcase, Award, Upload, Wrench, UserCircle, MapPin, Clock } from 'lucide-react';

/**
 * AuthPage Component
 * 
 * Purpose: Handles user authentication (login and registration)
 * 
 * Registration Flow:
 * 1. User selects Sign Up mode
 * 2. User selects role (Customer or Mechanic) - STORED PERMANENTLY
 * 3. User fills in role-specific fields:
 *    - Customer: Phone, Password, Confirm Password, Location (province)
 *    - Mechanic: Full Name, Phone, Password, Confirm Password, Work Hours
 *      (location captured automatically via Geolocation)
 * 4. On submit: Store user with role in mock database
 * 
 * Login Flow:
 * 1. User selects Login mode
 * 2. User enters ONLY phone number and password
 * 3. System looks up user in mock database by phone
 * 4. System retrieves stored role from registration
 * 5. Navigate based on stored role:
 *    • Customer → /customer/home
 *    • Mechanic → /mechanic/dashboard
 * 
 * Note: Currently using mock database (localStorage)
 * TODO: Replace with actual API calls to backend
 */
const AuthPage = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated, user } = useAuth();

  const [mode, setMode] = useState('login'); // 'login' or 'signup'
  const [role, setRole] = useState('customer'); // 'customer' or 'mechanic' - ONLY for signup
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    password: '',
    confirmPassword: '',
    // mechanic fields not needed in payload are dropped
    location: '',          // used only for customer
    workHourStart: '',
    workHourEnd: '',
    mechanicLat: '',
    mechanicLng: '',
  });

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.usertype === 'customer') {
        navigate('/customer/home', { replace: true });
      } else if (user.usertype === 'mechanic') {
        navigate('/mechanic/dashboard', { replace: true });
      }
    }
  }, [isAuthenticated, user, navigate]);

  // Clear mechanic-specific fields when switching from mechanic to customer
  useEffect(() => {
    if (role === 'customer') {
      setFormData(prev => ({
        ...prev,
        workHourStart: '',
        workHourEnd: '',
        mechanicLat: '',
        mechanicLng: '',
      }));
    }
  }, [role]);

  // Attempt to capture current location when mechanic role is selected
  useEffect(() => {
    if (role === 'mechanic' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setFormData(prev => ({
            ...prev,
            mechanicLat: pos.coords.latitude.toString(),
            mechanicLng: pos.coords.longitude.toString(),
          }));
        },
        (err) => {
          console.warn('Geolocation error', err);
        },
        { enableHighAccuracy: true }
      );
    }
  }, [role]);

  // Clear form when switching between login and signup modes
  useEffect(() => {
    setFormData({
      fullName: '',
      phone: '',
      password: '',
      confirmPassword: '',
      location: '',
      workHourStart: '',
      workHourEnd: '',
      mechanicLat: '',
      mechanicLng: '',
    });
    setError('');
  }, [mode]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData({ ...formData, [name]: value });
    setError(''); // Clear error when user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'signup') {
        // REGISTRATION LOGIC

        // Validate password confirmation
        if (formData.password !== formData.confirmPassword) {
          setError('Passwords do not match');
          setLoading(false);
          return;
        }

        // Validate required fields
        if (role === 'customer' && !formData.location) {
          setError('Please select your location');
          setLoading(false);
          return;
        }

        // Validate mechanic-specific fields
        if (role === 'mechanic') {
          if (!formData.fullName) {
            setError('Please fill in your name');
            setLoading(false);
            return;
          }
          if (!formData.workHourStart || !formData.workHourEnd) {
            setError('Please select your work hours');
            setLoading(false);
            return;
          }
          if (formData.workHourStart >= formData.workHourEnd) {
            setError('End time must be after start time');
            setLoading(false);
            return;
          }
          if (!formData.mechanicLat || !formData.mechanicLng) {
            setError('Unable to determine location. Please allow location access.');
            setLoading(false);
            return;
          }
        }

        // Prepare registration data for backend
        const registrationData = {
          name: formData.fullName, // Backend expects 'name'
          phone: formData.phone,
          password: formData.password,
          usertype: role, // 'customer' or 'mechanic'
        };

        // Add mechanic-specific fields
        if (role === 'mechanic') {
          const workHours = `${formData.workHourStart}-${formData.workHourEnd}`;
          registrationData.working_hours = workHours;
          registrationData.mechanic_lat = parseFloat(formData.mechanicLat);
          registrationData.mechanic_lng = parseFloat(formData.mechanicLng);
        }

        // DEBUG: Log what we're sending
        console.log('Sending registration data:', registrationData);

        // Call backend API to register
        const registerResponse = await authService.register(registrationData);

        // Registration successful — backend does NOT return a token,
        // so we auto-login with the same credentials to get a JWT.
        if (registerResponse.user) {
          const loginResponse = await authService.login({
            phone: formData.phone,
            password: formData.password,
          });

          if (loginResponse.token && loginResponse.user) {
            const userData = {
              id: loginResponse.user.id,
              name: loginResponse.user.name,
              phone: loginResponse.user.phone,
              usertype: loginResponse.user.usertype,
              working_hours: loginResponse.user.working_hours,
            };

            login(userData, loginResponse.token);

            if (role === 'customer') {
              navigate('/customer/home');
            } else {
              navigate('/mechanic/dashboard');
            }
          }
        }

      } else {
        // LOGIN LOGIC - NO ROLE SELECTION

        // Call backend API to authenticate
        const response = await authService.login({
          phone: formData.phone,
          password: formData.password,
        });

        if (response.token && response.user) {
          // Create user object
          const userData = {
            id: response.user.id,
            name: response.user.name,
            phone: response.user.phone,
            usertype: response.user.usertype,
            working_hours: response.user.working_hours,
          };

          // Log in with token
          login(userData, response.token);

          // Route based on usertype from backend
          if (response.user.usertype === 'customer') {
            navigate('/customer/home');
          } else if (response.user.usertype === 'mechanic') {
            navigate('/mechanic/dashboard');
          }
        }
      }
    } catch (err) {
      console.error('Authentication error:', err);
      // Handle specific error messages from backend
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.response?.data?.errors) {
        // Validation errors from backend
        const errors = err.response.data.errors;
        setError(errors[0]?.msg || 'Validation failed');
      } else {
        setError(mode === 'signup' ? 'Registration failed. Please try again.' : 'Login failed. Please check your credentials.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Left Panel - Marketing/Image Section (Sticky) */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#155DFC] to-[#0d3d9a] relative overflow-hidden sticky top-0 h-screen">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 flex flex-col justify-center px-12 xl:px-20 text-white">
          <div className="mb-12">
            <div className="w-20 h-20 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-8 shadow-xl">
              <Wrench className="w-10 h-10" />
            </div>
            <h1 className="text-5xl font-bold mb-6 leading-tight">
              Your trusted auto<br />repair partner
            </h1>
            <p className="text-white/90 text-lg leading-relaxed max-w-md">
              Connect instantly with verified mechanics or showcase your expertise to customers in need.
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex items-start space-x-4 bg-white/10 backdrop-blur-sm rounded-xl p-5">
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
                <UserCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">For Customers</h3>
                <p className="text-white/80 text-sm">Find qualified mechanics nearby and book services instantly</p>
              </div>
            </div>
            <div className="flex items-start space-x-4 bg-white/10 backdrop-blur-sm rounded-xl p-5">
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
                <Wrench className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">For Mechanics</h3>
                <p className="text-white/80 text-sm">Grow your business and manage service requests efficiently</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Form Section (Scrollable) */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-8 overflow-y-auto">
        <div className="w-full max-w-md">
          {/* Logo for Mobile */}
          <div className="lg:hidden mb-8 text-center">
            <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Wrench className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-text-primary">Hav-Jeang</h2>
          </div>

          {/* Mode Toggle */}
          <div className="mb-10">
            <div className="flex bg-white rounded-xl p-1.5 shadow-sm border border-gray-200">
              <button
                onClick={() => setMode('login')}
                className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all duration-200 ${mode === 'login'
                  ? 'bg-primary text-white shadow-md'
                  : 'text-text-secondary hover:text-text-primary'
                  }`}
              >
                Login
              </button>
              <button
                onClick={() => setMode('signup')}
                className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all duration-200 ${mode === 'signup'
                  ? 'bg-primary text-white shadow-md'
                  : 'text-text-secondary hover:text-text-primary'
                  }`}
              >
                Sign Up
              </button>
            </div>
          </div>

          {/* Welcome Text */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-text-primary mb-2">
              {mode === 'login' ? 'Welcome back' : 'Get started'}
            </h2>
            <p className="text-text-secondary text-base">
              {mode === 'login'
                ? 'Enter your phone number and password to login'
                : 'Create your account to continue'}
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-red-600 text-sm font-medium">{error}</p>
            </div>
          )}

          {/* Role Selection - ONLY for Sign Up */}
          {mode === 'signup' && (
            <div className="mb-8">
              <label className="block text-sm font-semibold text-text-primary mb-4">
                Select your role
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setRole('customer')}
                  className={`p-5 rounded-xl border-2 transition-all duration-200 ${role === 'customer'
                    ? 'border-primary bg-primary/5 shadow-sm'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                >
                  <UserCircle className={`w-10 h-10 mx-auto mb-3 ${role === 'customer' ? 'text-primary' : 'text-text-secondary'
                    }`} />
                  <div className="text-center">
                    <div className={`font-semibold text-base mb-1 ${role === 'customer' ? 'text-primary' : 'text-text-primary'
                      }`}>
                      Customer
                    </div>
                    <div className="text-xs text-text-secondary">
                      Find mechanics
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setRole('mechanic')}
                  className={`p-5 rounded-xl border-2 transition-all duration-200 ${role === 'mechanic'
                    ? 'border-primary bg-primary/5 shadow-sm'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                >
                  <Wrench className={`w-10 h-10 mx-auto mb-3 ${role === 'mechanic' ? 'text-primary' : 'text-text-secondary'
                    }`} />
                  <div className="text-center">
                    <div className={`font-semibold text-base mb-1 ${role === 'mechanic' ? 'text-primary' : 'text-text-primary'
                      }`}>
                      Mechanic
                    </div>
                    <div className="text-xs text-text-secondary">
                      Offer services
                    </div>
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name - Sign Up (all roles) */}
            {mode === 'signup' && (
              <div>
                <label className="block text-sm font-semibold text-text-primary mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="w-full pl-12 pr-4 py-3.5 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    placeholder="Lyhai67"
                    required
                  />
                </div>
              </div>
            )}

            {/* Phone Number */}
            <div>
              <label className="block text-sm font-semibold text-text-primary mb-2">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full pl-12 pr-4 py-3.5 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  placeholder="095736767"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-text-primary mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full pl-12 pr-12 py-3.5 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Confirm Password - Sign Up Only */}
            {mode === 'signup' && (
              <div>
                <label className="block text-sm font-semibold text-text-primary mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full pl-12 pr-12 py-3.5 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    placeholder="Confirm your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            )}

            {/* Location - Sign Up Only (customers only) */}
            {mode === 'signup' && role === 'customer' && (
              <div>
                <label className="block text-sm font-semibold text-text-primary mb-2">
                  Location
                </label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary z-10" />
                  <select
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="w-full pl-12 pr-4 py-3.5 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all appearance-none cursor-pointer"
                    required
                  >
                    <option value="">Select your location</option>
                    <option value="Phnom Penh">Phnom Penh</option>
                    <option value="Siem Reap">Siem Reap</option>
                    <option value="Battambang">Battambang</option>
                    <option value="Sihanoukville">Sihanoukville</option>
                    <option value="Kampong Cham">Kampong Cham</option>
                    <option value="Kampong Thom">Kampong Thom</option>
                    <option value="Kampot">Kampot</option>
                    <option value="Kep">Kep</option>
                    <option value="Takeo">Takeo</option>
                    <option value="Prey Veng">Prey Veng</option>
                  </select>
                </div>
              </div>
            )}



            {/* Work Hours - Mechanic Sign Up Only */}
            {mode === 'signup' && role === 'mechanic' && (
              <div>
                <label className="block text-sm font-semibold text-text-primary mb-2">
                  Work Hours
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="relative">
                    <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary z-10" />
                    <select
                      name="workHourStart"
                      value={formData.workHourStart}
                      onChange={handleInputChange}
                      className="w-full pl-12 pr-4 py-3.5 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all appearance-none cursor-pointer"
                      required
                    >
                      <option value="">Start Time</option>
                      <option value="06:00">6:00 AM</option>
                      <option value="07:00">7:00 AM</option>
                      <option value="08:00">8:00 AM</option>
                      <option value="09:00">9:00 AM</option>
                      <option value="10:00">10:00 AM</option>
                    </select>
                  </div>
                  <div className="relative">
                    <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary z-10" />
                    <select
                      name="workHourEnd"
                      value={formData.workHourEnd}
                      onChange={handleInputChange}
                      className="w-full pl-12 pr-4 py-3.5 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all appearance-none cursor-pointer"
                      required
                    >
                      <option value="">End Time</option>
                      <option value="15:00">3:00 PM</option>
                      <option value="16:00">4:00 PM</option>
                      <option value="17:00">5:00 PM</option>
                      <option value="18:00">6:00 PM</option>
                      <option value="19:00">7:00 PM</option>
                      <option value="20:00">8:00 PM</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Forgot Password - Login Only */}
            {mode === 'login' && (
              <div className="flex items-center justify-end">
                <button type="button" className="text-sm text-primary hover:text-primary/80 font-semibold">
                  Forgot password?
                </button>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white py-3.5 rounded-xl font-semibold hover:bg-primary/90 transition-all duration-200 shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {mode === 'login' ? 'Signing In...' : 'Creating Account...'}
                </span>
              ) : (
                mode === 'login' ? 'Sign In' : 'Create Account'
              )}
            </button>

            {/* Terms & Privacy - Sign Up Only */}
            {mode === 'signup' && (
              <p className="text-xs text-center text-text-secondary mt-6 leading-relaxed">
                By signing up, you agree to our{' '}
                <button type="button" className="text-primary hover:underline font-medium">Terms of Service</button>
                {' '}and{' '}
                <button type="button" className="text-primary hover:underline font-medium">Privacy Policy</button>
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
