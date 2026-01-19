import MikuIdol from "./MikuIdol";

export default function App() {
  return (
    <>
      <video
        autoPlay
        loop
        muted
        playsInline
        src="/background.mp4"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          objectFit: "cover",
          zIndex: -1,
        }}
      />
      <MikuIdol />
    </>
  );
}
