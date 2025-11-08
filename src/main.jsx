import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomeSite from "./HomeSite.jsx";
import ChatMobile from "./ChatMobile.jsx";
import TeamMobile from "./TeamMobile.jsx";
import ContactMobile from "./ContactMobile.jsx"; // ✅ Added this line
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomeSite />} />
        <Route path="/chat-mobile" element={<ChatMobile />} />
        <Route path="/team-mobile" element={<TeamMobile />} />
        <Route path="/contact-mobile" element={<ContactMobile />} /> {/* ✅ Added this route */}
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
