import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { getWardMembers } from '../services/memberService';
import { WardMember } from '../types/member';
import { Mail, Phone, MapPin } from 'lucide-react';

const WardMembers: React.FC = () => {
  const [wardMembers, setWardMembers] = useState<WardMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchParams] = useSearchParams();
  
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        // Get all search params
        const params = {
          province: searchParams.get('province'),
          district: searchParams.get('district'),
          municipality: searchParams.get('municipality'),
          ward_no: searchParams.get('ward_no')
        };

        // Only make the API call if all parameters are present
        if (params.province && params.district && params.municipality && params.ward_no) {
          const response = await getWardMembers(params);
          console.log(response)
          setWardMembers(response);
        } else {
          setError('Please provide all location details to search for ward members.');
        }
      } catch (err) {
        console.error('Failed to fetch ward members:', err);
        setError('Failed to load ward members. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchMembers();
  }, [searchParams]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">{error}</h2>
        <Link 
          to="/ward-search"
          className="inline-flex items-center px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors"
        >
          Search Ward Members
        </Link>
      </div>
    );
  }

  if (wardMembers.length === 0) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">No Ward Members Found</h2>
        <p className="text-gray-500 mb-6">
          No members were found for the specified location.
        </p>
        <Link 
          to="/ward-search"
          className="inline-flex items-center px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors"
        >
          Try Another Search
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Ward Members</h1>
          <p className="text-gray-600">
            Showing members for {searchParams.get('municipality')}-{searchParams.get('ward_no')},{searchParams.get('district')}
          </p>
        </div>
        <Link 
          to="/ward-search"
          className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors"
        >
          New Search
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {wardMembers.map((member) => (
          <div key={member.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{member.name}</h3>
              <p className="text-teal-600 font-medium mb-4">{member.post}</p>
              
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-2 text-gray-400" />
                  <span>{member.email || 'N/A'}</span>
                </div>
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-2 text-gray-400" />
                  <span>{member.phone || 'N/A'}</span>
                </div>
                <div className="flex items-start">
                  <MapPin className="h-4 w-4 mr-2 text-gray-400 mt-0.5" />
                  <span>
                    Ward {searchParams.get('ward_no')}, {searchParams.get('municipality')}
                  </span>
                </div>
              </div>
              
              {member.bio && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-600">{member.bio}</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WardMembers;