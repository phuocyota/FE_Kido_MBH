import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import ProductTrace from "./pages/QR/ProductTrace";
import "./product-trace.css";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <ProductTrace />
  </BrowserRouter>,
);
