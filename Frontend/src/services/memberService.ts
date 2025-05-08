import { apiClient } from './apiClient';
import { WardMember, MunicipalityMember, Ward } from '../types/member';

interface SearchParams {
  province?: string | null;
  district?: string | null;
  municipality?: string | null;
  ward_no?: string | null;
}

interface WardMembersResponse {
  candidates: WardMember[];
  districts: Array<{id: number; name: string}>;
  municipalities: Array<{id: number; name: string; type: string}>;
  wards: Array<{id: number; ward_no: number}>;
}

// Ward Members
export const getWardMembers = async (params?: SearchParams): Promise<WardMembersResponse> => {
  try {
    const queryString = params 
      ? `?${new URLSearchParams(params as Record<string, string>).toString()}`
      : '';
    const response = await apiClient.get(`/candidate/${queryString}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching ward members:', error);
    throw error;
  }
};

export const getWardMemberById = async (id: number): Promise<WardMember> => {
  try {
    const response = await apiClient.get(`/ward-members/${id}/`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching ward member with id ${id}:`, error);
    throw error;
  }
};

export const createWardMember = async (memberData: Omit<WardMember, 'id'>): Promise<WardMember> => {
  try {
    const response = await apiClient.post('/ward-members/', memberData);
    return response.data;
  } catch (error) {
    console.error('Error creating ward member:', error);
    throw error;
  }
};

export const updateWardMember = async (id: number, memberData: Partial<WardMember>): Promise<WardMember> => {
  try {
    const response = await apiClient.put(`/ward-members/${id}/`, memberData);
    return response.data;
  } catch (error) {
    console.error(`Error updating ward member with id ${id}:`, error);
    throw error;
  }
};

export const deleteWardMember = async (id: number): Promise<void> => {
  try {
    await apiClient.delete(`/ward-members/${id}/`);
  } catch (error) {
    console.error(`Error deleting ward member with id ${id}:`, error);
    throw error;
  }
};

// Municipality Members
export const getMunicipalityMembers = async (): Promise<MunicipalityMember[]> => {
  try {
    const response = await apiClient.get('/municipality-members/');
    return response.data;
  } catch (error) {
    console.error('Error fetching municipality members:', error);
    throw error;
  }
};

export const getMunicipalityMemberById = async (id: number): Promise<MunicipalityMember> => {
  try {
    const response = await apiClient.get(`/municipality-members/${id}/`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching municipality member with id ${id}:`, error);
    throw error;
  }
};

export const createMunicipalityMember = async (memberData: Omit<MunicipalityMember, 'id'>): Promise<MunicipalityMember> => {
  try {
    const response = await apiClient.post('/municipality-members/', memberData);
    return response.data;
  } catch (error) {
    console.error('Error creating municipality member:', error);
    throw error;
  }
};

export const updateMunicipalityMember = async (id: number, memberData: Partial<MunicipalityMember>): Promise<MunicipalityMember> => {
  try {
    const response = await apiClient.put(`/municipality-members/${id}/`, memberData);
    return response.data;
  } catch (error) {
    console.error(`Error updating municipality member with id ${id}:`, error);
    throw error;
  }
};

export const deleteMunicipalityMember = async (id: number): Promise<void> => {
  try {
    await apiClient.delete(`/municipality-members/${id}/`);
  } catch (error) {
    console.error(`Error deleting municipality member with id ${id}:`, error);
    throw error;
  }
};

// Ward Offices
export const getWards = async (): Promise<Ward[]> => {
  try {
    const response = await apiClient.get('/wards/');
    return response.data;
  } catch (error) {
    console.error('Error fetching wards:', error);
    throw error;
  }
};

export const getWardById = async (id: number): Promise<Ward> => {
  try {
    const response = await apiClient.get(`/wards/${id}/`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching ward with id ${id}:`, error);
    throw error;
  }
};

export const searchWards = async (query: string): Promise<Ward[]> => {
  try {
    const response = await apiClient.get(`/wards/search/?query=${query}`);
    return response.data;
  } catch (error) {
    console.error(`Error searching wards with query "${query}":`, error);
    throw error;
  }
};