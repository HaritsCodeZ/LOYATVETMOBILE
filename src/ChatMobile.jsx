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
      "what", "who", "where", "when", "why", "how", "admission", "fee", "fees",
      "scholarship", "hostel", "contact", "address", "requirement", "requirements",
      "recognition", "duration", "courses", "hall", "assembly", "management",
      "director", "rules", "vehicle", "parking", "routine", "phone", "email",
      "website", "social"
    ];
    const msHints = [
      "apa", "siapa", "mana", "bila", "kenapa", "bagaimana", "kemasukan", "yuran",
      "biasiswa", "asrama", "hubungi", "alamat", "syarat", "iktiraf", "tempoh",
      "kursus", "dewan", "perhimpunan", "pengurusan", "pengarah", "peraturan",
      "kenderaan", "jadual", "telefon", "emel", "laman", "sosial"
    ];

    const enScore = enHints.reduce((s, w) => s + (has(w) ? 1 : 0), 0);
    const msScore = msHints.reduce((s, w) => s + (has(w) ? 1 : 0), 0);
    const lang = enScore > 0 && msScore === 0 ? "en" : "ms";
    const R = (ms, en) => (lang === "en" ? en : ms);

    // ==============================
    // === REPLY RULES START HERE ===
    // ==============================

    // UPDATE 5 - SYARAT KEMASUKAN MALAY SPECIAL HARITS
    if (has("syarat")) {
      return (
        "Untuk kemasukan SVM di KV BETONG:<br/>" +
        "- Calon perlu memperoleh sekurang-kurangnya Tahap Penguasaan 3 bagi Pentaksiran Bilik Darjah iaitu:<br/>" +
        "- Bahasa Melayu<br/>" +
        "- Bahasa Inggeris<br/>" +
        "- Matematik<br/>" +
        "- Sains<br/>" +
        "- Reka Bentuk Dan Teknologi Atau Asas Sains Komputer<br/><br/>" +
        "Untuk kemasukan DVM pula di KV BETONG:<br/>" +
        "- PNGK akademik ≥ 2.00<br/>" +
        "- Sekurang-kurangnya 3 kepujian SVM<br/>" +
        "- PNGK vokasional ≥ 2.67<br/>" +
        "- Untuk program Teknologi Maklumat, Matematik wajib gred C ke atas<br/><br/>"
      );
    }

    if (has("requirements")) {
      return (
        "For SVM admission at KV BETONG:<br/>" +
        "- Candidates must obtain at least Level 3 in Classroom Assessment for:<br/>" +
        "- Malay Language<br/>" +
        "- English Language<br/>" +
        "- Mathematics<br/>" +
        "- Science<br/>" +
        "- Design & Technology or Basic Computer Science<br/><br/>" +
        "For DVM admission at KV BETONG:<br/>" +
        "- Academic GPA ≥ 2.00<br/>" +
        "- At least 3 SVM credits<br/>" +
        "- Vocational GPA ≥ 2.67<br/>" +
        "- For Information Technology program, Mathematics grade C or above is required<br/><br/>"
      );
    }

    // UPDATE 1 - KEMASUKAN MALAY HARITS SPECIALS
    if (has("masuk") || has("pendaftaran") || has("permohonan") || has("daftar")) {
      return "Untuk kemasukan dan pendaftaran pelajar ke Kolej Vokasional Betong (KVB), di laman https://spskt4.moe.gov.my/. Minat nak masuk KV? Terutamanya KV BETONG? Tanyalah apa yang menarik di KV BETONG!";
    }

    // UPDATE 1 - KEMASUKAN ENGLISH HARITS SPECIALS
    if (has("admission") || has("register") || has("application") || has("apply")) {
      return "For student admission and registration to Kolej Vokasional Betong (KVB), at the website https://spskt4.moe.gov.my/. Interested in joining a Vocational College? Especially KV BETONG? Ask me anything about what’s interesting at KV BETONG!";
    }

    // UPDATE 2 - YURAN
    if (has("yuran") || has("kos") || has("bayaran") || has("sumbangan")) {
      return "Pengajian di KV Betong adalah percuma. Hanya ada bayaran sumbangan PIBG sebanyak RM50, modul, pakaian seragam, dll.";
    }

    if (has("fee") || has("cost") || has("tuition") || has("payment") || has("contribution")) {
      return "Education at KV Betong is free. There is only a PIBG contribution of RM50, plus fees for modules, uniforms, etc.";
    }

    // UPDATE 3 - BIASISWA
    if (has("biasiswa") || has("bantuan") || has("tajaan") || has("sokongan")) {
      return "KVB menawarkan biasiswa dan bantuan kewangan kepada pelajar yang memerlukan. Sila semak laman rasmi untuk maklumat lanjut.";
    }

    if (has("scholarship") || has("aid") || has("financial aid") || has("assistance") || has("grant")) {
      return "KVB offers scholarships and financial aid to students in need. Please check the official website for more information.";
    }

    // UPDATE 4 - ASRAMA
    if (has("asrama") || has("residensi") || has("kediaman")) {
      return (
        "Di KV BETONG, terdapat residensi/asrama tersedia untuk pelajar asrama dimana:<br/>" +
        "- RESIDENSI A HINGGA RESIDENSI E = PELAJAR LELAKI<br/>" +
        "- RESIDENSI F HINGGA RESIDENSI H = PELAJAR PEREMPUAN<br/><br/>" +
        "Dan kemudahan yang disediakan seperti:<br/>" +
        "- Water Dispenser Panas Dan Sejuk<br/>" +
        "- Vending Machine<br/>" +
        "- Bilik Belajar bersoket<br/>" +
        "dan pelbagai lagi. MARI KE KV BETONG !"
      );
    }

    if (has("dormitory") || has("residence") || has("accommodation")) {
      return (
        "At KV BETONG, dormitory accommodation is available for boarding students where:<br/>" +
        "- RESIDENCE A TO RESIDENCE E = MALE STUDENTS<br/>" +
        "- RESIDENCE F TO RESIDENCE H = FEMALE STUDENTS<br/><br/>" +
        "Facilities provided include:<br/>" +
        "- Hot & Cold Water Dispenser<br/>" +
        "- Vending Machine<br/>" +
        "- Study Rooms with Power Sockets<br/>" +
        "and many more. COME TO KV BETONG!"
      );
    }

    if (has("iktiraf") || has("recognition"))
      return R(
        "KVB diiktiraf oleh Jabatan Pembangunan Kemahiran (JPK) dan Kementerian Sumber Manusia.",
        "KVB is recognized by the Department of Skills Development (DSD) and the Ministry of Human Resources."
      );

    if (has("pengarah") || has("director"))
      return R(
        "Pengarah KVB iaitu Encik Mohd Amin Bin Mohd Noor mengetuai pengurusan kolej dan memastikan kualiti pendidikan TVET terjamin.",
        "The Director of KVB leads the college management and ensures quality TVET education."
      );

    if (has("hubungi") || has("hubung") || has("berhubung") || has("contact"))

      return R(
        "Anda boleh hubungi KVB di talian 083 472 160 atau 083 472 729<br/>" +
        "Emel pula yha2401@moe.edu.my",
        "You may contact KVB at 083 472 160 or 083 472 729<br/>" +
        "For email inquiries, please use yha2401@moe.edu.my",
      );

    if (has("kemudahan") || has("fasiliti") || has("facilities") || has("facility") || has("amenities") || has("infrastructure"))

      return R(
  "Antara kemudahan di KVB termasuk:<br/>" +
  "- Makmal School Net: Makmal Komputer<br/>" +
  "- Padang Bola Sepak/Ragbi: Tempat sukan lasak<br/>" +
  "- Gelanggang Futsal/Bola Keranjang/Takraw/Bola Tampar: Aktiviti sukan lasak<br/>" +
  "- Dewan Sri Kenanga: Tempat berhimpun pelajar dan guru setiap bulan<br/>" +
  "- Dewan Perdana: Dewan makan untuk pelajar asrama<br/>" +
  "- Surau Ibnu Khaldun: Tempat ibadah bagi pelajar Muslim<br/>" +
  "- Blok Kuliah: Lokasi kelas dan bengkel diadakan<br/>" +
  "- Kantin dan kemudahan lain.",

  "Some of the facilities at KVB include:<br/>" +
  "- School Net Lab: Computer laboratory<br/>" +
  "- Football/Rugby Field: For outdoor and tough sports<br/>" +
  "- Futsal/Basketball/Takraw/Volleyball Courts: For various sports activities<br/>" +
  "- Dewan Sri Kenanga: Venue for monthly student and teacher assemblies<br/>" +
  "- Dewan Perdana: Dining hall for boarding students<br/>" +
  "- Surau Ibnu Khaldun: Prayer hall for Muslim students<br/>" +
  "- Lecture Block: Location for classes and workshops<br/>" +
  "- Canteen and other facilities."
);

    if (has("program") || has("programme"))
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

    // === PROGRAM SPECIFICS ===
    if (has("teknologi kimpalan") || has("welding")) {
      return R(
        "Program Teknologi Kimpalan melatih pelajar dalam teknik kimpalan moden, keselamatan industri, dan kemahiran logam/fabrikasi.",
        "The Welding Technology program trains students in modern welding techniques, industrial safety, and metal/fabrication skills."
      );
    }

    if (has("teknologi elektrik") || has("electrical")) {
      return R(
        "Program Teknologi Elektrik melatih pelajar dalam pemasangan, penyelenggaraan, dan pembaikan sistem elektrik serta kawalan motor.",
        "The Electrical Technology program trains students in installation, maintenance, and repair of electrical systems and motor control."
      );
    }

    if (has("teknologi sistem komputer") || has("computer system") || has("rangkaian") || has("network")) {
      return R(
        "Program Sistem Komputer & Rangkaian melatih pelajar dalam pemasangan, penyelenggaraan, dan pengurusan rangkaian IT.",
        "The Computer System & Network Technology program trains students in IT network setup, maintenance, and management."
      );
    }

    if (has("perakaunan") || has("accounting")) {
      return R(
        "Program Perakaunan melatih pelajar dalam kemahiran kewangan, penyediaan laporan akaun, audit, dan penggunaan perisian perakaunan moden.",
        "The Accounting program trains students in financial skills, preparing accounts, auditing, and using modern accounting software."
      );
    }

    if (has("teknologi pemesinan industri") || has("industrial machining")) {
      return R(
        "Program Pemesinan Industri melatih pelajar menggunakan mesin CNC, AutoCAD, dan teknik pembuatan berketepatan tinggi.",
        "The Industrial Machining Technology program trains students to operate CNC machines, AutoCAD, and high-precision manufacturing techniques."
      );
    }

    if (has("teknologi pembinaan") || has("construction technology")) {
      return R(
        "Program Teknologi Pembinaan melatih pelajar dalam kerja konkrit, kayu, pemasangan bangunan, dan lukisan teknikal.",
        "The Construction Technology program trains students in concrete work, carpentry, building assembly, and technical drawing."
      );
    }

    if (has("hospitaliti seni kulinari") || has("culinary arts") || has("cooking")) {
      return R(
        "Program Hospitaliti Seni Kulinari melatih pelajar dalam masakan tempatan & antarabangsa, pengurusan dapur, dan hiasan makanan.",
        "The Hospitality Culinary Arts program trains students in local & international cuisine, kitchen management, and food presentation."
      );
    }

    if (has("teknologi automotif") || has("automotive")) {
      return R(
        "Program Teknologi Automotif melatih pelajar dalam penyelenggaraan, baik pulih, dan diagnostik kenderaan bermotor.",
        "The Automotive Technology program trains students in vehicle maintenance, repair, and diagnostics."
      );
    }

    // UCAPAN SALAM PELBAGAI
    if (has("assalamualaikum")) {
      return R(
        "Waalaikumussalam, haa saya pun pandai jawab salam, Ada pertanyaan ke? Jom kita borak tentang KV BETONG atau sebagainya",
      );
    }

    if (has("hai")) {
      return R(
        "Hai, jom kita borak santai TVET, KVBETONG atau apa je yang awak nak tahu berkenaan saya !",
      );
    }

    if (has("hi")) {
      return R(
        "Hi there ! let's spend this time with some chit chat! You got any questions about TVET, Vocational Colledge for me?",
      );
    }

    if (has("hello")) {
      return R(
        "Hello There ! I'm Brother Loya ready to answer your needs ! Hmm, got a question about TVET, Vocational Colledge? I have the answer!",
      );
    }

    if (has("selamat pagi ")) {
      return R(
        "Selamat Pagi ! Saya dah sedia nak jawab sebarang kemusykilan anda di pagi hari jom!",
      );
    }

    if (has("selamat tengah hari ")) {
      return R(
        "Selamat tengah hari! panasnya harini, kalau hujan tu maaf lah hehe, ada soalan ke tu mari sini saya jawab!",
      );
    }

    if (has("selamat petang")) {
      return R(
        "Selamat Petang! Masa petang ni la masa sesuai nak borak-borak. Jom borak tentang KV atau TVET",
      );
    }

    if (has("selamat malam")) {
      return R(
        "Selamat Malam! fuh malam-malam pun ada soalan eh? boleh saya sentiasa beroperasi 24 jam tanpa henti! anda boleh tanya saya sekarang !",
      );
    }

    if (has("good morning")) {
      return R(
        "Good Morning! I'm ready to answer any of your questions this morning, let's go!",
      );
    }

    if (has("good afternoon")) {
      return R(
        "Good afternoon! It's so hot today, but if it's raining, then my apologies, haha. Got a question? Come on, let me answer it!",
      );
    }

    if (has("good evening")) {
      return R(
        "Good Evening! This evening is the perfect time for a chat. Let's talk about KV or TVET!",
      );
    }

     if (has("good night")) {
       return R(
        "Good Night! Wow, you have questions even late at night? Sure, I operate 24 hours non-stop! You can ask me now!",
      );
    }

    // UCAPAN SALAM PELBAGAI habis le
    if (has("tvet")) {
      return R(
        "TVET itu adalah Pendidikan dan Latihan Teknikal dan Vokasional. Ia adalah satu bentuk pendidikan yang memberi tumpuan kepada latihan praktikal dan kemahiran teknikal yang selari dengan keperluan industri ",
      );
    }

    if (has("visi ")|| has("misi")|| has("vision")|| has("mission")) {
      return R(
        "VISI DAN MISI KOLEJ VOKASIONAL BETONG:</br> "+
        "VISI - Membudayakan amalan persekitaran EKSA (e-Fasiliti, Kebersihan, Keselamatan, Kesihatan) melalui disiplin diri, kerja berpasukan, kreativiti dan inovasi.",
      );
    }


    // DEFAULT FALLBACK (ADDED FIX)
    return R(
      "Maaf, saya belum ada maklumat untuk soalan itu. Cuba tanya dengan cara lain!",
      "Sorry, I don’t have information for that question yet. Try asking it another way!"
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

  return (
    <div className="chat-container-mobile">
      <img className="chat-bg-mobile" src="FinaleBackImage.png" alt="Background" />
      <div className="chat-overlay-mobile"></div>

      <div className="chat-header-mobile">
        <img
          src="/Logo Loya TVET.png"
          alt="Loya TVET Logo"
          className="tvet-logo-mobile"
          onClick={() => navigate("/")}
        />
        <div className="flipping-text-mobile">
          <span className="flip">Anda tanya, LOYA TVET jawab</span>
          <span className="flip">Segala kekeliruan, pasti terjawab.</span>
          <span className="flip">AI teknologi masa depan</span>
        </div>
      </div>

      <div className="chat-body-mobile">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`chat-bubble-mobile ${msg.from}`}
            dangerouslySetInnerHTML={{ __html: msg.text }}
          />
        ))}
        {typing && (
          <div className="typing-indicator-mobile">
            <span></span><span></span><span></span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input-area-mobile">
        <input
          className="chat-input-mobile"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Nyatakan soalan anda di sini!"
        />
        <button className="chat-send-mobile" onClick={handleSend}>
          ➤
        </button>
      </div>
    </div>
  );
}
