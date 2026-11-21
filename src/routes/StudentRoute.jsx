import React from "react";
import { Navigate } from "react-router-dom";
import { getAccessToken } from "../api/session";

export default function StudentRoute({ children }) {

  const studentToken =
    getAccessToken();

  if (!studentToken) {
    return <Navigate to={"/"} replace />;
  }

  return children;
}
