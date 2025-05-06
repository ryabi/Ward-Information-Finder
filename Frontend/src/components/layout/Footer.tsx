import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Mail, Phone } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Ward Information Finder</h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              A comprehensive platform for finding information about ward members,
              municipality officials, and ward office locations throughout the region.
            </p>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-gray-300">
              <li>
                <Link to="/" className="hover:text-teal-300 transition-colors duration-200">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/ward-members" className="hover:text-teal-300 transition-colors duration-200">
                  Ward Members
                </Link>
              </li>
              <li>
                <Link to="/location-finder" className="hover:text-teal-300 transition-colors duration-200">
                  Location Finder
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-teal-300 transition-colors duration-200">
                  Login
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-teal-300 transition-colors duration-200">
                  Register
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-center">
                <Mail size={16} className="mr-2 text-teal-400" />
                <span>info@wardfinder.com</span>
              </li>
              <li className="flex items-center">
                <Phone size={16} className="mr-2 text-teal-400" />
                <span>+977 1234567890</span>
              </li>
              <li className="flex items-center">
                <Github size={16} className="mr-2 text-teal-400" />
                <a 
                  href="https://github.com/wardinformationfinder" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-teal-300 transition-colors duration-200"
                >
                  @wardinformationfinder
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400 text-sm">
          <p>&copy; {new Date().getFullYear()} Ward Information Finder. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;