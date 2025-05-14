import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Search, Building, Landmark, User, Video } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Home: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Section */}
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome, {user?.first_name} {user?.last_name}!
          </h1>
          <p className="mt-2 text-gray-600">
            Access local government services and information all in one place.
          </p>
        </div>
        <Link
          to="/profile"
          className="flex items-center px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors"
        >
          <User className="w-4 h-4 mr-2" />
          View Profile
        </Link>
      </div>

      {/* Feature Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Find Local Government Card */}
        <Link
          to="/ward-search"
          className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300"
        >
          <div className="p-6">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <Building className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Find Your Local Government
            </h3>
            <p className="text-gray-600">
              Search and connect with your local ward members and access important services.
            </p>
          </div>
          <div className="px-6 py-3 bg-gray-50">
            <span className="text-sm font-medium text-blue-600">Search Now →</span>
          </div>
        </Link>

        {/* Ward Office Location Card */}
        <Link
          to="/location-finder"
          className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300"
        >
          <div className="p-6">
            <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-4">
              <MapPin className="h-6 w-6 text-teal-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Find Ward Office Location
            </h3>
            <p className="text-gray-600">
              Locate your nearest ward office and get directions for in-person visits.
            </p>
          </div>
          <div className="px-6 py-3 bg-gray-50">
            <span className="text-sm font-medium text-teal-600">View Map →</span>
          </div>
        </Link>

        {/* Local Culture Card */}
        <Link
          to="/local-culture"
          className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300"
        >
          <div className="p-6">
            <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mb-4">
              <Landmark className="h-6 w-6 text-amber-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Local Culture & Tourism
            </h3>
            <p className="text-gray-600">
              Discover the rich cultural heritage and natural beauty of our locality.
            </p>
          </div>
          <div className="px-6 py-3 bg-gray-50">
            <span className="text-sm font-medium text-amber-600">Explore →</span>
          </div>
        </Link>

        {/* Video Capture Card */}
        <Link
          to="/video-test"
          className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300"
        >
          <div className="p-6">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <Video className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Video Capture
            </h3>
            <p className="text-gray-600">
              Test our experimental video capture feature for AI processing.
            </p>
          </div>
          <div className="px-6 py-3 bg-gray-50">
            <span className="text-sm font-medium text-purple-600">Try Now →</span>
          </div>
        </Link>
      </div>

      {/* Quick Search Section */}
      <div className="mt-12 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Search</h2>
        <div className="max-w-xl">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search for services, locations, or information..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;