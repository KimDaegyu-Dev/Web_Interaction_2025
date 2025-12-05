import { create } from "zustand";

/**
 * 마우스 위치 전역 상태 스토어
 * 가장자리 스크롤 등에서도 그리드 호버가 업데이트되도록 매 프레임 추적
 */
interface MousePositionState {
  // 마우스 위치 (null이면 캔버스 밖)
  mousePosition: { x: number; y: number } | null;
  
  // 마우스 위치 설정
  setMousePosition: (position: { x: number; y: number } | null) => void;
  
  // 마우스 이동 핸들러 (이벤트에서 직접 호출)
  updateFromEvent: (event: MouseEvent) => void;
  
  // 마우스가 캔버스를 벗어남
  clearMousePosition: () => void;
}

export const useMousePositionStore = create<MousePositionState>((set) => ({
  mousePosition: null,
  
  setMousePosition: (position) => set({ mousePosition: position }),
  
  updateFromEvent: (event: MouseEvent) => {
    set({
      mousePosition: {
        x: event.clientX,
        y: event.clientY,
      },
    });
  },
  
  clearMousePosition: () => set({ mousePosition: null }),
}));
