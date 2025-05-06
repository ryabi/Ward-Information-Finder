import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, Building, MapPin, PlusCircle } from 'lucide-react';
import { getWardMembers, getMunicipalityMembers, getWards } from '../../services/memberService';

const AdminDashboard: React.FC = () => {
  const [counts, setCounts] = useState({
    wardMembers: 0,
    municipalityMembers: 0,
    wardOffices: 0,
  });
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const [wardMembers, municipalityMembers, wards] = await Promise.all([
          getWardMembers(),
          getMunicipalityMembers(),
          getWards(),
        ]);
        
        setCounts({
          wardMembers: wardMembers.length,
          municipalityMembers: municipalityMembers.length,
          wardOffices: wards.length,
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCounts();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {/* Ward Members Stats */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Ward Members</p>
                <p className="text-3xl font-bold text-teal-600 mt-2">{counts.wardMembers}</p>
              </div>
              <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center">
                <Users className="h-6 w-6 text-teal-600" />
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-6 py-3">
            <Link 
              to="/admin/ward-members"
              className="text-sm font-medium text-teal-600 hover:text-teal-700 transition-colors"
            >
              Manage Ward Members →
            </Link>
          </div>
        </div>
        
        {/* Municipality Members Stats */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Municipality Members</p>
                <p className="text-3xl font-bold text-teal-600 mt-2">{counts.municipalityMembers}</p>
              </div>
              <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center">
                <Building className="h-6 w-6 text-teal-600" />
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-6 py-3">
            <Link 
              to="/admin/municipality-members"
              className="text-sm font-medium text-teal-600 hover:text-teal-700 transition-colors"
            >
              Manage Municipality Members →
            </Link>
          </div>
        </div>
        
        {/* Ward Offices Stats */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Ward Offices</p>
                <p className="text-3xl font-bold text-teal-600 mt-2">{counts.wardOffices}</p>
              </div>
              <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center">
                <MapPin className="h-6 w-6 text-teal-600" />
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-6 py-3">
            <span className="text-sm font-medium text-gray-400">Management Coming Soon</span>
          </div>
        </div>
      </div>
      
      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-800">Quick Actions</h2>
        </div>
        
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link 
            to="/admin/ward-members"
            className="flex items-center p-4 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors"
          >
            <PlusCircle className="h-5 w-5 text-teal-600 mr-3" />
            <span className="font-medium text-gray-700">Add New Ward Member</span>
          </Link>
          
          <Link 
            to="/admin/municipality-members"
            className="flex items-center p-4 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors"
          >
            <PlusCircle className="h-5 w-5 text-teal-600 mr-3" />
            <span className="font-medium text-gray-700">Add New Municipality Member</span>
          </Link>
        </div>
      </div>
      
      {/* Recent Activity (placeholder) */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-800">Recent Activity</h2>
        </div>
        
        <div className="p-6">
          <p className="text-gray-500 text-center py-8">
            Activity tracking will be implemented in a future update.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;