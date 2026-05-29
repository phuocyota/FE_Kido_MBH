import React from "react";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Header from "./components/layout/Header";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Products from "./pages/Products";
import PriceBook from "./pages/PriceBook";
import StockTakes from "./pages/StockTakes";
import Account from "./pages/Account";
import StoreInfo from "./pages/StoreInfo";
import ReportEndDay from "./pages/reports/ReportEndDay";
import ReportProduct from "./pages/reports/ReportProduct";
import ListEmployee from "./pages/Employee/ListEmployee";


const App = () => {
  return (
    <>
      <Toaster position="top-right" />

      <Routes>
        {/* LOGIN (KHÔNG CÓ HEADER) */}
        <Route path="/login" element={<Login />} />

        {/* CÁC TRANG CÓ HEADER */}
        <Route
          path="/*"
          element={
            <>
              <Header />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/products" element={<Products />} />
                <Route path="/price-book" element={<PriceBook />} />
                <Route path="/stock-takes" element={<StockTakes />} />
                <Route path="/account" element={<Account />} />
                <Route path="/store-info" element={<StoreInfo />} />
                <Route path="/report-end-day" element={<ReportEndDay />} />
                <Route path="/report-product" element={<ReportProduct />} />
                <Route path="/employees" element={<ListEmployee />} />

              </Routes>
            </>
          }
        />
      </Routes>
    </>
  );
};

export default App;