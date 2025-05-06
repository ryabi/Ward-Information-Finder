import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, User, MapPin, Users, LogOut, ChevronDown } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <header className="bg-gradient-to-r from-teal-600 to-teal-700 text-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="text-xl font-bold tracking-tight">
            Ward Information Finder
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link 
              to="/ward-members" 
              className="hover:text-teal-200 transition-colors duration-200"
            >
              Ward Members
            </Link>
            <Link 
              to="/location-finder" 
              className="hover:text-teal-200 transition-colors duration-200"
            >
              Location Finder
            </Link>
            
            {isAdmin && (
              <div className="relative group">
                <button className="flex items-center hover:text-teal-200 transition-colors duration-200">
                  Admin
                  <ChevronDown size={16} className="ml-1" />
                </button>
                <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 hidden group-hover:block">
                  <Link 
                    to="/admin" 
                    className="block px-4 py-2 text-gray-800 hover:bg-teal-50"
                  >
                    Dashboard
                  </Link>
                  <Link 
                    to="/admin/ward-members" 
                    className="block px-4 py-2 text-gray-800 hover:bg-teal-50"
                  >
                    Manage Ward Members
                  </Link>
                  <Link 
                    to="/admin/municipality-members" 
                    className="block px-4 py-2 text-gray-800 hover:bg-teal-50"
                  >
                    Manage Municipality Members
                  </Link>
                </div>
              </div>
            )}
            
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <span className="text-teal-100">
                  {user?.firstName} {user?.lastName}
                </span>
                <button 
                  onClick={handleLogout}
                  className="flex items-center px-4 py-2 bg-teal-700 hover:bg-teal-800 rounded-md transition-colors duration-200"
                >
                  <LogOut size={16} className="mr-2" />
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link 
                  to="/login" 
                  className="px-4 py-2 rounded-md border border-teal-200 hover:bg-teal-700 transition-colors duration-200"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="px-4 py-2 bg-teal-500 hover:bg-teal-600 rounded-md transition-colors duration-200"
                >
                  Register
                </Link>
              </div>
            )}
          </nav>

          {/* Mobile menu button */}
          <button 
            className="md:hidden text-white" 
            onClick={toggleMenu}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
        
        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-teal-500">
            <div className="flex flex-col space-y-3">
              <Link 
                to="/ward-members" 
                className="flex items-center py-2 hover:bg-teal-700 px-2 rounded"
                onClick={() => setIsMenuOpen(false)}
              >
                <Users size={18} className="mr-2" />
                Ward Members
              </Link>
              
              <Link 
                to="/location-finder" 
                className="flex items-center py-2 hover:bg-teal-700 px-2 rounded"
                onClick={() => setIsMenuOpen(false)}
              >
                <MapPin size={18} className="mr-2" />
                Location Finder
              </Link>
              
              {isAdmin && (
                <>
                  <Link 
                    to="/admin" 
                    className="flex items-center py-2 hover:bg-teal-700 px-2 rounded"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Admin Dashboard
                  </Link>
                  <Link 
                    to="/admin/ward-members" 
                    className="flex items-center py-2 hover:bg-teal-700 px-2 rounded pl-6"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Manage Ward Members
                  </Link>
                  <Link 
                    to="/admin/municipality-members" 
                    className="flex items-center py-2 hover:bg-teal-700 px-2 rounded pl-6"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Manage Municipality Members
                  </Link>
                </>
              )}
              
              {isAuthenticated ? (
                <>
                  <div className="py-2 px-2 text-teal-100 flex items-center">
                    <User size={18} className="mr-2" />
                    {user?.firstName} {user?.lastName}
                  </div>
                  <button 
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center py-2 bg-teal-700 hover:bg-teal-800 px-2 rounded transition-colors duration-200"
                  >
                    <LogOut size={18} className="mr-2" />
                    Logout
                  </button>
                </>
              ) : (
                <div className="flex flex-col space-y-2 pt-2">
                  <Link 
                    to="/login" 
                    className="py-2 text-center rounded-md border border-teal-200 hover:bg-teal-700 transition-colors duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link 
                    to="/register" 
                    className="py-2 text-center bg-teal-500 hover:bg-teal-600 rounded-md transition-colors duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;