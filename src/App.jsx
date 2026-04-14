import React from "react";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

// import Header from "./components/layout/Header";
// import Home from "./pages/Admin/Home";
// import Login from "./pages/Admin/Login";
// import Products from "./pages/Admin/Products";
// import PriceBook from "./pages/Admin/PriceBook";
// import StockTakes from "./pages/Admin/StockTakes";

import ParentHome from "./pages/Parent/ParentHome";
import ParentLayout from "./components/Parent/ParentLayout";

const App = () => {
  return (
    <>
      <Toaster position="top-right" />

      <Routes>

        {/* Layout cha */}
        <Route path="/" element={<ParentLayout />}>

          {/* Trang con */}
          <Route index element={<ParentHome />} />
          <Route path="history" element={<div>Lịch sử</div>} />
          <Route path="stats" element={<div>Thống kê</div>} />

        </Route>

      </Routes>
    </>
  );
};

export default App;