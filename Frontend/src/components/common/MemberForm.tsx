import React, { useState, useEffect } from 'react';
import { User, Mail } from 'lucide-react';
import { getProvinces, getDistrictsByProvince, getMunicipalitiesByDistrict, Province, District, Municipality } from '../../services/memberService';

interface MemberFormData {
  name: string;
  gender: 'Male' | 'Female' | 'Other';
  post: string;
  email: string;
  municipality: string;
  district: string;
  ward: number;
  bio?: string | null;
}

interface MemberFormProps {
  initialData?: Partial<MemberFormData>;
  onSubmit: (data: MemberFormData) => void;
  loading: boolean;
  title: string;
}

const POSITION_OPTIONS = [
  { value: 'Chairperson', label: 'Chairperson' },
  { value: 'Vice-Chairperson', label: 'Vice-Chairperson' },
  { value: 'Secratary', label: 'Secretary' },
  { value: 'Member', label: 'Member' }
];

const MemberForm: React.FC<MemberFormProps> = ({ 
  initialData, 
  onSubmit, 
  loading,
  title
}) => {
  const [formData, setFormData] = useState<MemberFormData>({
    name: initialData?.name || '',
    gender: initialData?.gender || 'Male',
    post: initialData?.post || '',
    email: initialData?.email || '',
    municipality: initialData?.municipality || '',
    district: initialData?.district || '',
    ward: initialData?.ward || 0,
    bio: initialData?.bio || '',
  });

  // State for location data
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [municipalities, setMunicipalities] = useState<Municipality[]>([]);
  const [selectedProvince, setSelectedProvince] = useState<number | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<number | null>(null);
  
  const [errors, setErrors] = useState<Partial<Record<string, string>>>({});

  // Fetch provinces on component mount
  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const data = await getProvinces();
        setProvinces(data);
      } catch (error) {
        console.error('Error fetching provinces:', error);
      }
    };
    fetchProvinces();
  }, []);

  // Fetch districts when province changes
  useEffect(() => {
    const fetchDistricts = async () => {
      if (selectedProvince) {
        try {
          const data = await getDistrictsByProvince(selectedProvince);
          setDistricts(data);
          setSelectedDistrict(null);
          setMunicipalities([]);
          setFormData(prev => ({ ...prev, municipality: '', district: '' }));
        } catch (error) {
          console.error('Error fetching districts:', error);
        }
      } else {
        setDistricts([]);
      }
    };
    fetchDistricts();
  }, [selectedProvince]);

  // Fetch municipalities when district changes
  useEffect(() => {
    const fetchMunicipalities = async () => {
      if (selectedDistrict) {
        try {
          const data = await getMunicipalitiesByDistrict(selectedDistrict);
          setMunicipalities(data);
          setFormData(prev => ({ ...prev, municipality: '' }));
        } catch (error) {
          console.error('Error fetching municipalities:', error);
        }
      } else {
        setMunicipalities([]);
      }
    };
    fetchMunicipalities();
  }, [selectedDistrict]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'ward' ? parseInt(value) : value,
    }));
    
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.post) newErrors.post = 'Position is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.gender) newErrors.gender = 'Gender is required';
    if (!formData.municipality) newErrors.municipality = 'Municipality is required';
    if (!formData.district) newErrors.district = 'District is required';
    if (!formData.ward) newErrors.ward = 'Ward is required';
    if(formData.ward <=0 || !Number.isInteger(formData.ward)) {
      newErrors.ward="Ward must be Positive Integer"
    }
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  // Update district selection handler
  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value ? parseInt(e.target.value) : null;
    setSelectedDistrict(value);
    
    if (value) {
      const selectedDistrictObj = districts.find(d => d.id === value);
      if (selectedDistrictObj) {
        setFormData(prev => ({
          ...prev,
          district: selectedDistrictObj.name,
          municipality: '' // Reset municipality when district changes
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        district: '',
        municipality: ''
      }));
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">{title}</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-6">
          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Name <span className="text-red-500">*</span>
            </label>
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`block w-full pl-10 py-2 border ${
                  errors.name ? 'border-red-300' : 'border-gray-300'
                } rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500`}
              />
            </div>
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name}</p>
            )}
          </div>

          {/* Gender */}
          <div>
            <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
              Gender <span className="text-red-500">*</span>
            </label>
            <select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className={`block w-full py-2 px-3 border ${
                errors.gender ? 'border-red-300' : 'border-gray-300'
              } rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500`}
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            {errors.gender && (
              <p className="mt-1 text-sm text-red-600">{errors.gender}</p>
            )}
          </div>

          {/* Position */}
          <div>
            <label htmlFor="post" className="block text-sm font-medium text-gray-700 mb-1">
              Position <span className="text-red-500">*</span>
            </label>
            <select
              id="post"
              name="post"
              value={formData.post}
              onChange={handleChange}
              className={`block w-full py-2 px-3 border ${
                errors.post ? 'border-red-300' : 'border-gray-300'
              } rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500`}
            >
              <option value="">Select a position</option>
              {POSITION_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {errors.post && (
              <p className="mt-1 text-sm text-red-600">{errors.post}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email <span className="text-red-500">*</span>
            </label>
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-4 text-gray-400" />
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

          {/* Province */}
          <div>
            <label htmlFor="province" className="block text-sm font-medium text-gray-700 mb-1">
              Province <span className="text-red-500">*</span>
            </label>
            <select
              id="province"
              name="province"
              value={selectedProvince || ''}
              onChange={(e) => setSelectedProvince(e.target.value ? parseInt(e.target.value) : null)}
              className="block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500"
            >
              <option value="">Select a province</option>
              {provinces.map(province => (
                <option key={province.id} value={province.id}>
                  {province.name}
                </option>
              ))}
            </select>
          </div>

          {/* District */}
          <div>
            <label htmlFor="district" className="block text-sm font-medium text-gray-700 mb-1">
              District <span className="text-red-500">*</span>
            </label>
            <select
              id="district"
              name="district"
              value={selectedDistrict || ''}
              onChange={handleDistrictChange}
              className={`block w-full py-2 px-3 border ${
                errors.district ? 'border-red-300' : 'border-gray-300'
              } rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500`}
              disabled={!selectedProvince}
            >
              <option value="">Select a district</option>
              {districts.map(district => (
                <option key={district.id} value={district.id}>
                  {district.name}
                </option>
              ))}
            </select>
            {errors.district && (
              <p className="mt-1 text-sm text-red-600">{errors.district}</p>
            )}
          </div>

          {/* Municipality */}
          <div>
            <label htmlFor="municipality" className="block text-sm font-medium text-gray-700 mb-1">
              Municipality <span className="text-red-500">*</span>
            </label>
            <select
              id="municipality"
              name="municipality"
              value={formData.municipality}
              onChange={handleChange}
              className={`block w-full py-2 px-3 border ${
                errors.municipality ? 'border-red-300' : 'border-gray-300'
              } rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500`}
              disabled={!selectedDistrict}
            >
              <option value="">Select a municipality</option>
              {municipalities.map(municipality => (
                <option key={municipality.id} value={municipality.name}>
                  {municipality.name} ({municipality.type})
                </option>
              ))}
            </select>
            {errors.municipality && (
              <p className="mt-1 text-sm text-red-600">{errors.municipality}</p>
            )}
          </div>

          {/* Ward */}
          <div>
            <label htmlFor="ward" className="block text-sm font-medium text-gray-700 mb-1">
              Ward Number <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              id="ward"
              name="ward"
              value={formData.ward}
              onChange={handleChange}
              className={`block w-full py-2 px-3 border ${
                errors.ward ? 'border-red-300' : 'border-gray-300'
              } rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500`}
            />
            {errors.ward && (
              <p className="mt-1 text-sm text-red-600">{errors.ward}</p>
            )}
          </div>
          
          {/* Bio */}
          <div>
            <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
              Biography
            </label>
            <textarea
              id="bio"
              name="bio"
              rows={4}
              value={formData.bio || ''}
              onChange={handleChange}
              className="block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Saving...' : 'Save Member'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default MemberForm;