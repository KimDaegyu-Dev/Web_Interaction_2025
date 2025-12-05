import { useMemo } from "react";

interface EdgeZoneIndicatorProps {
  edgeZone: {
    left: boolean;
    right: boolean;
    top: boolean;
    bottom: boolean;
  };
}

/**
 * 화면 가장자리에 화살표 인디케이터 표시
 * 마우스가 가장자리 영역에 있을 때 스크롤 방향을 알려줌
 */
export function EdgeZoneIndicator({ edgeZone }: EdgeZoneIndicatorProps) {
  const indicators = useMemo(() => {
    const items: { direction: string; style: React.CSSProperties; arrow: string }[] = [];

    if (edgeZone.left) {
      items.push({
        direction: "left",
        style: {
          left: 20,
          top: "50%",
          transform: "translateY(-50%)",
        },
        arrow: "←",
      });
    }
    if (edgeZone.right) {
      items.push({
        direction: "right",
        style: {
          right: 20,
          top: "50%",
          transform: "translateY(-50%)",
        },
        arrow: "→",
      });
    }
    if (edgeZone.top) {
      items.push({
        direction: "top",
        style: {
          top: 20,
          left: "50%",
          transform: "translateX(-50%)",
        },
        arrow: "↑",
      });
    }
    if (edgeZone.bottom) {
      items.push({
        direction: "bottom",
        style: {
          bottom: 20,
          left: "50%",
          transform: "translateX(-50%)",
        },
        arrow: "↓",
      });
    }

    return items;
  }, [edgeZone]);

  if (indicators.length === 0) return null;

  return (
    <>
      {indicators.map((indicator) => (
        <div
          key={indicator.direction}
          className="fixed pointer-events-none z-50 text-4xl text-white/60 font-bold animate-pulse"
          style={indicator.style}
        >
          {indicator.arrow}
        </div>
      ))}
    </>
  );
}
