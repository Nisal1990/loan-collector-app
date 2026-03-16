import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { mockCollector } from '../utils/mockData';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const storedUser = await AsyncStorage.getItem('@user_token');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (e) {
      console.log('Failed to fetch token');
    } finally {
      setLoading(false);
    }
  };

  const login = async (employeeId, password) => {
    // Mock login logic
    if (employeeId && password) {
      const userData = { ...mockCollector, token: 'mock-jwt-token-7389' };
      await AsyncStorage.setItem('@user_token', JSON.stringify(userData));
      setUser(userData);
      return true;
    }
    return false;
  };

  const logout = async () => {
    await AsyncStorage.removeItem('@user_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
