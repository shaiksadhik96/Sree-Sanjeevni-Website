import { createContext, useContext, useMemo, useState, useEffect } from "react";
import { STORAGE_KEYS, storage } from "../utils/storage.js";

const AuthContext = createContext(null);

const API_URL = "http://localhost:5000/api/auth";

const getStoredUser = () => storage.get(STORAGE_KEYS.auth, null);
const getStoredToken = () => storage.get("auth_token", null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize auth from storage on mount
  useEffect(() => {
    const storedUser = getStoredUser();
    const storedToken = getStoredToken();
    
    if (storedUser && storedToken) {
      setUser(storedUser);
      setToken(storedToken);
    }
    setIsInitialized(true);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (!response.ok) {
        return { ok: false, message: data.message || "Login failed" };
      }

      setUser(data.user);
      setToken(data.token);
      storage.set(STORAGE_KEYS.auth, data.user);
      storage.set("auth_token", data.token);

      return { ok: true, role: data.user.role };
    } catch (err) {
      return { ok: false, message: "Connection error" };
    }
  };

  const signup = async (name, email, password) => {
    try {
      const response = await fetch(`${API_URL}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();
      if (!response.ok) {
        return { ok: false, message: data.message || "Signup failed" };
      }

      return { ok: true };
    } catch (err) {
      return { ok: false, message: "Connection error" };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    storage.remove(STORAGE_KEYS.auth);
    storage.remove("auth_token");
  };

  const value = useMemo(
    () => ({
      user,
      token,
      login,
      signup,
      logout,
      isInitialized,
    }),
    [user, token, isInitialized],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
};
