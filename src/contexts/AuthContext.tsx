import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (
    name: string,
    email: string,
    password: string,
    employeeId: string,
    storeId: string
  ) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demo purposes
const MOCK_USERS: User[] = [
  {
    id: '1',
    name: 'John Employee',
    email: 'employee@dominos.com',
    employeeId: 'EMP001',
    role: UserRole.EMPLOYEE,
    storeId: 'store1',
  },
  {
    id: '2',
    name: 'Sarah Manager',
    email: 'manager@dominos.com',
    employeeId: 'MGR001',
    role: UserRole.MANAGER,
    storeId: 'store1',
  },
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is stored in localStorage
    const storedUser = localStorage.getItem('dominos_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Find user with matching email
      const foundUser = MOCK_USERS.find(u => u.email === email);
      
      if (!foundUser) {
        throw new Error('Invalid credentials');
      }
      
      // In a real app, you would verify password here
      // For demo, we'll accept any password for the mock users
      
      // Set the user in state and localStorage
      setUser(foundUser);
      localStorage.setItem('dominos_user', JSON.stringify(foundUser));
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('dominos_user');
  };

  const register = async (
    name: string,
    email: string,
    password: string,
    employeeId: string,
    storeId: string
  ) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if email already exists
      if (MOCK_USERS.some(u => u.email === email)) {
        throw new Error('Email already in use');
      }
      
      // For demo purposes, we'll just create a new user object
      const newUser: User = {
        id: Math.random().toString(36).substring(2, 15),
        name,
        email,
        employeeId,
        role: UserRole.EMPLOYEE, // New users default to employee role
        storeId,
      };
      
      // In a real app, this would be handled by your backend
      MOCK_USERS.push(newUser);
      
      // Log in the new user
      setUser(newUser);
      localStorage.setItem('dominos_user', JSON.stringify(newUser));
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};