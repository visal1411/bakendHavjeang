import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
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
 *    - Customer: Phone, Password, Confirm Password
 *    - Mechanic: Full Name, Phone, Password, Confirm Password, Workshop Name, 
 *                Service Location, Years of Experience, Main Service Type
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
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    password: '',
    confirmPassword: '',
    workshopName: '',
    serviceLocation: '',
    experience: '',
    serviceType: '',
    location: '',
    workHourStart: '',
    workHourEnd: '',
  });

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === 'customer') {
        navigate('/customer/home', { replace: true });
      } else if (user.role === 'mechanic') {
        navigate('/mechanic/dashboard', { replace: true });
      }
    }
  }, [isAuthenticated, user, navigate]);

  // Clear mechanic-specific fields when switching from mechanic to customer
  useEffect(() => {
    if (role === 'customer') {
      setFormData(prev => ({
        ...prev,
        fullName: '',
        workshopName: '',
        serviceLocation: '',
        experience: '',
        serviceType: '',
        workHourStart: '',
        workHourEnd: '',
      }));
    }
  }, [role]);

  // Clear form when switching between login and signup modes
  useEffect(() => {
    setFormData({
      fullName: '',
      phone: '',
      password: '',
      confirmPassword: '',
      workshopName: '',
      serviceLocation: '',
      experience: '',
      serviceType: '',
      location: '',
      workHourStart: '',
      workHourEnd: '',
    });
    setError('');
  }, [mode]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(''); // Clear error when user types
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (mode === 'signup') {
      // REGISTRATION LOGIC
      
      // Validate password confirmation
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return;
      }

      // Validate required fields
      if (!formData.location) {
        setError('Please select your location');
        return;
      }

      // Validate mechanic-specific fields
      if (role === 'mechanic') {
        if (!formData.fullName || !formData.workshopName || !formData.serviceLocation || 
            !formData.experience || !formData.serviceType) {
          setError('Please fill in all required fields');
          return;
        }
        if (!formData.workHourStart || !formData.workHourEnd) {
          setError('Please select your work hours');
          return;
        }
        if (formData.workHourStart >= formData.workHourEnd) {
          setError('End time must be after start time');
          return;
        }
      }

      // Check if phone already exists
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const existingUser = users.find(u => u.phone === formData.phone);
      
      if (existingUser) {
        setError('Phone number already registered');
        return;
      }

      // Create new user with role
      const newUser = {
        phone: formData.phone,
        password: formData.password, // In production, this should be hashed
        role: role, // Store role permanently
        location: formData.location,
        ...(role === 'mechanic' && {
          fullName: formData.fullName,
          workshopName: formData.workshopName,
          serviceLocation: formData.serviceLocation,
          experience: formData.experience,
          serviceType: formData.serviceType,
          workHourStart: formData.workHourStart,
          workHourEnd: formData.workHourEnd,
        }),
        createdAt: new Date().toISOString(),
      };

      // Save to mock database (localStorage)
      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));

      // Log in the user
      login(newUser);

      // Route based on role
      if (role === 'customer') {
        navigate('/customer/home');
      } else {
        navigate('/mechanic/dashboard');
      }

    } else {
      // LOGIN LOGIC - NO ROLE SELECTION
      
      // Retrieve users from mock database
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      
      // Find user by phone number
      const user = users.find(u => u.phone === formData.phone);

      if (!user) {
        setError('Phone number not registered');
        return;
      }

      // Verify password
      if (user.password !== formData.password) {
        setError('Incorrect password');
        return;
      }

      // Log in with stored user data (including role)
      login(user);

      // Route based on STORED role from registration
      if (user.role === 'customer') {
        navigate('/customer/home');
      } else if (user.role === 'mechanic') {
        navigate('/mechanic/dashboard');
      }
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Left Panel - Marketing/Image Section */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#155DFC] to-[#0d3d9a] relative overflow-hidden">
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

      {/* Right Panel - Form Section */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-8">
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
                className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all duration-200 ${
                  mode === 'login'
                    ? 'bg-primary text-white shadow-md'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                Login
              </button>
              <button
                onClick={() => setMode('signup')}
                className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all duration-200 ${
                  mode === 'signup'
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
                  className={`p-5 rounded-xl border-2 transition-all duration-200 ${
                    role === 'customer'
                      ? 'border-primary bg-primary/5 shadow-sm'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <UserCircle className={`w-10 h-10 mx-auto mb-3 ${
                    role === 'customer' ? 'text-primary' : 'text-text-secondary'
                  }`} />
                  <div className="text-center">
                    <div className={`font-semibold text-base mb-1 ${
                      role === 'customer' ? 'text-primary' : 'text-text-primary'
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
                  className={`p-5 rounded-xl border-2 transition-all duration-200 ${
                    role === 'mechanic'
                      ? 'border-primary bg-primary/5 shadow-sm'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <Wrench className={`w-10 h-10 mx-auto mb-3 ${
                    role === 'mechanic' ? 'text-primary' : 'text-text-secondary'
                  }`} />
                  <div className="text-center">
                    <div className={`font-semibold text-base mb-1 ${
                      role === 'mechanic' ? 'text-primary' : 'text-text-primary'
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
            {/* Full Name - Mechanic Sign Up Only */}
            {mode === 'signup' && role === 'mechanic' && (
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
                    placeholder="Enter your full name"
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
                  placeholder="+1 (555) 000-0000"
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

            {/* Location - Sign Up Only */}
            {mode === 'signup' && (
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

            {/* Workshop/Garage Name - Mechanic Sign Up Only */}
            {mode === 'signup' && role === 'mechanic' && (
              <div>
                <label className="block text-sm font-semibold text-text-primary mb-2">
                  Workshop / Garage Name
                </label>
                <div className="relative">
                  <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
                  <input
                    type="text"
                    name="workshopName"
                    value={formData.workshopName}
                    onChange={handleInputChange}
                    className="w-full pl-12 pr-4 py-3.5 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    placeholder="Your workshop or garage name"
                    required
                  />
                </div>
              </div>
            )}

            {/* Service Location - Mechanic Sign Up Only */}
            {mode === 'signup' && role === 'mechanic' && (
              <div>
                <label className="block text-sm font-semibold text-text-primary mb-2">
                  Service Location
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="serviceLocation"
                    value={formData.serviceLocation}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3.5 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    placeholder="City, State or Area"
                    required
                  />
                </div>
              </div>
            )}

            {/* Years of Experience - Mechanic Sign Up Only */}
            {mode === 'signup' && role === 'mechanic' && (
              <div>
                <label className="block text-sm font-semibold text-text-primary mb-2">
                  Years of Experience
                </label>
                <div className="relative">
                  <Award className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
                  <input
                    type="number"
                    name="experience"
                    value={formData.experience}
                    onChange={handleInputChange}
                    className="w-full pl-12 pr-4 py-3.5 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    placeholder="Years of experience"
                    min="0"
                    required
                  />
                </div>
              </div>
            )}

            {/* Main Service Type - Mechanic Sign Up Only */}
            {mode === 'signup' && role === 'mechanic' && (
              <div>
                <label className="block text-sm font-semibold text-text-primary mb-2">
                  Main Service Type
                </label>
                <select
                  name="serviceType"
                  value={formData.serviceType}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3.5 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all appearance-none cursor-pointer"
                  required
                >
                  <option value="">Select main service type</option>
                  <option value="general">General Repair</option>
                  <option value="engine">Engine Repair</option>
                  <option value="tire">Tire Service</option>
                  <option value="battery">Battery Service</option>
                  <option value="electrical">Electrical Systems</option>
                  <option value="brake">Brake Service</option>
                  <option value="transmission">Transmission</option>
                  <option value="bodywork">Bodywork & Paint</option>
                </select>
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
              className="w-full bg-primary text-white py-3.5 rounded-xl font-semibold hover:bg-primary/90 transition-all duration-200 shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30"
            >
              {mode === 'login' ? 'Sign In' : 'Create Account'}
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
