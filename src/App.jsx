import React from "react";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";


import Home from "./pages/Student/Order";
import Login from "./pages/Admin/Login";

import Welcome from "./pages/Student/Welcome";
import Kitchen from "./pages/Staff/Kitchen";
// import RegisterFace from "./components/FaceId/RegisterFace";

const App = () => {
  return (
    <>
      <Toaster position="top-right" />

      <Routes>
        {/* LOGIN (KHÔNG CÓ HEADER) */}
        <Route path="/kitchen/login" element={<Login />} />

        {/* CÁC TRANG CÓ HEADER */}
        <Route
          path="/*"
          element={
            <>
              {/* <Header /> */}
              <Routes>
                <Route path="/" element={<Welcome />} />
                {/* Face register disabled: QR-only flow */}
                {/* <Route path="/register" element={<RegisterFace />} /> */}
                <Route path="/order" element={<Home />} />

                <Route path="/kitchen" element={<Kitchen />} />
              </Routes>

            </>
          }
        />
      </Routes>
    </>
  );
};

export default App;
