import React, { createContext, useContext, useState } from "react";

// Named export for AuthContext
export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username");
    const role = localStorage.getItem("role");
    const category = localStorage.getItem("category");

    return token ? { token, username, role, category } : null;
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

export const useAuth = () => useContext(AuthContext);

// Optional default export
export default AuthContext;