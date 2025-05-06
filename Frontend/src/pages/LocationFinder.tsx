import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getWards } from '../services/memberService';
import { Ward } from '../types/member';
import { MapPin, Search, Mail, Phone, Users } from 'lucide-react';

const LocationFinder: React.FC = () => {
  const [wards, setWards] = useState<Ward[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedWard, setSelectedWard] = useState<Ward | null>(null);
  
  // Filter wards based on search query
  const filteredWards = wards.filter(ward => {
    const searchLower = searchQuery.toLowerCase();
    return (
      ward.wardNo.toLowerCase().includes(searchLower) ||
      ward.municipalityName.toLowerCase().includes(searchLower) ||
      ward.address.toLowerCase().includes(searchLower)
    );
  });
  
  useEffect(() => {
    const fetchWards = async () => {
      try {
        const wardsData = await getWards();
        setWards(wardsData);
        if (wardsData.length > 0) {
          setSelectedWard(wardsData[0]);
        }
      } catch (err) {
        console.error('Failed to fetch wards:', err);
        setError('Failed to load ward offices. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchWards();
  }, []);

  const handleWardSelect = (ward: Ward) => {
    setSelectedWard(ward);
  };
  
  // Google Maps URL generator
  const getGoogleMapsUrl = (lat: number, lng: number) => {
    return `https://www.google.com/maps?q=${lat},${lng}`;
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Ward Office Locations</h1>
      <p className="text-gray-600 mb-6">
        Find ward offices and their locations across the region
      </p>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left sidebar - Ward list */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-4 border-b">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search ward offices..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                />
              </div>
            </div>
            
            <div className="overflow-y-auto max-h-[500px]">
              {filteredWards.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  No ward offices found matching your search
                </div>
              ) : (
                <ul className="divide-y divide-gray-200">
                  {filteredWards.map((ward) => (
                    <li 
                      key={ward.id}
                      className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                        selectedWard?.id === ward.id ? 'bg-teal-50 border-l-4 border-teal-500' : ''
                      }`}
                      onClick={() => handleWardSelect(ward)}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-1">
                          <MapPin className={`h-5 w-5 ${selectedWard?.id === ward.id ? 'text-teal-500' : 'text-gray-400'}`} />
                        </div>
                        <div>
                          <h3 className="text-gray-800 font-medium">
                            {ward.municipalityName} - Ward {ward.wardNo}
                          </h3>
                          <p className="text-sm text-gray-500 mt-1">
                            {ward.address}
                          </p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
        
        {/* Main content - Map and Details */}
        <div className="lg:col-span-2">
          {selectedWard ? (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6 border-b">
                <h2 className="text-xl font-semibold text-gray-800 mb-1">
                  {selectedWard.municipalityName} - Ward {selectedWard.wardNo}
                </h2>
                <p className="text-gray-600">{selectedWard.address}</p>
              </div>
              
              <div className="p-6">
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-800 mb-3">Contact Information</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-start">
                      <Phone className="h-5 w-5 mr-3 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Phone</p>
                        <p className="text-gray-800">{selectedWard.contactNumber}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <Mail className="h-5 w-5 mr-3 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Email</p>
                        <p className="text-gray-800">{selectedWard.email}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Map container */}
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-800 mb-3">Location</h3>
                  
                  <div className="bg-gray-100 rounded-lg p-4 text-center">
                    <p className="text-gray-600 mb-4">
                      The map integration will be added here using Google Maps API with the following coordinates:
                    </p>
                    <p className="font-mono text-sm mb-4">
                      Latitude: {selectedWard.location.latitude}, Longitude: {selectedWard.location.longitude}
                    </p>
                    <a 
                      href={getGoogleMapsUrl(selectedWard.location.latitude, selectedWard.location.longitude)} 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors"
                    >
                      <MapPin className="w-4 h-4 mr-2" />
                      View on Google Maps
                    </a>
                  </div>
                </div>
                
                <div>
                  <Link 
                    to={`/ward-members?wardId=${selectedWard.wardNo}`}
                    className="inline-flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md transition-colors"
                  >
                    <Users className="w-4 h-4 mr-2" />
                    View Ward Members
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-700 mb-2">No Ward Selected</h3>
              <p className="text-gray-500">
                Select a ward from the list to view its location details
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LocationFinder;