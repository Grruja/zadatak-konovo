import { createContext, useContext, useState, useEffect, type ReactNode, useCallback } from 'react';
import { jwtDecode } from 'jwt-decode';
import api from '../config/axios.config';

interface User {
  id: number;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error('Failed to parse user data from localStorage', error);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback((newToken: string, newUser: User) => {
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.post('/logout');
    } catch (error) {
      console.error('Server logout failed', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setToken(null);
      setUser(null);
    }
  }, []);

  useEffect(() => {
    if (!token) {
      return;
    }

    const refreshToken = async () => {
      try {
        const response = await api.post('/refresh');
        const data = response.data;
        
        if (!data) {
          logout();
          return;
        }

        const newToken = data.data.authorization.token;
        const refreshedUser = data.data.user;

        login(newToken, refreshedUser);
      } catch (error) {
        console.error('Token refresh failed:', error);
        logout();
      }
    };

    try {
      const decodedToken = jwtDecode<{ exp: number }>(token);
      const expirationTime = decodedToken.exp * 1000;
      
      const refreshTimeout = expirationTime - Date.now() - 60000; // Refresh 1 minute before expiration

      if (refreshTimeout > 0) {
        const timeoutId = setTimeout(refreshToken, refreshTimeout);
        return () => clearTimeout(timeoutId);
      } else {
        logout();
      }
    } catch (error) {
      console.error('Invalid token:', error);
      logout();
    }
  }, [token, login, logout]);

  const isAuthenticated = !!token;

  const value = {
    user,
    token,
    login,
    logout,
    isAuthenticated,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 