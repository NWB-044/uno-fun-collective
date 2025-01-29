import { useState, useEffect } from 'react';

interface LocalUser {
  id: string;
  name: string;
  deviceId: string;
}

export const useLocalUser = () => {
  const [user, setUser] = useState<LocalUser | null>(null);

  useEffect(() => {
    // Try to get existing user from localStorage
    const storedUser = localStorage.getItem('uno_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      return;
    }

    // If no user exists, check for device ID
    let deviceId = localStorage.getItem('uno_device_id');
    if (!deviceId) {
      // Generate a unique device ID if none exists
      deviceId = `device_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('uno_device_id', deviceId);
    }
  }, []);

  const login = (name: string) => {
    const deviceId = localStorage.getItem('uno_device_id') || 
      `device_${Math.random().toString(36).substr(2, 9)}`;
    
    const newUser: LocalUser = {
      id: `user_${Math.random().toString(36).substr(2, 9)}`,
      name,
      deviceId
    };

    localStorage.setItem('uno_user', JSON.stringify(newUser));
    localStorage.setItem('uno_device_id', deviceId);
    setUser(newUser);
  };

  const logout = () => {
    localStorage.removeItem('uno_user');
    setUser(null);
  };

  return { user, login, logout };
};