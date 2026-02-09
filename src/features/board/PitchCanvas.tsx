import { useEffect, useMemo, useState } from "react";
import { Layer, Stage, Circle, Text, Group, Rect } from "react-konva";
import PitchBackground from "./PitchBackground";
import { useBoardStore } from "./store";
import { toNorm, toPx } from "../../shared/utils/coords";
import { Image as KonvaImage } from "react-konva";
import useImage from "../../shared/hooks/useImage";

export default function PitchCanvas() {
  const items = useBoardStore((s) => s.items);
  const selectedId = useBoardStore((s) => s.selectedId);
  const select = useBoardStore((s) => s.select);
  const setPos = useBoardStore((s) => s.setPos);
  const ballImage = useImage("/foot-ball.png");

  const [size, setSize] = useState({ w: 0, h: 0 });

  useEffect(() => {
    const el = document.getElementById("canvas-wrap");
    if (!el) return;

    const update = () => {
      const rect = el.getBoundingClientRect();
      setSize({ w: rect.width, h: rect.height });
    };

    update();

    const ro = new ResizeObserver(update);
    ro.observe(el);

    return () => ro.disconnect();
  }, []);

  // 오른쪽 패널 공간 확보
  const layout = useMemo(() => {
    const margin = 24;

    const maxW = size.w - margin * 2;
    const maxH = size.h - margin * 2;

    // 풋살장 비율 (대략 2:1)
    const ratio = 2;

    let fieldW = maxW;
    let fieldH = maxW / ratio;

    if (fieldH > maxH) {
      fieldH = maxH;
      fieldW = maxH * ratio;
    }

    const fieldX = (size.w - fieldW) / 2;
    const fieldY = (size.h - fieldH) / 2;

    return {
      stageW: size.w,
      stageH: size.h,
      fieldX,
      fieldY,
      fieldW,
      fieldH,
    };
  }, [size]);

  return (
    <Stage
      width={layout.stageW}
      height={layout.stageH}
      onMouseDown={(e) => {
        // 빈 바닥 클릭하면 선택 해제
        if (e.target === e.target.getStage()) select(undefined);
      }}
    >
      <Layer>
        <PitchBackground
          x={layout.fieldX}
          y={layout.fieldY}
          width={layout.fieldW}
          height={layout.fieldH}
        />

        {/* 필드 영역 밖 클릭도 Stage로 먹히는 경우 있어서, 필드 위 투명 Rect로 처리 */}
        <Rect
          x={layout.fieldX}
          y={layout.fieldY}
          width={layout.fieldW}
          height={layout.fieldH}
          fillEnabled={false}
          listening
          onMouseDown={(e) => {
            // 필드 빈 곳 클릭하면 선택 해제
            if (e.target === e.target.getStage()) return;
          }}
        />

        {items.map((it) => {
          const px = toPx(it.pos, layout.fieldW, layout.fieldH);
          const cx = layout.fieldX + px.x;
          const cy = layout.fieldY + px.y;

          const isSelected = it.id === selectedId;
          const radius = it.kind === "player" ? 18 : 14;

          return (
            <Group
              key={it.id}
              x={cx}
              y={cy}
              draggable
              onMouseDown={(e) => {
                e.cancelBubble = true;
                select(it.id);
              }}
              onDragEnd={(e) => {
                const nx = e.target.x() - layout.fieldX;
                const ny = e.target.y() - layout.fieldY;
                setPos(it.id, toNorm(nx, ny, layout.fieldW, layout.fieldH));
              }}
              dragBoundFunc={(pos) => {
                const minX = layout.fieldX;
                const minY = layout.fieldY;
                const maxX = layout.fieldX + layout.fieldW;
                const maxY = layout.fieldY + layout.fieldH;
                return {
                  x: Math.max(minX, Math.min(maxX, pos.x)),
                  y: Math.max(minY, Math.min(maxY, pos.y)),
                };
              }}
            >
              {/* 선택 표시 */}
              {isSelected && (
                <Circle
                  radius={radius + 6}
                  stroke="white"
                  strokeWidth={3}
                  opacity={0.9}
                />
              )}

              {/* 선수 */}
              {it.kind === "player" && (
                <Circle radius={radius} fill={it.color} />
              )}

              {/* 공: 이미지 우선, 없으면 fallback */}
              {it.kind === "ball" &&
                (ballImage ? (
                  <KonvaImage
                    image={ballImage}
                    x={-radius}
                    y={-radius}
                    width={radius * 2}
                    height={radius * 2}
                  />
                ) : (
                  <Circle radius={radius} fill={it.color} />
                ))}

              {/* 이름 라벨: 선수만 */}
              {it.kind === "player" && (
                <>
                  <Rect
                    x={-34}
                    y={radius + 4}
                    width={68}
                    height={20}
                    cornerRadius={6}
                    fill="rgba(0,0,0,0.35)"
                  />
                  <Text
                    text={it.name || "이름"}
                    x={-34}
                    y={radius + 6}
                    width={68}
                    height={20}
                    align="center"
                    verticalAlign="middle"
                    fontSize={13}
                    fill="white"
                  />
                </>
              )}
            </Group>
          );
        })}
      </Layer>
    </Stage>
  );
}
