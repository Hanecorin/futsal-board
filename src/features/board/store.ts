import { create } from "zustand";
import type { BoardState, Vec2 } from "./types";
import { formations, makeBall, type FormationKey } from "./formations";
import { TEAM_COLOR } from "./formations";
import type { Team } from "./types";

const initial: BoardState = {
  items: [...formations["2-1-2"](), makeBall()],
  selectedId: undefined,
};

type Actions = {
  select: (id?: string) => void;
  setPos: (id: string, pos: Vec2) => void;
  setName: (id: string, name: string) => void;
  applyFormation: (key: FormationKey) => void;
  setAll: (state: BoardState) => void;
  reset: () => void;
  addPlayer: (team: import("./types").Team) => void;
  removeSelected: () => void;
};

export const useBoardStore = create<BoardState & Actions>((set, get) => ({
  ...initial,

  select: (id) => set({ selectedId: id }),

  setPos: (id, pos) =>
    set({
      items: get().items.map((it) => (it.id === id ? { ...it, pos } : it)),
    }),

  setName: (id, name) =>
    set({
      items: get().items.map((it) => (it.id === id ? { ...it, name } : it)),
    }),

  applyFormation: (key) => {
    const ball = get().items.find((x) => x.kind === "ball") ?? makeBall();
    set({ items: [...formations[key](), ball], selectedId: undefined });
  },

  addPlayer: (team: Team) => {
    const id = `p-${Date.now()}`; // 간단 id
    const newItem = {
      id,
      kind: "player" as const,
      team,
      color: TEAM_COLOR[team],
      name: "",
      pos: { x: 0.5, y: 0.5 }, // 중앙에 생성(원하면 팀별 기본 위치로 바꿔도 됨)
    };

    set({
      items: [...get().items, newItem],
      selectedId: id,
    });
  },

  removeSelected: () => {
    const sel = get().selectedId;
    if (!sel) return;
    set({
      items: get().items.filter((x) => x.id !== sel),
      selectedId: undefined,
    });
  },

  setAll: (state) => set(state),
  reset: () => set(initial),
}));
