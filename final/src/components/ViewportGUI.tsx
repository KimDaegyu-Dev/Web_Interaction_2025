import { useEffect, useState } from "react";

export interface ControlsRef {
  getPanOffset: () => { x: number; y: number };
  resetCamera: () => void;
  getEdgeZone: () => {
    left: boolean;
    right: boolean;
    top: boolean;
    bottom: boolean;
  };
}

interface ViewportGUIProps {
  controlsRef: React.MutableRefObject<ControlsRef | null>;
}

const INITIAL_STATE = {
  x: 1.4083880776167703,
  y: -5.275527020177157,
};

export function ViewportGUI({ controlsRef }: ViewportGUIProps) {
  const [distance, setDistance] = useState(0);

  useEffect(() => {
    let animationFrameId: number;

    const update = () => {
      if (controlsRef.current) {
        const offset = controlsRef.current.getPanOffset();
        const dx = offset.x - INITIAL_STATE.x;
        const dy = offset.y - INITIAL_STATE.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        setDistance(Math.floor(dist));
      }
      animationFrameId = requestAnimationFrame(update);
    };

    update();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [controlsRef]);

  return (
    <div className="pointer-events-none absolute inset-0 z-10 flex flex-col justify-between p-6">
      <div className="flex justify-center pointer-events-auto">
        <button
          onClick={() => controlsRef.current?.resetCamera()}
          className="rounded-full bg-black/50 px-6 py-2 text-white backdrop-blur-md transition-colors hover:bg-black/70 font-bold border border-white/10"
        >
          카메라 초기화
        </button>
      </div>
      <div className="flex justify-center">
        <div className="rounded-full bg-black/50 px-8 py-3 text-xl font-bold text-[#00ff88] backdrop-blur-md border border-white/10">
          {distance.toLocaleString()} m
        </div>
      </div>
    </div>
  );
}
