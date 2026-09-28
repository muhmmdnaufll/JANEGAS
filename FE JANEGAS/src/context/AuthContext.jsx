import { createContext, useContext, useState, useEffect } from "react";
import { authService } from "../services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("janegas_user");
    if (stored) { try { setUser(JSON.parse(stored)); } catch { localStorage.clear(); } }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    const res = await authService.login(username, password);
    const { access_token, role, username: uname } = res.data;
    const userData = { token: access_token, role, username: uname };
    localStorage.setItem("janegas_token", access_token);
    localStorage.setItem("janegas_user", JSON.stringify(userData));
    setUser(userData);
    return userData;
  };

  const logout = () => {
    localStorage.removeItem("janegas_token");
    localStorage.removeItem("janegas_user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);