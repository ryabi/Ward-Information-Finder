import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { RegisterData } from '../../types/auth';
import { 
  User, Mail, Phone, MapPin, Calendar, 
  Lock, AlertCircle, Globe, Building, Home
} from 'lucide-react';

const Register: React.FC = () => {
  const [formData, setFormData] = useState<RegisterData>({
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    gender: '',
    country: '',
    province: '',
    district: '',
    municipality: '',
    town: '',
    ward_no: '',
    date_of_birth: '',
    username: '',
    password: '',
    re_password:'',
  });
  
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof RegisterData, string>>>({});
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    if (formErrors[name as keyof RegisterData]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = (): boolean => {
    const errors: Partial<Record<keyof RegisterData, string>> = {};
    
    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }
    
    if (formData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    }

    if (formData.password !== formData.re_password) {
      errors.re_password = 'Passwords do not match';
    }
    
    
    if (!formData.first_name) errors.first_name = 'First name is required';
    if (!formData.last_name) errors.last_name = 'Last name is required';
    if (!formData.username) errors.username = 'Username is required';
    if (!formData.gender) errors.gender = 'Gender is required';
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      await register(formData);
      navigate('/login');
    } catch (error: any) {
      if (error.response && error.response.data) {
        const backendErrors = error.response.data;
    
        const newErrors: Partial<Record<keyof RegisterData, string>> = {};
        Object.keys(backendErrors).forEach((key) => {
          const field = key as keyof RegisterData;
          newErrors[field] = backendErrors[key][0]; // if errors are array-based
        });
    
        setFormErrors((prev) => ({
          ...prev,
          ...newErrors,
        }));
      } else {
        setFormErrors((prev) => ({
          ...prev,
          username: 'Registration failed. Please try again.',
        }));
      }
    }
    
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-teal-600 hover:text-teal-500">
              Sign in
            </Link>
          </p>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <form onSubmit={handleSubmit} className="p-6 sm:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Personal Information */}
              <div className="col-span-1 md:col-span-2">
                <h3 className="text-lg font-medium text-gray-900 mb-4 pb-2 border-b border-gray-200">
                  Personal Information
                </h3>
              </div>
              
              {/* First Name */}
              <div>
                <label htmlFor="first_name" className="block text-sm font-medium text-gray-700">
                  First Name <span className="text-red-500">*</span>
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="first_name"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    required
                    className={`block w-full pl-10 py-3 border ${
                      formErrors.first_name ? 'border-red-300' : 'border-gray-300'
                    } rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500`}
                  />
                </div>
                {formErrors.first_name && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.first_name}</p>
                )}
              </div>
              
              {/* Last Name */}
              <div>
                <label htmlFor="last_name" className="block text-sm font-medium text-gray-700">
                  Last Name <span className="text-red-500">*</span>
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    id="last_name"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    required
                    className={`block w-full py-3 px-4 border ${
                      formErrors.last_name ? 'border-red-300' : 'border-gray-300'
                    } rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500`}
                  />
                </div>
                {formErrors.last_name && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.last_name}</p>
                )}
              </div>
              
              {/* Gender */}
              <div>
                <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
                  Gender <span className="text-red-500">*</span>
                </label>
                <div className="mt-1">
                  <select
                    id="gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    required
                    className={`block w-full py-3 px-4 border ${
                      formErrors.gender ? 'border-red-300' : 'border-gray-300'
                    } rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500`}
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                {formErrors.gender && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.gender}</p>
                )}
              </div>
              
              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email <span className="text-red-500">*</span>
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className={`block w-full pl-10 py-3 border ${
                      formErrors.email ? 'border-red-300' : 'border-gray-300'
                    } rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500`}
                  />
                </div>
                {formErrors.email && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>
                )}
              </div>
              
              {/* Phone Number */}
              <div>
                <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700">
                  Phone Number
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="tel"
                    id="phone_number"
                    name="phone_number"
                    value={formData.phone_number}
                    onChange={handleChange}
                    className="block w-full pl-10 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500"
                  />
                </div>
              </div>
              
              {/* Date of Birth */}
              <div>
                <label htmlFor="date_of_birth" className="block text-sm font-medium text-gray-700">
                  Date of Birth
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="date"
                    id="date_of_birth"
                    name="date_of_birth"
                    value={formData.date_of_birth}
                    onChange={handleChange}
                    className="block w-full pl-10 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500"
                  />
                </div>
              </div>
              
              {/* Address Information */}
              <div className="col-span-1 md:col-span-2 mt-4">
                <h3 className="text-lg font-medium text-gray-900 mb-4 pb-2 border-b border-gray-200">
                  Address Information
                </h3>
              </div>
              
              {/* Country */}
              <div>
                <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                  Country
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Globe className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className="block w-full pl-10 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500"
                  />
                </div>
              </div>

              {/* Province */}
              <div>
                <label htmlFor="province" className="block text-sm font-medium text-gray-700">
                  Province
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    id="province"
                    name="province"
                    value={formData.province}
                    onChange={handleChange}
                    className="block w-full py-3 px-4 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500"
                  />
                </div>
              </div>

              {/* District */}
              <div>
                <label htmlFor="district" className="block text-sm font-medium text-gray-700">
                  District
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    id="district"
                    name="district"
                    value={formData.district}
                    onChange={handleChange}
                    className="block w-full py-3 px-4 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500"
                  />
                </div>
              </div>
              
              {/* Municipality */}
              <div>
                <label htmlFor="municipality" className="block text-sm font-medium text-gray-700">
                  Municipality
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Building className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="municipality"
                    name="municipality"
                    value={formData.municipality}
                    onChange={handleChange}
                    className="block w-full pl-10 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500"
                  />
                </div>
              </div>
              
              {/* Town */}
              <div>
                <label htmlFor="town" className="block text-sm font-medium text-gray-700">
                  Town
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Home className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="town"
                    name="town"
                    value={formData.town}
                    onChange={handleChange}
                    className="block w-full pl-10 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500"
                  />
                </div>
              </div>
              
              {/* Ward Number */}
              <div>
                <label htmlFor="ward_no" className="block text-sm font-medium text-gray-700">
                  Ward Number (Optional)
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MapPin className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="ward_no"
                    name="ward_no"
                    value={formData.ward_no}
                    onChange={handleChange}
                    className="block w-full pl-10 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500"
                  />
                </div>
              </div>
              
              {/* Account Information */}
              <div className="col-span-1 md:col-span-2 mt-4">
                <h3 className="text-lg font-medium text-gray-900 mb-4 pb-2 border-b border-gray-200">
                  Account Information
                </h3>
              </div>
              
              {/* Username */}
              <div className="col-span-2">
                <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                  Username <span className="text-red-500">*</span>
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                    className={`block w-full pl-10 py-3 border ${
                      formErrors.username ? 'border-red-300' : 'border-gray-300'
                    } rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500`}
                  />
                </div>
                {formErrors.username && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.username}</p>
                )}
              </div>
              
              {/* Password */}
              <div className="col-span-2">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className={`block w-full pl-10 py-3 border ${
                      formErrors.password ? 'border-red-300' : 'border-gray-300'
                    } rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500`}
                  />
                </div>
                {formErrors.password && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.password}</p>
                )}
              </div>
            
            {/* Confirm Password */}
            <div className="col-span-2">
                <label htmlFor="re_password" className="block text-sm font-medium text-gray-700">
                  Confirm Password <span className="text-red-500">*</span>
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="password"
                    id="re_password"
                    name="re_password"
                    value={formData.re_password}
                    onChange={handleChange}
                    required
                    className={`block w-full pl-10 py-3 border ${
                      formErrors.re_password ? 'border-red-300' : 'border-gray-300'
                    } rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500`}
                  />
                </div>
                {formErrors.re_password && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.re_password}</p>
                )}
              </div>
            </div>
            
            <div className="mt-8">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating account...' : 'Create account'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;