import React from "react";
import { Navigate } from "react-router-dom";

export default function KitchenRoute({ children }) {

  const kitchenToken =
    localStorage.getItem("kitchenToken");

  if (!kitchenToken) {
    return <Navigate to="/kitchen/login" replace />;
  }

  return children;
}