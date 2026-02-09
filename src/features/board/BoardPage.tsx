import PitchCanvas from "./PitchCanvas";
import Inspector from "./Inspector";

export default function BoardPage() {
  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        background: "#222",
        display: "flex",
        overflow: "hidden", // 🔥 스크롤 차단
      }}
    >
      <div
        id="canvas-wrap"
        style={{
          flex: 1,
          minWidth: 0, // 🔥 flex overflow 방지
        }}
      >
        <PitchCanvas />
      </div>

      <div
        style={{
          width: 320,
          borderLeft: "1px solid rgba(255,255,255,0.15)",
        }}
      >
        <Inspector />
      </div>
    </div>
  );
}
