import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, AlertCircle, Search } from 'lucide-react';
import { getMunicipalityMembers, deleteMunicipalityMember } from '../../services/memberService';
import { MunicipalityMember } from '../../types/member';
import MemberForm from '../../components/common/MemberForm';

const AdminMunicipalityMembers: React.FC = () => {
  const [members, setMembers] = useState<MunicipalityMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingMember, setEditingMember] = useState<MunicipalityMember | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null);
  const navigate = useNavigate();
  
  // Filter members based on search query
  const filteredMembers = members.filter(member => {
    const searchLower = searchQuery.toLowerCase();
    return (
      member.firstName.toLowerCase().includes(searchLower) ||
      member.lastName.toLowerCase().includes(searchLower) ||
      member.position.toLowerCase().includes(searchLower) ||
      member.address.municipality.toLowerCase().includes(searchLower)
    );
  });

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const data = await getMunicipalityMembers();
      setMembers(data);
    } catch (err) {
      console.error('Failed to fetch municipality members:', err);
      setError('Failed to load municipality members. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddMember = async (memberData: any) => {
    try {
      setSubmitting(true);
      // Here you would normally make an API call to create the member
      // const newMember = await createMunicipalityMember(memberData);
      
      // Simulate API call for demo purposes
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Refresh the list of members
      await fetchMembers();
      setShowAddForm(false);
    } catch (err) {
      console.error('Failed to add municipality member:', err);
      setError('Failed to add member. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditMember = async (memberData: any) => {
    if (!editingMember) return;
    
    try {
      setSubmitting(true);
      // Here you would normally make an API call to update the member
      // await updateMunicipalityMember(editingMember.id, memberData);
      
      // Simulate API call for demo purposes
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Refresh the list of members
      await fetchMembers();
      setEditingMember(null);
    } catch (err) {
      console.error('Failed to update municipality member:', err);
      setError('Failed to update member. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteMember = async (id: number) => {
    try {
      setLoading(true);
      await deleteMunicipalityMember(id);
      
      // Update the local state
      setMembers(prev => prev.filter(member => member.id !== id));
      setShowDeleteConfirm(null);
    } catch (err) {
      console.error('Failed to delete municipality member:', err);
      setError('Failed to delete member. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (showAddForm) {
    return <MemberForm onSubmit={handleAddMember} loading={submitting} title="Add Municipality Member" />;
  }

  if (editingMember) {
    return (
      <MemberForm 
        initialData={editingMember} 
        onSubmit={handleEditMember} 
        loading={submitting}
        title="Edit Municipality Member"
      />
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Municipality Members</h1>
          <p className="text-gray-600">Manage municipality member information</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Member
        </button>
      </div>
      
      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-red-500" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
            <div className="ml-auto pl-3">
              <div className="-mx-1.5 -my-1.5">
                <button
                  onClick={() => setError(null)}
                  className="inline-flex bg-red-50 rounded-md p-1.5 text-red-500 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  <span className="sr-only">Dismiss</span>
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-xs">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search members..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-teal-500 focus:border-teal-500"
          />
        </div>
      </div>
      
      {/* Members Table */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        {loading && !showDeleteConfirm ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
          </div>
        ) : filteredMembers.length === 0 ? (
          <div className="text-center py-16">
            <h3 className="text-lg font-medium text-gray-500 mb-1">No members found</h3>
            <p className="text-gray-400 mb-4">
              {searchQuery 
                ? "No members match your search criteria" 
                : "There are no municipality members in the system yet"}
            </p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-teal-600 hover:text-teal-700"
              >
                Clear search
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Member
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Position
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Municipality
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredMembers.map((member) => (
                  <tr key={member.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full overflow-hidden bg-gray-100">
                          {member.photo ? (
                            <img 
                              src={member.photo} 
                              alt={`${member.firstName} ${member.lastName}`}
                              className="h-10 w-10 object-cover"
                            />
                          ) : (
                            <div className="h-10 w-10 flex items-center justify-center bg-teal-100 text-teal-500">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {member.firstName} {member.lastName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {member.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{member.position}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{member.address.municipality}</div>
                      <div className="text-sm text-gray-500">{member.address.country}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {member.phoneNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {showDeleteConfirm === member.id ? (
                        <div className="flex items-center justify-end space-x-2">
                          <span className="text-gray-700">Confirm delete?</span>
                          <button
                            onClick={() => handleDeleteMember(member.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Yes
                          </button>
                          <button
                            onClick={() => setShowDeleteConfirm(null)}
                            className="text-gray-600 hover:text-gray-900"
                          >
                            No
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-end space-x-3">
                          <button
                            onClick={() => setEditingMember(member)}
                            className="text-teal-600 hover:text-teal-900"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => setShowDeleteConfirm(member.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminMunicipalityMembers;