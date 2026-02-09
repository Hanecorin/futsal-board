import type { Vec2 } from "../../features/board/types";

export const toPx = (p: Vec2, w: number, h: number) => ({
  x: p.x * w,
  y: p.y * h,
});

export const toNorm = (x: number, y: number, w: number, h: number): Vec2 => ({
  x: Math.max(0, Math.min(1, x / w)),
  y: Math.max(0, Math.min(1, y / h)),
});
