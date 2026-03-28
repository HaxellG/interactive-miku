import { useTypewriter } from "../../hooks/useTypewriter";
import "./ChatBubbles.css";

interface MessageProps {
  text: string;
  sender: "miku" | "user";
  avatarUrl?: string;
  isTypingIndicator?: boolean;
}

/**
 * Renders the HUD Laser Trails behind the bubbles
 */
function SpeedLines() {
  return (
    <div className="sci-speed-lines">
      {/* Top track: Dot + Short Line */}
      <div className="sci-laser-track">
        <div className="sci-dot" />
        <div className="sci-line" style={{ width: "24px" }} />
      </div>
      {/* Middle track: Long line */}
      <div className="sci-laser-track">
        <div className="sci-line" style={{ width: "42px" }} />
      </div>
      {/* Bottom track: Dot + Very short line + Dot */}
      <div className="sci-laser-track">
        <div className="sci-dot" />
        <div className="sci-line" style={{ width: "16px" }} />
        <div className="sci-dot" style={{ opacity: 0.5 }} />
      </div>
    </div>
  );
}

export default function ChatBubble({ text, sender, avatarUrl, isTypingIndicator }: MessageProps) {
  const isMiku = sender === "miku";
  // Si Miku está hablando, aplicamos el efecto Typewriter
  const { displayText } = useTypewriter(text, 25, isMiku && !isTypingIndicator);

  return (
    <div className={`sci-message-row ${sender}`}>
      
      {/* Miku Avatar (only on left side) */}
      {isMiku && (
        <div className="sci-avatar">
          {avatarUrl ? (
            <img src={avatarUrl} alt="Miku Avatar" />
          ) : (
            // Placeholder fallback if no image is passed
            <div style={{ color: "rgba(0, 255, 230, 0.8)", fontSize: "20px" }}>M</div>
          )}
        </div>
      )}

      {/* Speed lines for User (Left of the bubble) */}
      {!isMiku && <SpeedLines />}

      {/* The Bubble Base */}
      <div className={`sci-bubble ${sender}`}>
        {isTypingIndicator ? (
          <div className="sci-typing-indicator">
            <div className="sci-typing-dot" />
            <div className="sci-typing-dot" />
            <div className="sci-typing-dot" />
          </div>
        ) : (
          isMiku ? displayText : text
        )}
      </div>

      {/* Speed lines for Miku (Right of the bubble) */}
      {isMiku && <SpeedLines />}

    </div>
  );
}
