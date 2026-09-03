import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { authService } from "../services";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = useCallback(async () => {
    try {
      const res = await authService.getProfile();
      setUser(res.data);
      return res.data;
    } catch (error) {
      setUser(null);
      return null;
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      await checkAuth();
      setLoading(false);
    };
    init();
  }, [checkAuth]);

  const login = useCallback(async (credentials) => {
    const res = await authService.login(credentials);
    setUser(res.data);
    return res.data;
  }, []);

  const register = useCallback(async (data) => {
    const res = await authService.register(data);
    setUser(res.data);
    return res.data;
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch (error) {
      // ignore errors - we clear local state regardless
    }
    setUser(null);
  }, []);

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    checkAuth,
    isAuthenticated: !!user,
    isJobSeeker: user?.role === "JOB_SEEKER",
    isRecruiter: user?.role === "RECRUITER",
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
