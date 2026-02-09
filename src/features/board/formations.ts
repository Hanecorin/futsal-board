import type { BoardItem, Team } from "./types";

export const TEAM_COLOR: Record<Team, string> = {
  RED: "#e74c3c",
  YELLOW: "#f1c40f",
  BLUE: "#3498db",
};

export type FormationKey = "2-1-2" | "2-0-3";

const RED = "#e74c3c";
const BALL = "#f1c40f";

export const makeBall = (): BoardItem => ({
  id: "ball",
  kind: "ball",
  pos: { x: 0.5, y: 0.5 },
  color: BALL,
  name: "",
});

export const formations: Record<FormationKey, () => BoardItem[]> = {
  "2-1-2": () => [
    {
      id: "p1",
      kind: "player",
      pos: { x: 0.1, y: 0.5 },
      color: RED,
      name: "GK",
    },
    {
      id: "p2",
      kind: "player",
      pos: { x: 0.24, y: 0.35 },
      color: RED,
      name: "",
    },
    {
      id: "p3",
      kind: "player",
      pos: { x: 0.24, y: 0.65 },
      color: RED,
      name: "",
    },
    {
      id: "p4",
      kind: "player",
      pos: { x: 0.36, y: 0.5 },
      color: RED,
      name: "",
    },
    {
      id: "p5",
      kind: "player",
      pos: { x: 0.46, y: 0.35 },
      color: RED,
      name: "",
    },
    {
      id: "p6",
      kind: "player",
      pos: { x: 0.46, y: 0.65 },
      color: RED,
      name: "",
    },
  ],
  "2-0-3": () => [
    {
      id: "p1",
      kind: "player",
      pos: { x: 0.1, y: 0.5 },
      color: RED,
      name: "GK",
    },
    {
      id: "p2",
      kind: "player",
      pos: { x: 0.24, y: 0.35 },
      color: RED,
      name: "",
    },
    {
      id: "p3",
      kind: "player",
      pos: { x: 0.24, y: 0.65 },
      color: RED,
      name: "",
    },
    {
      id: "p4",
      kind: "player",
      pos: { x: 0.44, y: 0.3 },
      color: RED,
      name: "",
    },
    {
      id: "p5",
      kind: "player",
      pos: { x: 0.44, y: 0.5 },
      color: RED,
      name: "",
    },
    {
      id: "p6",
      kind: "player",
      pos: { x: 0.44, y: 0.7 },
      color: RED,
      name: "",
    },
  ],
};
