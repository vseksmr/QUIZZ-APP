import { useContext } from "react";
import { Navigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  
  if (loading) {
    console.log(" ProtectedRoute: aștept user...");
    return null;
  }


  if (!user) {
    console.log(" ProtectedRoute: user null → redirect");
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;
