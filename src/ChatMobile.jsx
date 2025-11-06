import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./ChatMobile.css";

export default function ChatMobile() {
  const location = useLocation();
  const navigate = useNavigate();
  const initialQuestion = location.state?.initialQuestion || "";

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const initialQuestionSent = useRef(false);

  // Helper
  const addMessage = (from, text) => {
    setMessages((prev) => [...prev, { from, text }]);
  };

  // === Bilingual Response Engine ===
  const getAnswer = (rawQ) => {
    const q = (rawQ || "").toLowerCase().trim();
    const tokens = new Set(q.split(/[^a-z0-9]+/).filter(Boolean));
    const has = (w) => tokens.has(w);

    const enHints = [
      "what","who","where","when","why","how","admission","fee","fees",
      "scholarship","hostel","contact","address","requirement","requirements",
      "recognition","duration","courses","hall","assembly","management",
      "director","rules","vehicle","parking","routine","phone","email",
      "website","social"
    ];
    const msHints = [
      "apa","siapa","mana","bila","kenapa","bagaimana","kemasukan","yuran",
      "biasiswa","asrama","hubungi","alamat","syarat","iktiraf","tempoh",
      "kursus","dewan","perhimpunan","pengurusan","pengarah","peraturan",
      "kenderaan","jadual","telefon","emel","laman","sosial"
    ];

    const enScore = enHints.reduce((s, w) => s + (has(w) ? 1 : 0), 0);
    const msScore = msHints.reduce((s, w) => s + (has(w) ? 1 : 0), 0);
    const lang = enScore > 0 && msScore === 0 ? "en" : "ms";
    const R = (ms, en) => (lang === "en" ? en : ms);

    if (has("kemasukan") || has("admission"))
      return R(
        "Untuk kemasukan, sila layari laman rasmi KVB untuk borang dan tarikh kemasukan.",
        "For admission details, please visit the official KVB website for forms and intake dates."
      );

    if (has("yuran") || has("fee") || has("fees"))
      return R(
        "Yuran bergantung pada kursus dan tempoh pengajian. Sila rujuk pejabat kewangan KVB.",
        "Fees depend on the course and study duration. Please refer to KVB's finance office."
      );

    if (has("biasiswa") || has("scholarship"))
      return R(
        "KVB menawarkan biasiswa tertentu kepada pelajar cemerlang. Semak laman rasmi untuk butiran.",
        "KVB offers scholarships to excellent students. Please check the official website for details."
      );

    if (has("asrama") || has("hostel"))
      return R(
        "Asrama KVB dilengkapi dengan kemudahan asas yang selesa untuk pelajar lelaki dan perempuan.",
        "KVB hostels provide comfortable basic facilities for both male and female students."
      );

    if (has("syarat") || has("requirement") || has("requirements"))
      return R(
        "Syarat kemasukan berbeza mengikut kursus. Minimum SPM dengan kredit dalam subjek berkaitan diperlukan.",
        "Entry requirements vary by course. Minimum SPM with credits in relevant subjects is required."
      );

    if (has("iktiraf") || has("recognition"))
      return R(
        "KVB diiktiraf oleh Jabatan Pembangunan Kemahiran (JPK) dan Kementerian Sumber Manusia.",
        "KVB is recognized by the Department of Skills Development (DSD) and the Ministry of Human Resources."
      );

    if (has("kursus") || has("course") || has("courses"))
      return R(
        "KVB menawarkan pelbagai kursus TVET termasuk teknologi maklumat, kejuruteraan dan perniagaan.",
        "KVB offers various TVET courses including information technology, engineering, and business."
      );

    if (has("pengarah") || has("director"))
      return R(
        "Pengarah KVB mengetuai pengurusan kolej dan memastikan kualiti pendidikan TVET terjamin.",
        "The Director of KVB leads the college management and ensures quality TVET education."
      );

    if (has("hubungi") || has("contact"))
      return R(
        "Anda boleh hubungi KVB melalui telefon, emel, atau laman web rasmi untuk maklumat lanjut.",
        "You can contact KVB via phone, email, or the official website for more information."
      );

    if (has("dewan") || has("hall"))
      return R(
        "Dewan KVB digunakan untuk perhimpunan, program rasmi, dan aktiviti pelajar.",
        "The KVB hall is used for assemblies, official programs, and student activities."
      );

// *** FIX APPLIED HERE: Replaced \n with <br/> and ensures all keywords are lowercase ***
if (has("program") || has("programme")) {
 return R(
        "Di Kolej Vokasional Betong, terdapat 8 program yang menarik iaitu program:<br/>" +
        "* Teknologi Kimpalan<br/>" +
        "* Teknologi Elektrik<br/>" +
        "* Teknologi Sistem Komputer Dan Rangkaian<br/>" +
        "* Perakaunan<br/>" +
        "* Teknologi Pemesinan Industri<br/>" +
        "* Teknologi Pembinaan<br/>" +
        "* Hospitaliti Seni Kulinari<br/>" +
        "* Teknologi Automotif", 

        "In Betong Vocational College, there are 8 exciting programs, which are:<br/>" +
        "* Welding Technology<br/>" +
        "* Electrical Technology<br/>" +
        "* Computer System and Network Technology<br/>" +
        "* Accounting<br/>" +
        "* Industrial Machining Technology<br/>" +
        "* Construction Technology<br/>" +
        "* Hospitality Culinary Arts<br/>" +
        "* Automotive Technology"
);
}
    
    if (has("tempoh") || has("duration"))
      return R(
        "Tempoh pengajian biasanya antara 2 hingga 3 tahun bergantung pada program.",
        "The study duration is usually between 2 to 3 years depending on the program."
      );

    return R(
      "Sistem ini menyokong soalan berkaitan KVB dan TVET. Cuba: 'apa itu KVB', 'syarat masuk DVM', atau 'dewan KVB'.",
      "This system answers KVB and TVET related questions. Try: 'what is KVB', 'DVM requirements', or 'KVB halls'."
    );

    
  };

  const simulateBotReply = (question) => {
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      addMessage("ai", getAnswer(question));
    }, 800);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (initialQuestion && !initialQuestionSent.current) {
      initialQuestionSent.current = true;
      addMessage("user", initialQuestion);
      simulateBotReply(initialQuestion);
    }
  }, [initialQuestion]);

  const handleSend = () => {
    if (!input.trim()) return;
    addMessage("user", input);
    simulateBotReply(input);
    setInput("");
  };

  // === UI ===
  return (
    <div className="chat-container-mobile">
      {/* Background video */}
      <video autoPlay loop muted playsInline className="chat-bg-mobile">
        <source src="/VideoMobileFinale.mp4" type="video/mp4" />
      </video>

      {/* Overlay */}
      <div className="chat-overlay-mobile"></div>

      {/* Header with logo and flipping text */}
      <div className="chat-header-mobile">
        <img
          src="/Logo Loya TVET.png"
          alt="Loya TVET Logo"
          className="tvet-logo-mobile"
          onClick={() => navigate("/")} // 🧭 navigate back to HomeSite.jsx
        />
        <div className="flipping-text-mobile">
          <span className="flip">Anda tanya, LOYA TVET jawab</span>
          <span className="flip">Segala kekeliruan, pasti terjawab.</span>
          <span className="flip">AI teknologi masa depan</span>
        </div>
      </div>

      {/* Chat body */}
      <div className="chat-body-mobile">
        {messages.map((msg, i) => (
          <div 
  key={i} 
  className={`chat-bubble-mobile ${msg.from}`}
  dangerouslySetInnerHTML={{ __html: msg.text }} // <-- NEW: Renders HTML tags like <br/>
/>
        ))}
        {typing && (
          <div className="typing-indicator-mobile">
            <span></span><span></span><span></span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="chat-input-area-mobile">
        <input
          className="chat-input-mobile"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Nyatakan soalan anda disini !"
        />
        <button className="chat-send-mobile" onClick={handleSend}>
          ➤
        </button>
      </div>
    </div>
  );
}
