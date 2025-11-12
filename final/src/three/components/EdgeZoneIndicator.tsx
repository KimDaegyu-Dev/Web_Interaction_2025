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

interface BlobTrail {
  x: number;
  y: number;
  size: number;
  innerSize: number;
  opacity: number;
}

/**
 * BlobCursor 스타일의 가장자리 연결 컴포넌트
 */
export function EdgeZoneIndicator({
  getEdgeZone,
  thresholdX,
  thresholdY,
  mousePosition,
}: EdgeZoneIndicatorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | undefined>(undefined);
  const smoothMouseRef = useRef({ x: 0, y: 0 });

  // BlobCursor 설정
  const trailCount = 3;
  const sizes = [60, 125, 75];
  const innerSizes = [20, 35, 25];
  const innerColor = "rgba(255,255,255,0.8)";
  const fillColor = "#5227FF";
  const opacities = [0.6, 0.6, 0.6];
  const shadowColor = "rgba(0,0,0,0.75)";
  const shadowBlur = 5;
  const shadowOffsetX = 10;
  const shadowOffsetY = 10;
  const filterStdDeviation = 10; // 블러 효과 줄임
  const fastDuration = 0.1;
  const slowDuration = 0.5;
  const interpolationBlobCount = 5; // 마우스와 가장자리 사이 보간 blob 개수

  // Blob trail 위치들
  const blobTrailsRef = useRef<BlobTrail[]>(
    Array.from({ length: trailCount }, (_, i) => ({
      x: 0,
      y: 0,
      size: sizes[i],
      innerSize: innerSizes[i],
      opacity: opacities[i],
    })),
  );

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

  // 부드러운 애니메이션을 위한 업데이트 루프
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const update = () => {
      // Canvas 클리어
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (!mousePosition) {
        // 부드럽게 사라지기
        smoothMouseRef.current.x *= 0.9;
        smoothMouseRef.current.y *= 0.9;
        blobTrailsRef.current.forEach((blob) => {
          blob.x *= 0.9;
          blob.y *= 0.9;
          blob.opacity *= 0.9;
        });

        if (blobTrailsRef.current[0].opacity > 0.01) {
          animationFrameRef.current = requestAnimationFrame(update);
        }
        return;
      }

      // 뷰포트 크기
      const width = canvas.width;
      const height = canvas.height;

      // 마우스 위치 부드럽게 보간 (lerp)
      const lerpFactor = 0.1;
      smoothMouseRef.current.x +=
        (mousePosition.x - smoothMouseRef.current.x) * lerpFactor;
      smoothMouseRef.current.y +=
        (mousePosition.y - smoothMouseRef.current.y) * lerpFactor;

      const x = smoothMouseRef.current.x;
      const y = smoothMouseRef.current.y;

      // threshold 영역 내에 있는지 확인
      const inThresholdX = x < thresholdX || x > width - thresholdX;
      const inThresholdY = y < thresholdY || y > height - thresholdY;

      if (inThresholdX || inThresholdY) {
        // NDC 좌표 계산 (중심을 기준으로 -1 ~ 1)
        const ndcX = (x - width / 2) / (width / 2);
        const ndcY = -((y - height / 2) / (height / 2)); // Y축 반전

        // 중심에서 마우스까지의 방향 벡터 (NDC 좌표계)
        const dirX = ndcX;
        const dirY = ndcY;

        // 중심 좌표
        const centerX = width / 2;
        const centerY = height / 2;

        // 뷰포트 경계와의 교점 계산
        // 선의 방정식: x(t) = centerX + dirX * t, y(t) = centerY + dirY * t
        // 각 경계와의 교점을 찾고, 가장 가까운 교점 선택
        let minT = Infinity;
        let edgeIntersection: { x: number; y: number; edge: string } | null = null;

        // 왼쪽 경계 (x = 0)
        if (dirX < 0) {
          const t = -centerX / dirX;
          if (t > 0 && t < minT) {
            const intersectY = centerY + dirY * t;
            if (intersectY >= 0 && intersectY <= height) {
              minT = t;
              edgeIntersection = { x: 0, y: intersectY, edge: "left" };
            }
          }
        }

        // 오른쪽 경계 (x = width)
        if (dirX > 0) {
          const t = (width - centerX) / dirX;
          if (t > 0 && t < minT) {
            const intersectY = centerY + dirY * t;
            if (intersectY >= 0 && intersectY <= height) {
              minT = t;
              edgeIntersection = { x: width, y: intersectY, edge: "right" };
            }
          }
        }

        // 위쪽 경계 (y = 0)
        if (dirY < 0) {
          const t = -centerY / dirY;
          if (t > 0 && t < minT) {
            const intersectX = centerX + dirX * t;
            if (intersectX >= 0 && intersectX <= width) {
              minT = t;
              edgeIntersection = { x: intersectX, y: 0, edge: "top" };
            }
          }
        }

        // 아래쪽 경계 (y = height)
        if (dirY > 0) {
          const t = (height - centerY) / dirY;
          if (t > 0 && t < minT) {
            const intersectX = centerX + dirX * t;
            if (intersectX >= 0 && intersectX <= width) {
              minT = t;
              edgeIntersection = { x: intersectX, y: height, edge: "bottom" };
            }
          }
        }

        // Blob trail 업데이트 (마우스를 따라다니도록)
        blobTrailsRef.current.forEach((blob, idx) => {
          const targetX = idx === 0 ? x : blobTrailsRef.current[idx - 1].x;
          const targetY = idx === 0 ? y : blobTrailsRef.current[idx - 1].y;

          const duration = idx === 0 ? fastDuration : slowDuration;
          const lerp = 1 - Math.exp(-duration * 16); // 60fps 기준

          blob.x += (targetX - blob.x) * lerp;
          blob.y += (targetY - blob.y) * lerp;
          // 마우스 blob은 거리에 따라 투명도가 증가 (가장자리에 가까울수록 투명)
          const normalizedDist = inThresholdX
            ? x < thresholdX
              ? (thresholdX - x) / thresholdX
              : (x - (width - thresholdX)) / thresholdX
            : inThresholdY
              ? y < thresholdY
                ? (thresholdY - y) / thresholdY
                : (y - (height - thresholdY)) / thresholdY
              : 0;
          // 가장자리에 가까울수록 투명하게 (반대)
          blob.opacity = opacities[idx] * (1 - normalizedDist * 0.7);
        });

        // 가장자리 blob들 생성 및 보간 blob 추가
        const edgeBlobs: Array<{
          x: number;
          y: number;
          size: number;
          opacity: number;
        }> = [];

        // 교점이 있고 threshold 영역 내에 있을 때만 blob 생성
        if (edgeIntersection) {
          const edgeX = edgeIntersection.x;
          const edgeY = edgeIntersection.y;
          const edge = edgeIntersection.edge;

          // 가장자리까지의 거리 계산 (threshold 기준)
          let normalizedDist = 0;
          let edgeBlobSize = 0;

          if (edge === "left") {
            normalizedDist = (thresholdX - x) / thresholdX;
            edgeBlobSize = thresholdX * normalizedDist * 2 * 2.5;
          } else if (edge === "right") {
            normalizedDist = (x - (width - thresholdX)) / thresholdX;
            edgeBlobSize = thresholdX * normalizedDist * 2 * 2.5;
          } else if (edge === "top") {
            normalizedDist = (thresholdY - y) / thresholdY;
            edgeBlobSize = thresholdY * normalizedDist * 2 * 2.5;
          } else if (edge === "bottom") {
            normalizedDist = (y - (height - thresholdY)) / thresholdY;
            edgeBlobSize = thresholdY * normalizedDist * 2 * 2.5;
          }

          const edgeBlobOpacity = 0.9;

          // 가장자리 blob
          edgeBlobs.push({
            x: edgeX,
            y: edgeY,
            size: edgeBlobSize,
            opacity: edgeBlobOpacity,
          });

          // 마우스와 가장자리 사이 보간 blob들
          if (normalizedDist > 0) {
            const mouseBlob = blobTrailsRef.current[0];
            for (let i = 1; i <= interpolationBlobCount; i++) {
              const t = i / (interpolationBlobCount + 1);
              const interpX = edgeX + (mouseBlob.x - edgeX) * t;
              const interpY = edgeY + (mouseBlob.y - edgeY) * t;
              const interpSize =
                edgeBlobSize + (mouseBlob.size - edgeBlobSize) * t;
              const interpOpacity =
                edgeBlobOpacity + (mouseBlob.opacity - edgeBlobOpacity) * t;

              edgeBlobs.push({
                x: interpX,
                y: interpY,
                size: interpSize,
                opacity: interpOpacity,
              });
            }
          }
        }

        // 모든 blob 그리기 (가장자리 blob 먼저)
        edgeBlobs.forEach((edgeBlob) => {
          ctx.save();

          // 그림자 효과
          ctx.shadowColor = shadowColor;
          ctx.shadowBlur = shadowBlur;
          ctx.shadowOffsetX = shadowOffsetX;
          ctx.shadowOffsetY = shadowOffsetY;

          // 외부 원
          const gradient = ctx.createRadialGradient(
            edgeBlob.x,
            edgeBlob.y,
            0,
            edgeBlob.x,
            edgeBlob.y,
            edgeBlob.size / 2,
          );
          gradient.addColorStop(0, fillColor);
          gradient.addColorStop(1, `${fillColor}00`);

          ctx.globalAlpha = edgeBlob.opacity;
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(edgeBlob.x, edgeBlob.y, edgeBlob.size / 2, 0, Math.PI * 2);
          ctx.fill();

          ctx.restore();
        });

        // 마우스 blob trail 그리기 (threshold 내부에 있을 때만)
        if (inThresholdX || inThresholdY) {
          blobTrailsRef.current.forEach((blob) => {
            ctx.save();

            // 그림자 효과
            ctx.shadowColor = shadowColor;
            ctx.shadowBlur = shadowBlur;
            ctx.shadowOffsetX = shadowOffsetX;
            ctx.shadowOffsetY = shadowOffsetY;

            // 외부 원 (gradient)
            const gradient = ctx.createRadialGradient(
              blob.x,
              blob.y,
              0,
              blob.x,
              blob.y,
              blob.size / 2,
            );
            gradient.addColorStop(0, fillColor);
            gradient.addColorStop(1, `${fillColor}00`);

            ctx.globalAlpha = blob.opacity;
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(blob.x, blob.y, blob.size / 2, 0, Math.PI * 2);
            ctx.fill();

            // 내부 원
            const innerGradient = ctx.createRadialGradient(
              blob.x,
              blob.y,
              0,
              blob.x,
              blob.y,
              blob.innerSize / 2,
            );
            innerGradient.addColorStop(0, innerColor);
            innerGradient.addColorStop(1, `${innerColor}00`);

            ctx.fillStyle = innerGradient;
            ctx.beginPath();
            ctx.arc(blob.x, blob.y, blob.innerSize / 2, 0, Math.PI * 2);
            ctx.fill();

            ctx.restore();
          });
        }

        // 필터 효과 (블러)
        if (filterStdDeviation > 0) {
          // Canvas 2D에서는 직접 필터를 적용할 수 없으므로
          // CSS filter를 사용하거나, 별도의 레이어를 사용해야 합니다.
          // 여기서는 그림자로 대체합니다.
        }
      } else {
        // 부드럽게 사라지기
        smoothMouseRef.current.x *= 0.9;
        smoothMouseRef.current.y *= 0.9;
        blobTrailsRef.current.forEach((blob) => {
          blob.x *= 0.9;
          blob.y *= 0.9;
          blob.opacity *= 0.9;
        });
      }

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
      {/* Canvas로 BlobCursor 스타일 그리기 */}
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          filter:
            filterStdDeviation > 0 ? `blur(${filterStdDeviation}px)` : "none",
        }}
      />
    </div>
  );
}
