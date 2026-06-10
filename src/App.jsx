import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
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
import TimeSheet from "./pages/Employee/TimeSheet";
import TimeKeeping from "./pages/Employee/TimeKeeping";
import PaySheet from "./pages/Employee/Paysheet";
import Suppliers from "./pages/Suppliers/Suppliers";
import ReportEmployee from "./pages/reports/ReportEmployee";
import StockInCreate from "./pages/StockInCreate";
import PaymentVoucher from "./pages/PaymentVoucher";
import { authApi } from "./api";

const PrivateRoute = ({ children }) => {
  if (!authApi.isAuthenticated()) {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userId");
    localStorage.removeItem("role");
    localStorage.removeItem("isLogin");
    return <Navigate to="/login" replace />;
  }
  return children;
};

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
            <PrivateRoute>
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
                  <Route path="/time-sheet" element={<TimeSheet />} />
                  <Route path="/time-keeping" element={<TimeKeeping />} />
                  <Route path="/pay-sheet" element={<PaySheet />} />
                  <Route path="/suppliers" element={<Suppliers />} />
                  <Route path="/report-employee" element={<ReportEmployee />} />
                  <Route path="/stock-in/create" element={<StockInCreate />} />
                  <Route path="/payment-voucher" element={<PaymentVoucher />} />
                </Routes>
              </>
            </PrivateRoute>
          }
        />
      </Routes>
    </>
  );
};

export default App;