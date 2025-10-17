import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const api = "https://tentwenty-backend.onrender.com/api";

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios.get(`${api}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => {
          if (res.data.success) {
            setUser(res.data.data.user);
          }
        })
        .catch((err) => {
          console.error("Auth error:", err);
          localStorage.removeItem("token");
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    try {
      setError(null);
      const res = await axios.post(`${api}/auth/login`, { email, password });
      
      if (res.data.success) {
        localStorage.setItem("token", res.data.data.token);
        setUser(res.data.data.user);
        return { success: true };
      } else {
        throw new Error(res.data.message || "Login failed");
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "Login failed";
      setError(errorMessage);
      console.error("Login error:", err.response?.data || err);
      throw new Error(errorMessage);
    }
  };

  const register = async (data) => {
    try {
      setError(null);
      const res = await axios.post(`${api}/auth/register`, data);
      if (res.data.success) {
        localStorage.setItem("token", res.data.data.token);
        setUser(res.data.data.user);
        return { success: true };
      } else {
        throw new Error(res.data.message || "Registration failed");
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "Registration failed";
      setError(errorMessage);
      console.error("Registration error:", err.response?.data || err);
      throw new Error(errorMessage);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setError(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};