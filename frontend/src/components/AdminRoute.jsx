import { useContext } from "react";
import { Navigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";

const AdminRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  console.log("👮 AdminRoute loading:", loading);
  console.log("👮 AdminRoute user:", user);

  if (loading) return null;

  if (!user) return <Navigate to="/login" replace />;

  if (!user.isAdmin) {
    alert("Not authorized");
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default AdminRoute;
