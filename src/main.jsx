import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import "luckysheet/dist/plugins/css/pluginsCss.css";
import "luckysheet/dist/plugins/plugins.css";
import "luckysheet/dist/css/luckysheet.css";
import "luckysheet/dist/assets/iconfont/iconfont.css";

createRoot(document.getElementById("root")).render(
 
    <BrowserRouter>
      <App />
    </BrowserRouter>
  
);