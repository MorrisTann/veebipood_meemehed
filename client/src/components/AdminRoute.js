import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const AdminRoute = ({ children }) => {
  const { user } = useContext(AuthContext);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.email !== "meemehed.kinnitus@gmail.com") {
    return <Navigate to="/konto" replace />;
  }

  return children;
};

export default AdminRoute;