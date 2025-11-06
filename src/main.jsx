import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomeSite from "./HomeSite.jsx";
import ChatMobile from "./ChatMobile.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomeSite />} />
        <Route path="/chat-mobile" element={<ChatMobile />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
