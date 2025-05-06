import { LoginCredentials, RegisterData, User } from '../types/auth';
import { apiClient } from './apiClient';

// Login user
export const loginUser = async (credentials: LoginCredentials): Promise<User> => {
  try {
    const response = await apiClient.post('/auth/login/', credentials);
    const { token, user } = response.data;
    
    // Store the token in localStorage
    localStorage.setItem('token', token);
    
    return user;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('An error occurred during login');
  }
};

// Register user
export const registerUser = async (data: RegisterData): Promise<User> => {
  try {
    const response = await apiClient.post('/auth/register/', data);
    const { token, user } = response.data;
    
    // Store the token in localStorage
    localStorage.setItem('token', token);
    
    return user;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('An error occurred during registration');
  }
};

// Get current user
export const getCurrentUser = async (): Promise<User> => {
  try {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('No authentication token found');
    }
    
    const response = await apiClient.get('/auth/user/');
    return response.data;
  } catch (error) {
    localStorage.removeItem('token');
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('Failed to get current user');
  }
};

// Logout user
export const logoutUser = async (): Promise<void> => {
  try {
    await apiClient.post('/auth/logout/');
    localStorage.removeItem('token');
  } catch (error) {
    localStorage.removeItem('token');
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('An error occurred during logout');
  }
};