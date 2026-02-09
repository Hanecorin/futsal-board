import type { BoardState } from "./types";

const KEY = "futsal_board_v1";

export function saveBoard(state: BoardState) {
  localStorage.setItem(KEY, JSON.stringify(state));
}

export function loadBoard(): BoardState | null {
  const raw = localStorage.getItem(KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as BoardState;
  } catch {
    return null;
  }
}
