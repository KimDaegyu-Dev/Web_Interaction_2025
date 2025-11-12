import { useEffect, useRef } from "react";

interface EdgeZoneIndicatorProps {
  getEdgeZone: () => {
    left: boolean;
    right: boolean;
    top: boolean;
    bottom: boolean;
  };
  thresholdX: number;
  thresholdY: number;
  mousePosition: { x: number; y: number } | null;
}

/**
 * 가장자리 영역 인디케이터 컴포넌트
 */
export function EdgeZoneIndicator({
  getEdgeZone,
  thresholdX,
  thresholdY,
  mousePosition,
}: EdgeZoneIndicatorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | undefined>(undefined);

  // Canvas 초기화 및 리사이즈
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resize();
    window.addEventListener("resize", resize);

    return () => {
      window.removeEventListener("resize", resize);
    };
  }, []);

  // 업데이트 루프
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const update = () => {
      // Canvas 클리어
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      // 블롭 효과 제거됨 - 빈 canvas만 유지
      animationFrameRef.current = requestAnimationFrame(update);
    };

    animationFrameRef.current = requestAnimationFrame(update);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [mousePosition, thresholdX, thresholdY, getEdgeZone]);

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 1000,
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
        }}
      />
    </div>
  );
}
