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

const App = () => {
  return (
    <>
      <Toaster position="top-right" />

      <Routes>
        {/* LOGIN (KHÔNG CÓ HEADER) */}
        {/* <Route path="/login" element={<Login />} /> */}

        {/* CÁC TRANG CÓ HEADER */}
        <Route
          path="/*"
          element={
            <>            
              <Routes>
                <Route path="/" element={<ParentHome />} />
                
              </Routes>
            </>
          }
        />
      </Routes>
    </>
  );
};

export default App;