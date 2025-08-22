// src/components/router/PageGuard.jsx
import React from "react";
import { Navigate, useLocation } from "react-router-dom";

export default function PageGuard({ children }) {
  const access = localStorage.getItem("accessToken");
  const location = useLocation();

  if (!access) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}
