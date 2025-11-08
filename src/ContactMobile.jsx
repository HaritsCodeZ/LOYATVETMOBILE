import React from "react";
import { Phone, Sparkles } from "lucide-react";
import "./ContactMobile.css";

export default function ContactMobile() {
  const handleCall = () => {
    window.location.href = "tel:+60138404179";
  };

  return (
    <div className="contact-container">
      {/* Glowy background */}
      <div className="contact-gradient-bg"></div>

      {/* Logo fixed at the top */}
      <img
        src="/Logo Loya TVET.png"
        alt="Loya TVET Logo"
        className="tvet-logo-mobile"
        onClick={() => window.location.href = "/"}
      />

      {/* Header with sparkle */}
      <div className="contact-header">
        <h1 className="contact-title">Hubungi Kami</h1>
        <p className="contact-subtitle">
          “Untuk sebarang urusan atau kerjasama, jangan segan untuk
          berhubung dengan kami. Tenaga dan idea anda mungkin permulaan sesuatu yang hebat!”
        </p>
      </div>

      {/* Contact card */}
      <div className="contact-card" onClick={handleCall}>
        <div className="contact-info">
          <h2 className="contact-name">Abg Sabirin Bin Abg Muis</h2>
          <p className="contact-role">Penyelia Projek</p>
          <div className="contact-details">
            <Phone className="contact-phone-icon" />
            <span className="contact-number">+60 13-840 4179</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="contact-footer">
        <button className="contact-button" onClick={handleCall}>
          <Phone size={18} />
          <span>Hubungi Sekarang</span>
        </button>
        <p className="footer-note">
          Sentuhan idea, warna, dan semangat — bersama kita cipta masa depan TVET!
        </p>
      </div>
    </div>
  );
}
