import React from "react";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Home from "./pages/Student/Order";
import Login from "./pages/Admin/Login";
import Welcome from "./pages/Student/Welcome";
import Kitchen from "./pages/Staff/Kitchen";
import RegisterFace from "./components/FaceId/RegisterFace";

import KitchenRoute from "./routes/KitchenRoute";
import StudentRoute from "./routes/StudentRoute";

const App = () => {

  return (
    <>
      <Toaster position="top-right" />

      <Routes>

        {/* STUDENT */}
        <Route path={"/"} element={<Welcome />} />

        <Route
          path={"/order"}
          element={
            <StudentRoute>
              <Home />
            </StudentRoute>
          }
        />

        <Route
          path={"/register"}
          element={<RegisterFace />}
        />

        {/* CASHIER LOGIN */}
        <Route
          path={"/cashier/login"}
          element={<Login />}
        />

        {/* KITCHEN */}
        <Route
          path={"/kitchen"}
          element={
            <KitchenRoute>
              <Kitchen />
            </KitchenRoute>
          }
        />

      </Routes>
    </>
  );
};

export default App;
