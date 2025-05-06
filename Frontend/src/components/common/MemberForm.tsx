import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, Calendar, FileText, Upload } from 'lucide-react';

interface Address {
  country: string;
  municipality: string;
  placeName: string;
  wardNo: string;
}

interface MemberFormData {
  firstName: string;
  lastName: string;
  position: string;
  email: string;
  phoneNumber: string;
  address: Address;
  biography: string;
  dateOfBirth: string;
  appointmentDate: string;
  photo?: File | null;
}

interface MemberFormProps {
  initialData?: Partial<MemberFormData>;
  onSubmit: (data: MemberFormData) => Promise<void>;
  loading: boolean;
  title: string;
}

const MemberForm: React.FC<MemberFormProps> = ({ 
  initialData, 
  onSubmit, 
  loading,
  title
}) => {
  const [formData, setFormData] = useState<MemberFormData>({
    firstName: initialData?.firstName || '',
    lastName: initialData?.lastName || '',
    position: initialData?.position || '',
    email: initialData?.email || '',
    phoneNumber: initialData?.phoneNumber || '',
    address: initialData?.address || { country: '', municipality: '', placeName: '', wardNo: '' },
    biography: initialData?.biography || '',
    dateOfBirth: initialData?.dateOfBirth || '',
    appointmentDate: initialData?.appointmentDate || '',
    photo: null,
  });
  
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<Partial<Record<string, string>>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof MemberFormData],
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData((prev) => ({ ...prev, photo: file }));
      
      // Create a preview URL
      const reader = new FileReader();
      reader.onload = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    // Required field validation
    if (!formData.firstName) newErrors.firstName = 'First name is required';
    if (!formData.lastName) newErrors.lastName = 'Last name is required';
    if (!formData.position) newErrors.position = 'Position is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.phoneNumber) newErrors.phoneNumber = 'Phone number is required';
    if (!formData.address.country) newErrors['address.country'] = 'Country is required';
    if (!formData.address.municipality) newErrors['address.municipality'] = 'Municipality is required';
    if (!formData.address.wardNo) newErrors['address.wardNo'] = 'Ward number is required';
    if (!formData.appointmentDate) newErrors.appointmentDate = 'Appointment date is required';
    
    // Email validation
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Form submission failed:', error);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-xl font-medium text-gray-800">{title}</h2>
      </div>
      
      <form onSubmit={handleSubmit} className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Personal Information */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-lg font-medium text-gray-700 mb-4 pb-2 border-b border-gray-200">
              Personal Information
            </h3>
          </div>
          
          {/* Photo Upload */}
          <div className="col-span-1 md:col-span-2 flex flex-col md:flex-row items-center gap-6">
            <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
              {photoPreview ? (
                <img 
                  src={photoPreview} 
                  alt="Preview" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="h-12 w-12 text-gray-400" />
              )}
            </div>
            
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Member Photo
              </label>
              <div className="flex items-center space-x-4">
                <label className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Photo
                  <input 
                    type="file" 
                    className="hidden" 
                    accept="image/*" 
                    onChange={handlePhotoChange}
                  />
                </label>
                
                {photoPreview && (
                  <button
                    type="button"
                    onClick={() => {
                      setPhotoPreview(null);
                      setFormData((prev) => ({ ...prev, photo: null }));
                    }}
                    className="text-sm text-red-600 hover:text-red-700"
                  >
                    Remove
                  </button>
                )}
              </div>
              <p className="mt-2 text-sm text-gray-500">
                JPG, PNG or GIF, max 5MB
              </p>
            </div>
          </div>
          
          {/* First Name */}
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
              First Name <span className="text-red-500">*</span>
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className={`block w-full pl-10 py-2 border ${
                  errors.firstName ? 'border-red-300' : 'border-gray-300'
                } rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500`}
              />
            </div>
            {errors.firstName && (
              <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
            )}
          </div>
          
          {/* Last Name */}
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
              Last Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className={`block w-full py-2 px-3 border ${
                errors.lastName ? 'border-red-300' : 'border-gray-300'
              } rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500`}
            />
            {errors.lastName && (
              <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
            )}
          </div>
          
          {/* Position */}
          <div>
            <label htmlFor="position" className="block text-sm font-medium text-gray-700 mb-1">
              Position <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="position"
              name="position"
              value={formData.position}
              onChange={handleChange}
              className={`block w-full py-2 px-3 border ${
                errors.position ? 'border-red-300' : 'border-gray-300'
              } rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500`}
              placeholder="e.g. Ward Chairperson"
            />
            {errors.position && (
              <p className="mt-1 text-sm text-red-600">{errors.position}</p>
            )}
          </div>
          
          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
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
                className={`block w-full pl-10 py-2 border ${
                  errors.email ? 'border-red-300' : 'border-gray-300'
                } rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500`}
              />
            </div>
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email}</p>
            )}
          </div>
          
          {/* Phone Number */}
          <div>
            <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Phone className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                className={`block w-full pl-10 py-2 border ${
                  errors.phoneNumber ? 'border-red-300' : 'border-gray-300'
                } rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500`}
              />
            </div>
            {errors.phoneNumber && (
              <p className="mt-1 text-sm text-red-600">{errors.phoneNumber}</p>
            )}
          </div>
          
          {/* Dates Section */}
          <div>
            <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-1">
              Date of Birth
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Calendar className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="date"
                id="dateOfBirth"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                className="block w-full pl-10 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500"
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="appointmentDate" className="block text-sm font-medium text-gray-700 mb-1">
              Appointment Date <span className="text-red-500">*</span>
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Calendar className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="date"
                id="appointmentDate"
                name="appointmentDate"
                value={formData.appointmentDate}
                onChange={handleChange}
                className={`block w-full pl-10 py-2 border ${
                  errors.appointmentDate ? 'border-red-300' : 'border-gray-300'
                } rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500`}
              />
            </div>
            {errors.appointmentDate && (
              <p className="mt-1 text-sm text-red-600">{errors.appointmentDate}</p>
            )}
          </div>
          
          {/* Address Section */}
          <div className="col-span-1 md:col-span-2 mt-4">
            <h3 className="text-lg font-medium text-gray-700 mb-4 pb-2 border-b border-gray-200">
              Address Information
            </h3>
          </div>
          
          <div>
            <label htmlFor="address.country" className="block text-sm font-medium text-gray-700 mb-1">
              Country <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="address.country"
              name="address.country"
              value={formData.address.country}
              onChange={handleChange}
              className={`block w-full py-2 px-3 border ${
                errors['address.country'] ? 'border-red-300' : 'border-gray-300'
              } rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500`}
            />
            {errors['address.country'] && (
              <p className="mt-1 text-sm text-red-600">{errors['address.country']}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="address.municipality" className="block text-sm font-medium text-gray-700 mb-1">
              Municipality <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="address.municipality"
              name="address.municipality"
              value={formData.address.municipality}
              onChange={handleChange}
              className={`block w-full py-2 px-3 border ${
                errors['address.municipality'] ? 'border-red-300' : 'border-gray-300'
              } rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500`}
            />
            {errors['address.municipality'] && (
              <p className="mt-1 text-sm text-red-600">{errors['address.municipality']}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="address.placeName" className="block text-sm font-medium text-gray-700 mb-1">
              Place Name
            </label>
            <input
              type="text"
              id="address.placeName"
              name="address.placeName"
              value={formData.address.placeName}
              onChange={handleChange}
              className="block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500"
            />
          </div>
          
          <div>
            <label htmlFor="address.wardNo" className="block text-sm font-medium text-gray-700 mb-1">
              Ward Number <span className="text-red-500">*</span>
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MapPin className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                id="address.wardNo"
                name="address.wardNo"
                value={formData.address.wardNo}
                onChange={handleChange}
                className={`block w-full pl-10 py-2 border ${
                  errors['address.wardNo'] ? 'border-red-300' : 'border-gray-300'
                } rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500`}
              />
            </div>
            {errors['address.wardNo'] && (
              <p className="mt-1 text-sm text-red-600">{errors['address.wardNo']}</p>
            )}
          </div>
          
          {/* Biography */}
          <div className="col-span-1 md:col-span-2 mt-4">
            <h3 className="text-lg font-medium text-gray-700 mb-4 pb-2 border-b border-gray-200">
              Additional Information
            </h3>
          </div>
          
          <div className="col-span-1 md:col-span-2">
            <label htmlFor="biography" className="block text-sm font-medium text-gray-700 mb-1">
              Biography
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute top-3 left-3 flex items-start pointer-events-none">
                <FileText className="h-5 w-5 text-gray-400" />
              </div>
              <textarea
                id="biography"
                name="biography"
                rows={5}
                value={formData.biography}
                onChange={handleChange}
                className="block w-full pl-10 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500"
                placeholder="Enter a brief biography..."
              ></textarea>
            </div>
          </div>
        </div>
        
        <div className="mt-8 flex justify-end">
          <button
            type="button"
            className="mr-3 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
            onClick={() => window.history.back()}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Saving...' : 'Save Member'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default MemberForm;