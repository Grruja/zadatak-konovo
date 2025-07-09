import { createContext, useContext, useState, useEffect, type ReactNode, useCallback } from 'react';
import { toast } from 'sonner';

interface AuthContextType {
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
  handleSessionExpiration: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSessionExpiration = useCallback(() => {
    localStorage.removeItem('token');
    setToken(null);
    
    toast.error("Session expired. Please log in again.", {
      duration: 5000,
    });
  }, []);

  useEffect(() => {
    try {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        setToken(storedToken);
      }
    } catch (error) {
      console.error('Failed to read token from localStorage', error);
      localStorage.removeItem('token');
    }
  }, []);

  // Listen for session expiration events from axios interceptor
  useEffect(() => {
    const handleSessionExpiredEvent = () => {
      handleSessionExpiration();
    };

    window.addEventListener('sessionExpired', handleSessionExpiredEvent);

    return () => {
      window.removeEventListener('sessionExpired', handleSessionExpiredEvent);
    };
  }, [handleSessionExpiration]);

  const login = useCallback((newToken: string) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setToken(null);
  }, []);

  const isAuthenticated = !!token;

  const value = {
    token,
    login,
    logout,
    handleSessionExpiration,
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