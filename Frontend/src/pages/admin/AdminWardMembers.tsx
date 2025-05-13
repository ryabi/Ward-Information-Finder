import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, AlertCircle, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getWardMembers, deleteWardMember, createWardMember } from '../../services/memberService';
import { WardMember } from '../../types/member';
import MemberForm from '../../components/common/MemberForm';

const AdminWardMembers: React.FC = () => {
  const navigate = useNavigate();
  const [wardMembers, setWardMembers] = useState<WardMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingMember, setEditingMember] = useState<WardMember | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null);
  
  // Filter members based on search query
  const filteredMembers = wardMembers?.filter(member => {
    const searchLower = searchQuery.toLowerCase();
    return (
      member.name.toLowerCase().includes(searchLower) ||
      member.post.toLowerCase().includes(searchLower) ||
      member.email.toLowerCase().includes(searchLower)
    );
  }) || [];

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const response = await getWardMembers();
      setWardMembers(response.candidates);
    } catch (err) {
      console.error('Failed to fetch ward members:', err);
      setError('Failed to load ward members. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddMember = async (memberData: any) => {
    try {
      setSubmitting(true);
      // Make the actual API call to create the member
      await createWardMember(memberData);
      
      // Navigate to admin dashboard after successful creation
      navigate('/admin');
    } catch (err) {
      console.error('Failed to add ward member:', err);
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
      // await updateWardMember(editingMember.id, memberData);
      
      // Simulate API call for demo purposes
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Refresh the list of members
      await fetchMembers();
      setEditingMember(null);
    } catch (err) {
      console.error('Failed to update ward member:', err);
      setError('Failed to update member. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteMember = async (id: number) => {
    try {
      setLoading(true);
      await deleteWardMember(id);
      
      // Update the local state
      setWardMembers(prev => prev.filter(member => member.id !== id));
      setShowDeleteConfirm(null);
    } catch (err) {
      console.error('Failed to delete ward member:', err);
      setError('Failed to delete member. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (showAddForm) {
    return <MemberForm onSubmit={handleAddMember} loading={submitting} title="Add Ward Member" />;
  }

  if (editingMember) {
    return (
      <MemberForm 
        initialData={editingMember} 
        onSubmit={handleEditMember} 
        loading={submitting}
        title="Edit Ward Member"
      />
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Ward Members</h1>
          <p className="text-gray-600">Manage ward member information</p>
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
                : "There are no ward members in the system yet"}
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
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Position
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Gender
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Municipality
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ward
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
                      <div className="text-sm font-medium text-gray-900">{member.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{member.post}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{member.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{member.gender}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{member.municipality}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{member.ward}</div>
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

export default AdminWardMembers;