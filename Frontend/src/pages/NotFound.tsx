import React from 'react';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-6xl font-bold text-teal-600">404</h1>
      <h2 className="text-2xl font-semibold text-gray-700 mt-4 mb-6">Page Not Found</h2>
      <p className="text-gray-500 max-w-md mb-8">
        Sorry, the page you are looking for doesn't exist or has been moved.
      </p>
      <Link
        to="/"
        className="inline-flex items-center px-5 py-3 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors"
      >
        <Home className="w-5 h-5 mr-2" />
        Return Home
      </Link>
    </div>
  );
};

export default NotFound;