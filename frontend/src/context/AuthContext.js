import { createContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("✅ AuthContext mounted");
  
    const token = localStorage.getItem("token");
  
    if (!token) {
      setLoading(false);
      return;
    }
  
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const role = payload.role?.replace("ROLE_", "").toUpperCase();
  
      const userData = {
        email: payload.sub,
        role,
        isAdmin: role === "ADMIN",
      };
  
      setUser(userData);
      console.log("✅ User set in context:", userData);
    } catch (err) {
      console.error("❌ Invalid token", err);
      localStorage.removeItem("token");
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
