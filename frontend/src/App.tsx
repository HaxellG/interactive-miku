import { useState } from "react";
import MikuIdol from "./MikuIdol";

export default function App() {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);

  return (
    <>
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          zIndex: -1,
          overflow: "hidden",
        }}
      >
        <video
          autoPlay
          loop
          muted
          playsInline
          onCanPlayThrough={() => setIsVideoLoaded(true)}
          src={`${import.meta.env.BASE_URL}background.mp4`}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "fill",
          }}
        />
      </div>
      <MikuIdol isVideoLoaded={isVideoLoaded} />
    </>
  );
}
