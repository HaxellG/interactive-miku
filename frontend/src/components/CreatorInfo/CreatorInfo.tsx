import { useState } from "react";
import "./CreatorInfo.css";

export default function CreatorInfo() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="sci-creator-container">
      {/* The floating box that appears when opened */}
      <div className={`sci-creator-popup ${isOpen ? "open" : ""}`}>
        <div className="sci-creator-content">
          <h4>SYSTEM INFO</h4>
          <p>Crafted with <span className="heart">❤️</span> by <strong>HaxellG</strong></p>
          <a href="https://github.com/HaxellG/interactive-miku" target="_blank" rel="noopener noreferrer" className="sci-repo-link">
            [ SOURCE CODE ]
          </a>
        </div>
      </div>

      {/* The main logo button */}
      <button 
        className="sci-creator-btn" 
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Creator Info"
      >
        {/* Usará la imagen miku-logo.png alojada en la carpeta public */}
        <img src={`${import.meta.env.BASE_URL}miku-logo.png`} alt="Miku Logo" />
      </button>
    </div>
  );
}
