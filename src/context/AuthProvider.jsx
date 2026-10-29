
import { useState } from "react";
import { AuthContext } from "./AuthContext";

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem("token");

    if (!token) return null;

    return {
      token,
      username: localStorage.getItem("username"),
      role: localStorage.getItem("role"),
      category: localStorage.getItem("category"),
    };
  });

  const login = (data) => {
    localStorage.setItem("token", data.token);
    localStorage.setItem("username", data.username);
    localStorage.setItem("role", data.role);

    if (data.category) {
      localStorage.setItem("category", data.category);
    } else {
      localStorage.removeItem("category");
    }

    setUser({
      token: data.token,
      username: data.username,
      role: data.role,
      category: data.category || "",
    });
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("role");
    localStorage.removeItem("category");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
