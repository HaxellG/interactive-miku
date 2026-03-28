import "./LoadingScreen.css";

interface LoadingScreenProps {
  isVisible: boolean;
  isFadingOut: boolean;
}

export default function LoadingScreen({ isVisible, isFadingOut }: LoadingScreenProps) {
  if (!isVisible) return null;

  return (
    <div className={`sci-loading-container ${isFadingOut ? "fade-out" : ""}`}>
      <div className="sci-loading-content">
        <img src="/miku-logo.png" alt="Miku Logo" className="sci-loading-logo" />
        <h2 className="sci-loading-text">INITIALIZING SYSTEM...</h2>
        <div className="sci-loading-bar">
          <div className="sci-loading-progress"></div>
        </div>
      </div>
    </div>
  );
}
