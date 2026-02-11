import type { BoardState } from "./types";

type SavedBoard = {
  id: string;
  name: string;
  createdAt: number;
  state: BoardState;
};

const KEY = "futsal_board_v2";
const LEGACY_KEY = "futsal_board_v1";

function readAll(): SavedBoard[] {
  const raw = localStorage.getItem(KEY);
  if (!raw) return migrateLegacy();
  try {
    return JSON.parse(raw) as SavedBoard[];
  } catch {
    return migrateLegacy();
  }
}

function writeAll(list: SavedBoard[]) {
  localStorage.setItem(KEY, JSON.stringify(list));
}

function migrateLegacy(): SavedBoard[] {
  const raw = localStorage.getItem(LEGACY_KEY);
  if (!raw) return [];
  try {
    const state = JSON.parse(raw) as BoardState;
    const migrated: SavedBoard[] = [
      {
        id: `legacy-${Date.now()}`,
        name: "이전 저장본",
        createdAt: Date.now(),
        state,
      },
    ];
    writeAll(migrated);
    return migrated;
  } catch {
    return [];
  }
}

export function saveBoard(name: string, state: BoardState) {
  const list = readAll();
  const item: SavedBoard = {
    id: `b-${Date.now()}`,
    name,
    createdAt: Date.now(),
    state,
  };
  writeAll([item, ...list]);
  return item.id;
}

export function listBoards(): SavedBoard[] {
  return readAll();
}

export function loadBoard(id: string): BoardState | null {
  const list = readAll();
  const found = list.find((x) => x.id === id);
  return found ? found.state : null;
}

export function removeBoard(id: string) {
  const list = readAll();
  writeAll(list.filter((x) => x.id !== id));
}

export function renameBoard(id: string, name: string) {
  const list = readAll();
  writeAll(list.map((x) => (x.id === id ? { ...x, name } : x)));
}
