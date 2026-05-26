import React from "react";
import { Navigate } from "react-router-dom";
import { clearAuthSession, getAccessToken, isKitchenToken } from "../api/session";

export default function KitchenRoute({ children }) {

  const token = getAccessToken();

  if (!token || !isKitchenToken(token)) {
    clearAuthSession();
    return <Navigate to={"/cashier/login"} replace />;
  }

  return children;
}
