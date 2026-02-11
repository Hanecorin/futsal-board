import { Group, Rect, Line, Circle } from "react-konva";

function GoalWithNet(props: {
  x: number;
  y: number;
  w: number;
  h: number;
  stroke: string;
  strokeWidth: number;
  side: "left" | "right";
}) {
  const { x, y, w, h, stroke, strokeWidth, side } = props;

  const frameX = side === "left" ? x : x - w;

  const step = Math.max(4, Math.floor(Math.min(w, h) / 6));

  const lines = [];

  for (let ix = frameX + step; ix < frameX + w; ix += step) {
    lines.push(
      <Line
        key={`v-${ix}`}
        points={[ix, y, ix, y + h]}
        stroke={stroke}
        strokeWidth={1}
        opacity={0.45}
      />,
    );
  }
  for (let iy = y + step; iy < y + h; iy += step) {
    lines.push(
      <Line
        key={`h-${iy}`}
        points={[frameX, iy, frameX + w, iy]}
        stroke={stroke}
        strokeWidth={1}
        opacity={0.45}
      />,
    );
  }

  return (
    <Group>
      <Rect
        x={frameX}
        y={y}
        width={w}
        height={h}
        stroke={stroke}
        strokeWidth={strokeWidth}
      />
      {lines}
    </Group>
  );
}

type Props = { x: number; y: number; width: number; height: number };

export default function PitchBackground({ x, y, width, height }: Props) {
  const pad = Math.min(width, height) * 0.03;
  const innerX = x + pad;
  const innerY = y + pad;
  const innerW = width - pad * 2;
  const innerH = height - pad * 2;

  const midX = innerX + innerW / 2;
  const midY = innerY + innerH / 2;

  const goalW = innerW * 0.035;
  const goalH = innerH * 0.18;

  const boxW = innerW * 0.16;
  const boxH = innerH * 0.52;

  const LINE = "rgba(255,255,255,0.85)";

  const stripes = 12;
  const stripeW = width / stripes;

  return (
    <Group>
      {Array.from({ length: stripes }).map((_, i) => (
        <Rect
          key={i}
          x={x + i * stripeW}
          y={y}
          width={stripeW}
          height={height}
          fill={i % 2 === 0 ? "rgb(114, 166, 83)" : "rgb(94, 157, 68)"}
        />
      ))}

      <Rect
        x={innerX}
        y={innerY}
        width={innerW}
        height={innerH}
        stroke={LINE}
        strokeWidth={3}
      />

      <Line
        points={[midX, innerY, midX, innerY + innerH]}
        stroke={LINE}
        strokeWidth={3}
      />

      <Circle
        x={midX}
        y={midY}
        radius={Math.min(innerW, innerH) * 0.12}
        stroke={LINE}
        strokeWidth={3}
      />

      <Rect
        x={innerX}
        y={midY - boxH / 2}
        width={boxW}
        height={boxH}
        stroke={LINE}
        strokeWidth={3}
      />
      <Rect
        x={innerX + innerW - boxW}
        y={midY - boxH / 2}
        width={boxW}
        height={boxH}
        stroke={LINE}
        strokeWidth={3}
      />

      <GoalWithNet
        side="left"
        x={innerX}
        y={midY - goalH / 2}
        w={goalW}
        h={goalH}
        stroke={LINE}
        strokeWidth={3}
      />

      <GoalWithNet
        side="right"
        x={innerX + innerW}
        y={midY - goalH / 2}
        w={goalW}
        h={goalH}
        stroke={LINE}
        strokeWidth={3}
      />
    </Group>
  );
}
