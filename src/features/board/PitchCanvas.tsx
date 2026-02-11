import { useEffect, useMemo, useRef, useState } from "react";
import { Layer, Stage, Circle, Text, Group, Rect } from "react-konva";
import type Konva from "konva";
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
  const setName = useBoardStore((s) => s.setName);
  const ballImage = useImage("/foot-ball.png");

  const [size, setSize] = useState({ w: 0, h: 0 });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);
  const stageRef = useRef<Konva.Stage>(null);

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

  const layout = useMemo(() => {
    const margin = 24;

    const maxW = size.w - margin * 2;
    const maxH = size.h - margin * 2;

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

  const scale = useMemo(() => {
    if (!layout.fieldW || !layout.fieldH) return 1;
    return Math.max(0.6, Math.min(1, layout.fieldW / 800));
  }, [layout.fieldW, layout.fieldH]);

  const playerRadius = 18 * scale;
  const ballRadius = 14 * scale;
  const nameW = 68 * scale;
  const nameH = 20 * scale;
  const nameGap = 4 * scale;
  const nameFont = 13 * scale;

  const editingItem = editingId
    ? items.find((it) => it.id === editingId && it.kind === "player")
    : undefined;

  const editingPos = useMemo(() => {
    if (!editingItem) return null;
    const px = toPx(editingItem.pos, layout.fieldW, layout.fieldH);
    return {
      x: layout.fieldX + px.x - nameW / 2,
      y: layout.fieldY + px.y + playerRadius + nameGap,
      w: nameW,
      h: nameH,
    };
  }, [editingItem, layout, nameGap, nameH, nameW, playerRadius]);

  useEffect(() => {
    if (!editingId) return;
    const el = inputRef.current;
    if (!el) return;
    el.focus();
    el.select();
  }, [editingId]);

  const commitEdit = () => {
    if (!editingId) return;
    setName(editingId, editingValue);
    setEditingId(null);
  };

  const saveSnapshot = () => {
    const stage = stageRef.current;
    if (!stage) return;
    const dataUrl = stage.toDataURL({ pixelRatio: 2 });
    const link = document.createElement("a");
    link.download = "futsal-board.png";
    link.href = dataUrl;
    link.click();
  };

  return (
    <div
      style={{ width: "100%", height: "100%", position: "relative" }}
      onMouseDownCapture={(e) => {
        if (!editingId) return;
        if (e.target === inputRef.current) return;
        commitEdit();
      }}
      onTouchStartCapture={(e) => {
        if (!editingId) return;
        if (e.target === inputRef.current) return;
        commitEdit();
      }}
    >
      {editingItem && editingPos && (
        <input
          ref={inputRef}
          value={editingValue}
          onChange={(e) => setEditingValue(e.target.value)}
          onBlur={commitEdit}
          onKeyDown={(e) => {
            if (e.key === "Enter") commitEdit();
            if (e.key === "Escape") setEditingId(null);
          }}
          style={{
            position: "absolute",
            left: editingPos.x,
            top: editingPos.y,
            width: editingPos.w,
            height: editingPos.h,
            zIndex: 10,
            fontSize: nameFont,
            textAlign: "center",
            color: "#fff",
            background: "rgba(0,0,0,0.55)",
            border: "1px solid rgba(255,255,255,0.35)",
            borderRadius: 6 * scale,
            outline: "none",
          }}
        />
      )}

      <button onClick={saveSnapshot} className="snapshot-btn">
        스크린샷 저장
      </button>

      <Stage
        ref={stageRef}
        width={layout.stageW}
        height={layout.stageH}
        style={{ position: "absolute", inset: 0 }}
        onMouseDown={(e) => {
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

          <Rect
            x={layout.fieldX}
            y={layout.fieldY}
            width={layout.fieldW}
            height={layout.fieldH}
            fillEnabled={false}
            listening
            onMouseDown={(e) => {
              if (e.target === e.target.getStage()) return;
            }}
          />

          {items.map((it) => {
            const px = toPx(it.pos, layout.fieldW, layout.fieldH);
            const cx = layout.fieldX + px.x;
            const cy = layout.fieldY + px.y;

            const isSelected = it.id === selectedId;
            const isEditing = it.id === editingId;
            const radius = it.kind === "player" ? playerRadius : ballRadius;

            return (
              <Group
                key={it.id}
                x={cx}
                y={cy}
                draggable={!isEditing}
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
                {isSelected && (
                  <Circle
                    radius={radius + 6}
                    stroke="white"
                    strokeWidth={3}
                    opacity={0.9}
                  />
                )}

                {it.kind === "player" && (
                  <Circle radius={radius} fill={it.color} />
                )}

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

                {it.kind === "player" && (
                  <>
                    <Rect
                      x={-nameW / 2}
                      y={radius + nameGap}
                      width={nameW}
                      height={nameH}
                      cornerRadius={6 * scale}
                      fill="rgba(0,0,0,0.35)"
                      onClick={(e) => {
                        e.cancelBubble = true;
                        select(it.id);
                        setEditingId(it.id);
                        setEditingValue(it.name || "");
                      }}
                      onMouseDown={(e) => {
                        e.cancelBubble = true;
                        select(it.id);
                        setEditingId(it.id);
                        setEditingValue(it.name || "");
                      }}
                      onTap={(e) => {
                        e.cancelBubble = true;
                        select(it.id);
                        setEditingId(it.id);
                        setEditingValue(it.name || "");
                      }}
                    />
                    <Text
                      text={it.name || "이름"}
                      x={-nameW / 2}
                      y={radius + nameGap + 2 * scale}
                      width={nameW}
                      height={nameH}
                      align="center"
                      verticalAlign="middle"
                      fontSize={nameFont}
                      fill="white"
                      onClick={(e) => {
                        e.cancelBubble = true;
                        select(it.id);
                        setEditingId(it.id);
                        setEditingValue(it.name || "");
                      }}
                      onMouseDown={(e) => {
                        e.cancelBubble = true;
                        select(it.id);
                        setEditingId(it.id);
                        setEditingValue(it.name || "");
                      }}
                      onTap={(e) => {
                        e.cancelBubble = true;
                        select(it.id);
                        setEditingId(it.id);
                        setEditingValue(it.name || "");
                      }}
                    />
                  </>
                )}
              </Group>
            );
          })}
        </Layer>
      </Stage>
    </div>
  );
}
