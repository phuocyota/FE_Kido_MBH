import React from "react";
import { Navigate } from "react-router-dom";

export default function StudentRoute({ children }) {

  const studentToken =
    sessionStorage.getItem(
      "studentAccessToken"
    );

  if (!studentToken) {
    return <Navigate to="/" replace />;
  }

  return children;
}