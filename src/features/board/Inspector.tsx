import { useMemo, useState } from "react";
import { useBoardStore } from "./store";
import { loadBoard, saveBoard } from "./storage";
import type { FormationKey } from "./formations";
import type { Team } from "./types";

const cardStyle: React.CSSProperties = {
  background: "rgba(255,255,255,0.06)",
  border: "1px solid rgba(255,255,255,0.10)",
  borderRadius: 12,
  padding: 12,
};

const titleStyle: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 700,
  letterSpacing: 0.4,
  opacity: 0.8,
  marginBottom: 10,
};

const rowStyle: React.CSSProperties = {
  display: "flex",
  gap: 8,
  flexWrap: "wrap",
};

export default function Inspector() {
  const items = useBoardStore((s) => s.items);
  const selectedId = useBoardStore((s) => s.selectedId);
  const select = useBoardStore((s) => s.select);
  const setName = useBoardStore((s) => s.setName);
  const applyFormation = useBoardStore((s) => s.applyFormation);
  const setAll = useBoardStore((s) => s.setAll);
  const reset = useBoardStore((s) => s.reset);

  // 너가 추가해둔 액션들
  const addPlayer = useBoardStore((s) => s.addPlayer);
  const removeSelected = useBoardStore((s) => s.removeSelected);

  const selected = useMemo(
    () => items.find((x) => x.id === selectedId),
    [items, selectedId],
  );

  const [formationTeam, setFormationTeam] = useState<Team>("RED");

  const onSave = () => {
    saveBoard({ items, selectedId });
    alert("저장되었습니다");
  };

  const onLoad = () => {
    const s = loadBoard();
    if (s) setAll(s);
  };

  const onFormation = (key: FormationKey) => {
    // 지금은 formation이 1팀 기준이라, 일단 그대로 적용
    // (추후: formationTeam에 맞춰 팀 적용하도록 확장 가능)
    applyFormation(key);
    select(undefined);
  };

  return (
    <div style={{ width: 320, padding: 16, color: "#fff" }}>
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          justifyContent: "space-between",
        }}
      >
        <h2 style={{ margin: 0, fontSize: 20 }}>전술판</h2>
        <div style={{ fontSize: 12, opacity: 0.7 }}>MVP</div>
      </div>

      <div style={{ height: 12 }} />

      {/* ① 보드 작업 */}
      <div style={cardStyle}>
        <div style={titleStyle}>보드</div>

        <div style={rowStyle}>
          <button onClick={() => onFormation("2-1-2")}>2-1-2</button>
          <button onClick={() => onFormation("2-0-3")}>2-0-3</button>
        </div>

        <div style={{ height: 10 }} />

        <div style={rowStyle}>
          <button onClick={onSave}>저장</button>
          <button onClick={onLoad}>불러오기</button>
          <button onClick={reset}>리셋</button>
        </div>
      </div>

      <div style={{ height: 12 }} />

      {/* ② 선택 편집 */}
      <div style={cardStyle}>
        <div style={titleStyle}>선택된 오브젝트</div>

        {selected?.kind === "player" ? (
          <>
            <div style={{ fontSize: 12, opacity: 0.75, marginBottom: 8 }}>
              ID: {selected.id}
            </div>

            <label
              style={{
                display: "block",
                marginBottom: 6,
                fontSize: 12,
                opacity: 0.85,
              }}
            >
              이름
            </label>
            <input
              value={selected.name}
              onChange={(e) => setName(selected.id, e.target.value)}
              placeholder="선수 이름 입력"
              style={{
                width: "100%",
                padding: 10,
                borderRadius: 10,
                border: "1px solid rgba(255,255,255,0.15)",
                background: "rgba(0,0,0,0.25)",
                color: "white",
                outline: "none",
              }}
            />

            <div style={{ height: 10 }} />

            <div style={rowStyle}>
              <button onClick={removeSelected}>선택 삭제</button>
            </div>
          </>
        ) : selected?.kind === "ball" ? (
          <>
            <div style={{ opacity: 0.75, fontSize: 12, marginBottom: 8 }}>
              공이 선택되었습니다.
            </div>
            <button onClick={() => select(undefined)}>선택 해제</button>
          </>
        ) : (
          <div style={{ opacity: 0.75, fontSize: 12 }}>
            필드에서 선수를 클릭하면 여기서 이름을 수정할 수 있어요.
          </div>
        )}
      </div>

      <div style={{ height: 12 }} />

      {/* ③ 추가/관리 */}
      <div style={cardStyle}>
        <div style={titleStyle}>선수 추가</div>

        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}
        >
          <button onClick={() => addPlayer("RED")}>+ 빨강</button>
          <button onClick={() => addPlayer("YELLOW")}>+ 노랑</button>
          <button onClick={() => addPlayer("BLUE")}>+ 파랑</button>
        </div>

        <div
          style={{ marginTop: 10, fontSize: 12, opacity: 0.7, lineHeight: 1.4 }}
        >
          팁: 추가하면 중앙에 생성되고 자동 선택돼요.
        </div>
      </div>
    </div>
  );
}
