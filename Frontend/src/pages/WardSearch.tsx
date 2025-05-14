import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { getProvinces, getDistrictsByProvince, getMunicipalitiesByDistrict, Province, District, Municipality } from '../services/memberService';

interface SearchForm {
  province: string;
  district: string;
  municipality: string;
  ward_no: string;
}

const WardSearch: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<SearchForm>({
    province: '',
    district: '',
    municipality: '',
    ward_no: '',
  });

  // State for location data
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [municipalities, setMunicipalities] = useState<Municipality[]>([]);
  const [selectedProvince, setSelectedProvince] = useState<number | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<number | null>(null);
  const [errors, setErrors] = useState<Partial<Record<keyof SearchForm, string>>>({});

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
          setFormData(prev => ({ ...prev, district: '', municipality: '' }));
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name as keyof SearchForm]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
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
          district: selectedDistrictObj.name.toLowerCase(),
          municipality: ''
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

  // Update province selection handler
  const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value ? parseInt(e.target.value) : null;
    setSelectedProvince(value);
    
    if (value) {
      const selectedProvinceObj = provinces.find(p => p.id === value);
      if (selectedProvinceObj) {
        setFormData(prev => ({
          ...prev,
          province: selectedProvinceObj.name.toLowerCase(),
          district: '',
          municipality: ''
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        province: '',
        district: '',
        municipality: ''
      }));
    }
  };

  // Update municipality selection handler
  const handleMunicipalityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setFormData(prev => ({
      ...prev,
      municipality: value.toLowerCase()
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof SearchForm, string>> = {};
    
    if (!formData.province) newErrors.province = 'Province is required';
    if (!formData.district) newErrors.district = 'District is required';
    if (!formData.municipality) newErrors.municipality = 'Municipality is required';
    if (!formData.ward_no) newErrors.ward_no = 'Ward number is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const queryParams = new URLSearchParams({
      province: formData.province,
      district: formData.district,
      municipality: formData.municipality,
      ward_no: formData.ward_no
    });

    navigate(`/ward-members?${queryParams.toString()}`);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Search className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <h1 className="text-2xl font-bold text-gray-900">Find Your Ward</h1>
              <p className="text-gray-600">Enter your location details to find ward information</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Province */}
            <div>
              <label htmlFor="province" className="block text-sm font-medium text-gray-700">
                Province <span className="text-red-500">*</span>
              </label>
              <select
                id="province"
                name="province"
                value={selectedProvince || ''}
                onChange={handleProvinceChange}
                className={`mt-1 block w-full px-3 py-2 border ${
                  errors.province ? 'border-red-300' : 'border-gray-300'
                } rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500`}
              >
                <option value="">Select a province</option>
                {provinces.map(province => (
                  <option key={province.id} value={province.id}>
                    {province.name}
                  </option>
                ))}
              </select>
              {errors.province && (
                <p className="mt-1 text-sm text-red-600">{errors.province}</p>
              )}
            </div>

            {/* District */}
            <div>
              <label htmlFor="district" className="block text-sm font-medium text-gray-700">
                District <span className="text-red-500">*</span>
              </label>
              <select
                id="district"
                name="district"
                value={selectedDistrict || ''}
                onChange={handleDistrictChange}
                className={`mt-1 block w-full px-3 py-2 border ${
                  errors.district ? 'border-red-300' : 'border-gray-300'
                } rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500`}
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
              <label htmlFor="municipality" className="block text-sm font-medium text-gray-700">
                Municipality <span className="text-red-500">*</span>
              </label>
              <select
                id="municipality"
                name="municipality"
                value={formData.municipality}
                onChange={handleMunicipalityChange}
                className={`mt-1 block w-full px-3 py-2 border ${
                  errors.municipality ? 'border-red-300' : 'border-gray-300'
                } rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500`}
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

            {/* Ward Number */}
            <div>
              <label htmlFor="ward_no" className="block text-sm font-medium text-gray-700">
                Ward Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="ward_no"
                name="ward_no"
                value={formData.ward_no}
                onChange={handleChange}
                className={`mt-1 block w-full px-3 py-2 border ${
                  errors.ward_no ? 'border-red-300' : 'border-gray-300'
                } rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500`}
              />
              {errors.ward_no && (
                <p className="mt-1 text-sm text-red-600">{errors.ward_no}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Search Ward
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default WardSearch;