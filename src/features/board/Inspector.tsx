import { useMemo, useState } from "react";
import { useBoardStore } from "./store";
import {
  listBoards,
  loadBoard,
  removeBoard,
  renameBoard,
  saveBoard,
} from "./storage";
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
  const addPlayer = useBoardStore((s) => s.addPlayer);
  const removeSelected = useBoardStore((s) => s.removeSelected);

  const selected = useMemo(
    () => items.find((x) => x.id === selectedId),
    [items, selectedId],
  );

  const [savedList, setSavedList] = useState(() => listBoards());
  const [activeSaveId, setActiveSaveId] = useState<string | null>(null);
  const [boardTab, setBoardTab] = useState<"board" | "saved">("board");

  const refreshList = () => setSavedList(listBoards());

  const onSave = () => {
    const name = prompt("저장 이름을 입력하세요");
    if (!name) return;
    saveBoard(name, { items, selectedId });
    refreshList();
    alert("저장되었습니다");
  };

  const onOverwrite = (id: string, currentName: string) => {
    removeBoard(id);
    saveBoard(currentName, { items, selectedId });
    refreshList();
    alert("저장되었습니다");
  };

  const onLoad = (id: string) => {
    const s = loadBoard(id);
    if (s) setAll(s);
    setActiveSaveId(id);
  };

  const onRemove = (id: string) => {
    removeBoard(id);
    refreshList();
    if (activeSaveId === id) setActiveSaveId(null);
  };

  const onRename = (id: string, currentName: string) => {
    const name = prompt("새 이름을 입력하세요", currentName);
    if (!name || name === currentName) return;
    renameBoard(id, name);
    refreshList();
  };

  const onFormation = (key: FormationKey) => {
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

      {/* 보드 / 저장목록 탭 */}
      <div style={cardStyle}>
        <div style={{ display: "flex", gap: 6, marginBottom: 10 }}>
          <button
            onClick={() => setBoardTab("board")}
            style={{
              padding: "6px 10px",
              fontSize: 12,
              background:
                boardTab === "board"
                  ? "rgba(255,255,255,0.12)"
                  : "rgba(0,0,0,0.25)",
              border:
                boardTab === "board"
                  ? "1px solid rgba(255,255,255,0.25)"
                  : "1px solid rgba(255,255,255,0.08)",
            }}
          >
            보드
          </button>
          <button
            onClick={() => setBoardTab("saved")}
            style={{
              padding: "6px 10px",
              fontSize: 12,
              background:
                boardTab === "saved"
                  ? "rgba(255,255,255,0.12)"
                  : "rgba(0,0,0,0.25)",
              border:
                boardTab === "saved"
                  ? "1px solid rgba(255,255,255,0.25)"
                  : "1px solid rgba(255,255,255,0.08)",
            }}
          >
            저장목록
          </button>
        </div>

        {boardTab === "board" ? (
          <>
            <div style={titleStyle}>보드</div>

            <div style={rowStyle}>
              <button onClick={() => onFormation("2-1-2")}>2-1-2</button>
              <button onClick={() => onFormation("2-0-3")}>2-0-3</button>
            </div>

            <div style={{ height: 10 }} />

            <div style={rowStyle}>
              <button
                onClick={() => {
                  if (!activeSaveId) {
                    onSave();
                    return;
                  }
                  const choice = confirm(
                    "현재 불러온 저장본을 덮어쓸까요?\n취소를 누르면 새로 저장합니다.",
                  );
                  if (choice) {
                    const current = savedList.find(
                      (s) => s.id === activeSaveId,
                    );
                    if (current) onOverwrite(current.id, current.name);
                  } else {
                    onSave();
                  }
                }}
              >
                저장
              </button>
              <button onClick={reset}>리셋</button>
            </div>
          </>
        ) : (
          <>
            <div style={titleStyle}>저장목록</div>

            <div style={{ display: "grid", gap: 8 }}>
              {savedList.length === 0 ? (
                <div style={{ fontSize: 12, opacity: 0.7 }}>
                  저장된 보드가 없습니다.
                </div>
              ) : (
                savedList.map((s) => (
                  <div
                    key={s.id}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr",
                      gap: 6,
                      padding: "10px 10px",
                      borderRadius: 10,
                      border: "1px solid rgba(255,255,255,0.08)",
                      background: "rgba(0,0,0,0.25)",
                    }}
                  >
                    <div
                      style={{
                        fontSize: 14,
                        fontWeight: 700,
                        opacity: 0.95,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                      title={s.name}
                    >
                      {s.name}
                    </div>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button
                        onClick={() => onLoad(s.id)}
                        style={{ padding: "2px 6px", fontSize: 11 }}
                      >
                        불러오기
                      </button>
                      <button
                        onClick={() => onRename(s.id, s.name)}
                        style={{ padding: "2px 6px", fontSize: 11 }}
                      >
                        이름변경
                      </button>
                      <button
                        onClick={() => onRemove(s.id)}
                        style={{ padding: "2px 6px", fontSize: 11 }}
                      >
                        삭제
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </div>

      <div style={{ height: 12 }} />

      {/* 선택된 오브젝트 */}
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
              공이 선택되었습니다
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

      {/* 선수 추가 */}
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
