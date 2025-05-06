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
  const wardId = searchParams.get('wardId');
  
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const members = await getWardMembers();
        
        // Filter by ward if wardId is present
        if (wardId) {
          const filteredMembers = members.filter(member => 
            member.address.wardNo === wardId
          );
          setWardMembers(filteredMembers);
        } else {
          setWardMembers(members);
        }
      } catch (err) {
        console.error('Failed to fetch ward members:', err);
        setError('Failed to load ward members. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchMembers();
  }, [wardId]);

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

  if (wardMembers.length === 0) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">No Ward Members Found</h2>
        <p className="text-gray-500 mb-6">
          {wardId 
            ? "No members were found for the selected ward." 
            : "There are no ward members in the system yet."}
        </p>
        <Link 
          to="/"
          className="inline-flex items-center px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors"
        >
          Return to Home
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Ward Members</h1>
          <p className="text-gray-600">
            {wardId 
              ? `Showing members for Ward ${wardId}` 
              : "Browse all ward members and their details"}
          </p>
        </div>
        
        {wardId && (
          <Link 
            to="/ward-members"
            className="mt-4 md:mt-0 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-gray-700 transition-colors"
          >
            View All Members
          </Link>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {wardMembers.map((member) => (
          <Link 
            key={member.id}
            to={`/ward-members/${member.id}`}
            className="block"
          >
            <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <div className="h-2 bg-teal-500"></div>
              <div className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-24 h-24 rounded-full overflow-hidden flex-shrink-0 bg-gray-200">
                    {member.photo ? (
                      <img 
                        src={member.photo} 
                        alt={`${member.firstName} ${member.lastName}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-teal-100 text-teal-500">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-800">
                      {member.firstName} {member.lastName}
                    </h3>
                    <p className="text-teal-600 font-medium mb-2">{member.position}</p>
                    
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 mr-2 text-gray-400" />
                        <span className="truncate">{member.email}</span>
                      </div>
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 mr-2 text-gray-400" />
                        <span>{member.phoneNumber}</span>
                      </div>
                      <div className="flex items-start">
                        <MapPin className="h-4 w-4 mr-2 text-gray-400 mt-0.5" />
                        <span className="truncate">
                          Ward {member.address.wardNo}, {member.address.municipality}, {member.address.country}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="px-6 py-3 bg-gray-50 text-center">
                <span className="text-sm font-medium text-teal-600">View Details</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default WardMembers;