import { useState } from "react";
import "./ChatInput.css";

/**
 * Sci-Fi HUD Chat Input — V3 (Structural & Precision Geometry)
 * 
 * Accurately replicates the exact polygonal silhouettes:
 * - Wider button, steeper parallel gap.
 * - Structural top notch and symmetric bottom notch.
 * - Massive overlapping inner glow wash.
 * - Translucent glass tints instead of solid fills.
 */
interface ChatInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSend: () => void;
  isBusy: boolean;
  apiError?: string | null;
}

export default function ChatInput({ value, onChange, onSend, isBusy, apiError }: ChatInputProps) {
  const [showLimitToast, setShowLimitToast] = useState(false);
  const [showMicToast, setShowMicToast] = useState(false);

  // Uses a 600x56 viewBox canvas.
  const INPUT_POLY = "16,2 205,2 209,6 411,6 415,2 510,2 460,54 415,54 411,50 209,50 205,54 16,54 4,40 4,16";
  const BUTTON_POLY = "522,2 584,2 596,14 596,40 584,54 472,54";
  const ICON_WING_TOP = "534,13 566,28 544,27";
  const ICON_WING_BOT = "534,43 566,28 544,29";

  const isInputEmpty = value.trim().length === 0;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length > 150) {
      setShowLimitToast(true);
      setTimeout(() => setShowLimitToast(false), 3000);
      return; // Block further typing
    }
    onChange(e);
  };

  const handleActionClick = () => {
    if (isBusy) return;
    
    if (isInputEmpty) {
      setShowMicToast(true);
      setTimeout(() => setShowMicToast(false), 3000);
    } else {
      onSend();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isBusy && !isInputEmpty) {
      onSend();
    }
  };

  return (
    <div className="chat-input-wrapper" style={{ opacity: isBusy ? 0.7 : 1 }}>
      
      {/* ── HUD TOAST NOTIFICATIONS ── */}
      <div className={`sci-toast-popup ${apiError ? "visible error" : ""}`}>
        {apiError}
      </div>
      <div className={`sci-toast-popup ${showLimitToast ? "visible error" : ""}`}>
        [ SYSTEM WARNING: MAXIMUM CHARACTER LIMIT (150) REACHED ]
      </div>
      <div className={`sci-toast-popup ${showMicToast ? "visible info" : ""}`}>
        [ AUDIO INPUT RECEPTOR IN DEVELOPMENT... ]
      </div>

      {/* ── BACKGROUND VECTOR LAYER ── */}
      <svg
        className="sci-svg-bg"
        viewBox="0 0 600 56"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <clipPath id="inputClipMask">
            <polygon points={INPUT_POLY} />
          </clipPath>
          <clipPath id="btnClipMask">
            <polygon points={BUTTON_POLY} />
          </clipPath>
          <filter id="glowOuterTight" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
          </filter>
          <filter id="glowInnerWash" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="7" result="blur" />
          </filter>
          <filter id="glowInnerRim" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
          </filter>
        </defs>

        {/* ── 1. INPUT PANEL (Teal / Cyan) ── */}
        <g className="sci-input-group">
          <polygon points={INPUT_POLY} fill="none" stroke="var(--in-outer-glow)" strokeWidth="4" filter="url(#glowOuterTight)" />
          <polygon points={INPUT_POLY} fill="var(--in-fill)" />
          <polygon points={INPUT_POLY} fill="none" stroke="var(--in-inner-glow)" strokeWidth="24" clipPath="url(#inputClipMask)" filter="url(#glowInnerWash)" />
          <polygon points={INPUT_POLY} fill="none" stroke="var(--in-inner-glow)" strokeWidth="10" clipPath="url(#inputClipMask)" filter="url(#glowInnerRim)" />
          <polygon points={INPUT_POLY} fill="none" stroke="var(--in-border)" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
        </g>

        {/* ── 2. ACTION BUTTON PANEL (Glacial Blue) ── */}
        <g className="sci-btn-group" onClick={handleActionClick} style={{ cursor: isBusy ? 'not-allowed' : 'pointer' }}>
          <polygon points={BUTTON_POLY} fill="none" stroke="var(--btn-outer-glow)" strokeWidth="5" filter="url(#glowOuterTight)" />
          <polygon points={BUTTON_POLY} fill="var(--btn-fill)" />
          <polygon points={BUTTON_POLY} fill="none" stroke="var(--btn-inner-glow)" strokeWidth="28" clipPath="url(#btnClipMask)" filter="url(#glowInnerWash)" />
          <polygon points={BUTTON_POLY} fill="none" stroke="var(--btn-inner-glow)" strokeWidth="12" clipPath="url(#btnClipMask)" filter="url(#glowInnerRim)" />
          <polygon points={BUTTON_POLY} fill="none" stroke="var(--btn-border)" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />

          {/* ── 3. DYNAMIC ICON (Send or Mic) ── */}
          {!isInputEmpty ? (
            // SEND ICON
            <>
              <polygon points={ICON_WING_TOP} fill="var(--btn-icon)" filter="url(#glowOuterTight)" />
              <polygon points={ICON_WING_BOT} fill="var(--btn-icon)" filter="url(#glowOuterTight)" />
              <polygon points={ICON_WING_TOP} fill="var(--btn-icon-core)" />
              <polygon points={ICON_WING_BOT} fill="var(--btn-icon-core)" />
            </>
          ) : (
            // MICROPHONE ICON (Audio Waveform)
            <g>
              <rect x="532" y="23" width="4" height="10" rx="2" fill="var(--btn-icon)" filter="url(#glowOuterTight)" />
              <rect x="540" y="18" width="4" height="20" rx="2" fill="var(--btn-icon)" filter="url(#glowOuterTight)" />
              <rect x="548" y="14" width="4" height="28" rx="2" fill="var(--btn-icon)" filter="url(#glowOuterTight)" />
              <rect x="556" y="18" width="4" height="20" rx="2" fill="var(--btn-icon)" filter="url(#glowOuterTight)" />
              <rect x="564" y="23" width="4" height="10" rx="2" fill="var(--btn-icon)" filter="url(#glowOuterTight)" />

              <rect x="532" y="23" width="4" height="10" rx="2" fill="var(--btn-icon-core)" />
              <rect x="540" y="18" width="4" height="20" rx="2" fill="var(--btn-icon-core)" />
              <rect x="548" y="14" width="4" height="28" rx="2" fill="var(--btn-icon-core)" />
              <rect x="556" y="18" width="4" height="20" rx="2" fill="var(--btn-icon-core)" />
              <rect x="564" y="23" width="4" height="10" rx="2" fill="var(--btn-icon-core)" />
            </g>
          )}
        </g>
      </svg>

      {/* ── FOREGROUND CONTENT ── */}
      <div className="sci-input-content">
        <input
          type="text"
          className="sci-input-field"
          placeholder={isBusy ? "Miku is typing..." : "Chat with Miku..."}
          value={value}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          disabled={isBusy}
        />
      </div>
    </div>
  );
}
