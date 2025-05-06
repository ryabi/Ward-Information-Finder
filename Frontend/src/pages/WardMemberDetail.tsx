import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getWardMemberById } from '../services/memberService';
import { WardMember } from '../types/member';
import { Mail, Phone, MapPin, Calendar, Clock, ArrowLeft } from 'lucide-react';

const WardMemberDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [member, setMember] = useState<WardMember | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMemberDetails = async () => {
      if (!id) return;
      
      try {
        const memberData = await getWardMemberById(parseInt(id));
        setMember(memberData);
      } catch (err) {
        console.error('Failed to fetch member details:', err);
        setError('Failed to load member details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchMemberDetails();
  }, [id]);

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  if (error || !member) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          {error || 'Member not found'}
        </h2>
        <p className="text-gray-500 mb-6">
          The ward member you're looking for could not be found.
        </p>
        <button 
          onClick={() => navigate(-1)}
          className="inline-flex items-center px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Breadcrumbs */}
      <nav className="mb-6 text-sm">
        <ol className="flex items-center space-x-2">
          <li>
            <Link to="/" className="text-gray-500 hover:text-teal-600 transition-colors">
              Home
            </Link>
          </li>
          <li className="text-gray-400">/</li>
          <li>
            <Link to="/ward-members" className="text-gray-500 hover:text-teal-600 transition-colors">
              Ward Members
            </Link>
          </li>
          <li className="text-gray-400">/</li>
          <li className="text-teal-600 font-medium">
            {member.firstName} {member.lastName}
          </li>
        </ol>
      </nav>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="h-3 bg-teal-500"></div>
        
        {/* Header Section */}
        <div className="p-6 md:p-8 flex flex-col md:flex-row gap-6 md:gap-8 items-start">
          <div className="w-32 h-32 md:w-48 md:h-48 rounded-full overflow-hidden flex-shrink-0 bg-gray-200 border-4 border-white shadow-md mx-auto md:mx-0">
            {member.photo ? (
              <img 
                src={member.photo} 
                alt={`${member.firstName} ${member.lastName}`}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-teal-100 text-teal-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            )}
          </div>
          
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              {member.firstName} {member.lastName}
            </h1>
            <p className="text-teal-600 text-xl font-medium mb-4">
              {member.position}
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
              <div className="flex items-start">
                <Mail className="h-5 w-5 mr-3 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500 mb-1">Email</p>
                  <p className="text-gray-800">{member.email}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Phone className="h-5 w-5 mr-3 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500 mb-1">Phone</p>
                  <p className="text-gray-800">{member.phoneNumber}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <MapPin className="h-5 w-5 mr-3 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500 mb-1">Ward Office</p>
                  <p className="text-gray-800">
                    Ward {member.address.wardNo}, {member.address.municipality}
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Clock className="h-5 w-5 mr-3 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500 mb-1">Appointment Date</p>
                  <p className="text-gray-800">{formatDate(member.appointmentDate)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Biography Section */}
        <div className="px-6 md:px-8 pb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">Biography</h2>
          <div className="prose max-w-none">
            <p className="text-gray-700 leading-relaxed">{member.biography || 'No biography available.'}</p>
          </div>
        </div>
        
        {/* Additional Details Section */}
        <div className="bg-gray-50 px-6 md:px-8 py-6 border-t border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Additional Details</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <p className="text-sm text-gray-500 mb-1">Date of Birth</p>
              <p className="text-gray-800 font-medium">{formatDate(member.dateOfBirth)}</p>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <p className="text-sm text-gray-500 mb-1">Address</p>
              <p className="text-gray-800 font-medium">
                {member.address.placeName}, {member.address.municipality}, {member.address.country}
              </p>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <p className="text-sm text-gray-500 mb-1">Serving Since</p>
              <p className="text-gray-800 font-medium">{formatDate(member.appointmentDate)}</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-6 text-center md:text-left">
        <Link 
          to="/ward-members"
          className="inline-flex items-center text-teal-600 hover:text-teal-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Ward Members
        </Link>
      </div>
    </div>
  );
};

export default WardMemberDetail;