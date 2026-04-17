
import React from "react";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import ParentHome from "./pages/Parent/ParentHome";
import Dashboard from "./pages/Parent/Dashboard";
import History from "./pages/Parent/History";
import Stats from "./pages/Parent/Stats";
import Topup from "./pages/Parent/Topup";

const App = () => {
  return (
    <>
      <Toaster position="top-right" />

      <Routes> {/* 👈 BẮT BUỘC */}

        <Route path="/" element={<ParentHome />}>
          <Route index element={<Dashboard />} />
          <Route path="history" element={<History />} />
          <Route path="stats" element={<Stats />} />
          <Route path="topup" element={<Topup />} />
        </Route>

      </Routes>
    </>
  );
};


export default App;