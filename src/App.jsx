
import React, { Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import ProtectedRoute from "./api/ProtectedRoute";

// Lazy-loaded pages — each becomes a separate chunk
const ParentHome = React.lazy(() => import("./pages/Parent/ParentHome"));
const Dashboard = React.lazy(() => import("./pages/Parent/Dashboard"));
const History = React.lazy(() => import("./pages/Parent/History"));
const Stats = React.lazy(() => import("./pages/Parent/Stats"));
const Topup = React.lazy(() => import("./pages/Parent/Topup"));
const Login = React.lazy(() => import("./pages/Parent/Login"));
const Order = React.lazy(() => import("./pages/Parent/Order"));
const Payment = React.lazy(() => import("./pages/Parent/Payment"));
const PaymentResult = React.lazy(() => import("./pages/PaymentResult"));
const BoardingOrder = React.lazy(() => import("./pages/Parent/BoardingOrder"));
const NutritionAI = React.lazy(() => import("./pages/Parent/NutritionAI"));

const PageLoader = () => (
  <div className="flex h-screen items-center justify-center">
    <div className="flex flex-col items-center gap-3">
      <div className="h-8 w-8 animate-spin rounded-full border-3 border-blue-500 border-t-transparent" />
      <p className="text-sm text-gray-500">Đang tải...</p>
    </div>
  </div>
);

const App = () => {
  return (
    <>
      <Toaster position="top-right" />

      <Suspense fallback={<PageLoader />}>
        <Routes>

          {/* LOGIN */}
          <Route path="/login" element={<Login />} />
          
          {/* PAYMENT RESULT */}
          <Route path="/payment-result" element={<PaymentResult />} />

          {/* PRIVATE */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <ParentHome />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="history" element={<History />} />
            <Route path="stats" element={<Stats />} />
            <Route path="topup" element={<Topup />} />
            <Route path="order" element={<Order />} />
            <Route path="boarding-order" element={<BoardingOrder />} />
            <Route path="nutrition-ai" element={<NutritionAI />} />
            <Route path="order/payment" element={<Payment />} />
            
          </Route>

        </Routes>
      </Suspense>
    </>
  );
};


export default App;
