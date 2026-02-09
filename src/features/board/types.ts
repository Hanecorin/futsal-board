export type Vec2 = { x: number; y: number }; // 0~1 normalized
export type ItemKind = "player" | "ball";

export type BoardState = {
  items: BoardItem[];
  selectedId?: string;
};

export type Team = "RED" | "YELLOW" | "BLUE";

export type BoardItem = {
  id: string;
  kind: ItemKind;
  pos: Vec2;
  color: string;
  name: string;
  team?: Team; // ✅ player만 사용
};
