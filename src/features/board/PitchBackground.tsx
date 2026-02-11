import { Group, Rect, Line, Circle } from "react-konva";

// 골대 + 그물
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

  // 골대 프레임
  // left면 x가 "골대의 왼쪽 끝", right면 x가 "골대의 오른쪽 끝"로 들어오게 할 거임
  const frameX = side === "left" ? x : x - w;

  // 그물 간격
  const step = Math.max(4, Math.floor(Math.min(w, h) / 6));

  const lines = [];

  // 세로줄 (그물)
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
  // 가로줄 (그물)
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
      {/* 프레임 */}
      <Rect
        x={frameX}
        y={y}
        width={w}
        height={h}
        stroke={stroke}
        strokeWidth={strokeWidth}
      />
      {/* 그물 */}
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

  const goalW = innerW * 0.035; // 얇게
  const goalH = innerH * 0.18;

  const boxW = innerW * 0.16;
  const boxH = innerH * 0.52;

  const LINE = "rgba(255,255,255,0.85)";

  // ✅ 스트라이프
  const stripes = 12;
  const stripeW = width / stripes;

  return (
    <Group>
      {/* 잔디 줄무늬 */}
      {Array.from({ length: stripes }).map((_, i) => (
        <Rect
          key={i}
          x={x + i * stripeW}
          y={y}
          width={stripeW}
          height={height}
          fill={i % 2 === 0 ? "rgb(114, 166, 83)" : "rgb(94, 157, 68)"} // 두 톤
        />
      ))}

      {/* 외곽 라인 */}
      <Rect
        x={innerX}
        y={innerY}
        width={innerW}
        height={innerH}
        stroke={LINE}
        strokeWidth={3}
      />

      {/* 중앙선 */}
      <Line
        points={[midX, innerY, midX, innerY + innerH]}
        stroke={LINE}
        strokeWidth={3}
      />

      {/* 센터서클 */}
      <Circle
        x={midX}
        y={midY}
        radius={Math.min(innerW, innerH) * 0.12}
        stroke={LINE}
        strokeWidth={3}
      />

      {/* 페널티 박스 */}
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

      {/* ✅ 왼쪽 골대: 골라인(outer line)에 딱 붙게 */}
      <GoalWithNet
        side="left"
        x={innerX} // 골라인 x
        y={midY - goalH / 2}
        w={goalW}
        h={goalH}
        stroke={LINE}
        strokeWidth={3}
      />

      {/* ✅ 오른쪽 골대 */}
      <GoalWithNet
        side="right"
        x={innerX + innerW} // 골라인 x
        y={midY - goalH / 2}
        w={goalW}
        h={goalH}
        stroke={LINE}
        strokeWidth={3}
      />
    </Group>
  );
}
