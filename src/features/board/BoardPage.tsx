import PitchCanvas from "./PitchCanvas";
import Inspector from "./Inspector";

export default function BoardPage() {
  return (
    <div className="board-page">
      <div id="canvas-wrap" className="board-canvas">
        <PitchCanvas />
      </div>

      <div className="board-inspector">
        <Inspector />
      </div>
    </div>
  );
}
