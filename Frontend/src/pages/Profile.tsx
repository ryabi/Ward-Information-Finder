import React from 'react';
import { getCurrentUser } from '../services/authService';
import { useAuth } from '../contexts/AuthContext';
import { User, Mail, Phone, MapPin, Calendar } from 'lucide-react';

const Profile: React.FC = () => {

  const { user } = useAuth();
  
  if (!user) {
    return null;
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-teal-500 to-teal-600"></div>
        
        <div className="px-6 py-8">
          <div className="flex flex-col items-center -mt-20 mb-8">
            <div className="w-32 h-32 rounded-full bg-white p-2 shadow-lg">
              <div className="w-full h-full rounded-full bg-teal-100 flex items-center justify-center">
                <User className="w-16 h-16 text-teal-600" />
              </div>
            </div>
            <h1 className="mt-4 text-2xl font-bold text-gray-900">
              {user.first_name} {user.last_name}
            </h1>
            {user.isAdmin && (
              <span className="mt-1 px-3 py-1 bg-teal-100 text-teal-800 text-sm rounded-full">
                Administrator
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center">
                <Mail className="w-5 h-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="text-gray-900">{user.email}</p>
                </div>
              </div>

              <div className="flex items-center">
                <Phone className="w-5 h-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="text-gray-900">{user.phone_number || 'Not provided'}</p>
                </div>
              </div>

              <div className="flex items-center">
                <MapPin className="w-5 h-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Location</p>
                  <p className="text-gray-900">
                    {user.municipality},{user.ward_no || 'N/A'}
                  </p>
                </div>
              </div>

              <div className="flex items-center">
                <Calendar className="w-5 h-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Date of Birth</p>
                  <p className="text-gray-900">
                    {user.date_of_birth ? new Date(user.date_of_birth).toLocaleDateString() : 'Not provided'}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Province</h3>
                <p className="mt-1 text-gray-900">{user.province || 'Not provided'}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">District</h3>
                <p className="mt-1 text-gray-900">{user.district || 'Not provided'}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">Town</h3>
                <p className="mt-1 text-gray-900">{user.town || 'Not provided'}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">Gender</h3>
                <p className="mt-1 text-gray-900">{user.gender || 'Not provided'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;