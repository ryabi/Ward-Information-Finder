import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { loginUser, registerUser, getCurrentUser, logoutUser } from '../services/authService';
import { User, LoginCredentials, RegisterData } from '../types/auth';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  loading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const userData = await getCurrentUser();
        setUser(userData);
      } catch (err) {
        console.error('Failed to fetch user:', err);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    setLoading(true);
    setError(null);
    try {
      const userData = await loginUser(credentials);
      setUser(userData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to login');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: RegisterData) => {
    setLoading(true);
    setError(null);
    try {
      const userData = await registerUser(data);
      setUser(userData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to register');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await logoutUser();
      setUser(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to logout');
    } finally {
      setLoading(false);
    }
  };

  const isAuthenticated = !!user;
  const isAdmin = user?.isAdmin || false;

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isAdmin,
        loading,
        login,
        register,
        logout,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};