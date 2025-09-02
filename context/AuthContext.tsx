import React, { createContext, useState, useEffect, useContext, ReactNode, useCallback } from 'react';
// FIX: Remove unused and incorrectly typed `login` function derived from `useGoogleLogin`.
import { CredentialResponse } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import type { User } from '../types';

interface DecodedToken {
  sub: string;
  email: string;
  name: string;
  picture: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  logout: () => void;
  handleGoogleSuccess: (credentialResponse: CredentialResponse) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('maddock-user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
      localStorage.removeItem('maddock-user');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleGoogleSuccess = useCallback((credentialResponse: CredentialResponse) => {
    if (credentialResponse.credential) {
      // VITE_ADMIN_EMAILS should be a comma-separated string in your .env.local file
      const adminEmails = (import.meta.env.VITE_ADMIN_EMAILS || '').split(',');
      const decoded: DecodedToken = jwtDecode(credentialResponse.credential);
      const { sub, email, name, picture } = decoded;

      const role = adminEmails.includes(email) ? 'admin' : 'client';

      const newUser: User = {
        id: sub,
        email,
        name,
        avatarUrl: picture,
        role,
      };

      localStorage.setItem('maddock-user', JSON.stringify(newUser));
      setUser(newUser);
    }
  }, []);

  const logout = () => {
    localStorage.removeItem('maddock-user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout, handleGoogleSuccess }}>
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