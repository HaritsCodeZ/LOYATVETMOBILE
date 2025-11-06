import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // ✅ Added for navigation
import "./HomeSite.css";

export default function HomeSite() {
  const navigate = useNavigate(); // ✅ Initialize navigate hook

  const messages = [
    "Apa yang saya boleh bantu hari ini?",
    "What can I do for you today?",
    "LOYA TVET sedia membantu!"
  ];

  const [current, setCurrent] = useState(0);
  const [input, setInput] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % messages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [messages.length]);

  const handleSend = () => {
    if (input.trim()) {
      // ✅ Navigate to ChatMobile and send the input message
      navigate("/chat-mobile", { state: { initialQuestion: input } });
      setInput(""); // clear after sending
    }
  };

  return (
    // RESTORE THE SINGLE ROOT DIV
    <div className="homesite-container">
        {/* Background Image (Static) */}
        <img className="background-video" src="FinaleBackImage.png" alt="Background Image" />

        {/* Centered Changing Text */}
        <div className="center-text">
            <h2>{messages[current]}</h2>
        </div>

        {/* Glass Bubbles Section */}
        <div className="bubble-container">
            <div className="bubble-row">
                <div className="glass-bubble">Hubungi Kami</div>
                <div className="glass-bubble">Pasukan Kami</div>
            </div>
            <div className="bubble-row single">
                <div className="glass-bubble">Kolej Kami</div>
            </div>
        </div>

        {/* Floating Input Bar */}
        <div className="ai-input-bar">
            <input
                type="text"
                className="ai-input-field"
                placeholder="Tulis mesej anda di sini..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()} // ✅ Enter triggers send
            />
            <button className="ai-send-btn" onClick={handleSend}>
                ➤
            </button>
        </div>
    </div>
)
}
