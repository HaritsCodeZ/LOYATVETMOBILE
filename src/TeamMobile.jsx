import React, { useState, useEffect, useRef, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./TeamMobile.css";

const teamMembers = [
  {
    name: "Abg Sabirin Bin Abg Muis",
    role: "PENYELIA PROJEK",
    desc: "Membimbing dan memberi nasihat bagi memastikan projek mencapai matlamat.",
    image: "/Cikgu S.png",
  },
  {
    name: "Muhammad Zariff Najmi",
    role: "ASSISTANT ADVERTISING MANAGER",
    desc: "Membantu dalam penghasilan pengiklanan yang dapat menarik minat pengguna",
    image: "/Zariff-removebg-preview.png",
  },
  {
    name: "Vincent Law Fai Khong",
    role: "ADVERTISING MANAGER",
    desc: "Mengetuai aspek pengiklanan dalam sistem LOYATVET.",
    image: "/Vincent-removebg-preview.png",
  },
  {
    name: "Derrick Chieng Kai Chiong",
    role: "BACK-END DEVELOPER",
    desc: "Pengurus pangkalan data LOYATVET, data responder dan sebagainya",
    image: "/Derrick-removebg-preview.png",
  },
  {
    name: "Muhammad Harits Fikri",
    role: "FRONT-END DEVELOPER",
    desc: "Membangunkan UI UX yang dapat menarik minat pengguna",
    image: "/Harris-removebg-preview.png",
  },
];

const AUTOPLAY_MS = 6000;
const SWIPE_THRESHOLD = 30;
const TRANSITION_MS = 560;

export default function TeamMobile() {
  const navigate = useNavigate();
  const total = teamMembers.length;
  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const autoplayRef = useRef(null);

  const trackRef = useRef(null);
  const startX = useRef(0);
  const currentTranslate = useRef(0);
  const isDragging = useRef(false);
  const lastTouchTime = useRef(0);

  const handleLogoClick = () => {
    setFadeOut(true);
    setTimeout(() => {
      navigate("/");
    }, 600);
  };

  const startAutoplay = useCallback(() => {
    if (autoplayRef.current) clearInterval(autoplayRef.current);
    autoplayRef.current = setInterval(() => {
      setIndex((i) => (i + 1) % total);
    }, AUTOPLAY_MS);
  }, [total]);

  const stopAutoplay = useCallback(() => {
    if (autoplayRef.current) {
      clearInterval(autoplayRef.current);
      autoplayRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (!isPaused) startAutoplay();
    return stopAutoplay;
  }, [isPaused, startAutoplay, stopAutoplay]);

  const next = useCallback(() => setIndex((i) => (i + 1) % total), [total]);
  const prev = useCallback(() => setIndex((i) => (i - 1 + total) % total), [total]);

  const onPointerDown = (clientX) => {
    isDragging.current = true;
    startX.current = clientX;
    currentTranslate.current = 0;
    lastTouchTime.current = Date.now();
    setIsPaused(true);
    stopAutoplay();
    if (trackRef.current) trackRef.current.style.transition = "none";
  };

  const onPointerMove = (clientX) => {
    if (!isDragging.current) return;
    currentTranslate.current = clientX - startX.current;
    if (trackRef.current) {
      trackRef.current.style.transform = `translateX(${currentTranslate.current}px)`;
    }
  };

  const onPointerUp = (clientX) => {
    if (!isDragging.current) return;
    isDragging.current = false;
    const distance = clientX - startX.current;
    if (trackRef.current) {
      trackRef.current.style.transition = `transform ${TRANSITION_MS}ms cubic-bezier(.22,.9,.12,1)`;
      trackRef.current.style.transform = ``;
    }
    const timeDiff = Date.now() - lastTouchTime.current;
    const isQuickSwipe = Math.abs(distance) > SWIPE_THRESHOLD && timeDiff < 1000;
    if (distance < -SWIPE_THRESHOLD || (isQuickSwipe && distance < -12)) next();
    else if (distance > SWIPE_THRESHOLD || (isQuickSwipe && distance > 12)) prev();
    setTimeout(() => setIsPaused(false), 800);
  };

  const onTouchStart = (e) => onPointerDown(e.touches[0].clientX);
  const onTouchMove = (e) => onPointerMove(e.touches[0].clientX);
  const onTouchEnd = (e) => onPointerUp(e.changedTouches[0].clientX);

  return (
    <section className={`team-section ${fadeOut ? "fade-out" : ""}`}>
      <div className="tvet-logo-container" onClick={handleLogoClick}>
        <img
          src="/Logo Loya TVET.png"
          alt="Loya TVET Logo"
          className="tvet-logo-glow"
        />
      </div>

      <video className="bg-video" autoPlay loop muted playsInline>
        <source src="/VIDEOBACKTEAM1.mp4" type="video/mp4" />
      </video>
      <div className="bg-overlay" />

      <div className="team-header">
        <h2 className="glow-text team-title">
          Pasukan <span className="gradient-text">Kami</span>
        </h2>
        <p className="team-sub">Pemimpin. Pereka. Pembangun. Pencetus Inovasi.</p>
      </div>

      <div
        className="carousel-viewport"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onMouseDown={(e) => onPointerDown(e.clientX)}
        onMouseMove={(e) => isDragging.current && onPointerMove(e.clientX)}
        onMouseUp={(e) => isDragging.current && onPointerUp(e.clientX)}
        onMouseLeave={(e) => isDragging.current && onPointerUp(e.clientX)}
      >
        <div
          ref={trackRef}
          className="carousel-track"
          style={{
            transform: `translateX(calc(${-index * 100}%))`,
            transition: `transform ${TRANSITION_MS}ms cubic-bezier(.22,.9,.12,1)`,
          }}
        >
          {teamMembers.map((m, i) => (
            <article key={m.name + i} className="card-panel">
              <figure className="card-figure">
                <img
                  src={m.image}
                  alt={m.name}
                  className="card-image"
                  onError={(e) => (e.target.src = "/fallback.png")}
                />
              </figure>
              <div className="card-body">
                <h3 className="card-name">{m.name}</h3>
                <div className="card-role">{m.role}</div>
                <p className="card-desc">{m.desc}</p>
              </div>
            </article>
          ))}
        </div>

        <button className="nav-btn nav-left" onClick={prev}>
          <ChevronLeft size={20} />
        </button>
        <button className="nav-btn nav-right" onClick={next}>
          <ChevronRight size={20} />
        </button>
      </div>

      <div className="controls-row">
        <div className="dots">
          {teamMembers.map((_, i) => (
            <button
              key={i}
              className={`dot ${i === index ? "dot-active" : ""}`}
              onClick={() => setIndex(i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
