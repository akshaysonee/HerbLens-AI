import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { getStoredToken, setStoredToken, clearStoredToken } from '../utils/storage.js';
import apiClient from "../services/apiClient.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => getStoredToken());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = getStoredToken();

    if (!storedToken) {
      setUser(null);
      setLoading(false);
      return;
    }

    const fetchMe = async () => {
      try {
        const res = await apiClient.get("/auth/me");
        setUser(res.data.data.user);
      } catch (err) {
        if (err.response?.status === 401) {
          logout(); // token invalid
        } else {
          console.error("Auth check failed:", err);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchMe();
  }, []);

  const login = (payload) => {
    if (payload?.token) {
      setStoredToken(payload.token);
      setToken(payload.token);
    }

    // If backend sends flat user object
    if (payload?.name || payload?.email) {
      setUser({
        _id: payload._id,
        name: payload.name,
        email: payload.email,
      });
    }

    // If backend sends nested user object
    if (payload?.user) {
      setUser(payload.user);
    }
  };

  const logout = () => {
    clearStoredToken();
    setToken(null);
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(token),
      loading,
      login,
      logout,
      setUser,
    }),
    [user, token, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuthContext must be used within AuthProvider');
  }
  return ctx;
}

