import { useEffect, useRef, useCallback, useState } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { MouseEventStreams, CameraActions, type EdgeZone } from "../events";
import { useCameraStore } from "@/stores/cameraStore";

/**
 * RxJS 기반 마우스 컨트롤 훅
 * 
 * 인터랙션:
 * - 우클릭 드래그: 맵 패닝 (이동)
 * - 마우스 휠: 줌 인/아웃
 * - 가장자리 호버: 자동 스크롤 (조이스틱 방식)
 * 
 * Note: 카메라는 고정, Oblique 행렬을 통해 씬 변환
 */
export function useMouseControls() {
  const { camera, gl } = useThree();
  
  // Refs for reactive instances
  const mouseEventsRef = useRef<MouseEventStreams | null>(null);
  const cameraActionsRef = useRef<CameraActions | null>(null);
  
  // Local state for reactivity (optional, for re-render triggers)
  const [edgeZone, setEdgeZone] = useState<EdgeZone>({
    left: false,
    right: false,
    top: false,
    bottom: false,
  });

  // Zustand store
  const cameraState = useCameraStore((state) => state.cameraState);
  const setCameraState = useCameraStore((state) => state.setCameraState);

  useEffect(() => {
    const domElement = gl.domElement;

    // 마우스 이벤트 스트림 생성
    const mouseEvents = new MouseEventStreams(domElement);
    mouseEventsRef.current = mouseEvents;

    // 카메라 액션 생성 (상태 변경 시 Zustand에 저장 - 500ms 디바운스 적용됨)
    const cameraActions = new CameraActions(
      mouseEvents,
      {}, // 기본 설정 사용
      camera,
      (state) => {
        setCameraState({
          x: state.x,
          y: state.y,
          zoom: state.zoom,
        });
      }
    );
    cameraActionsRef.current = cameraActions;

    // 저장된 상태가 있으면 복원
    if (cameraState) {
      cameraActions.setState(cameraState.x, cameraState.y, cameraState.zoom);
    }

    // 가장자리 영역 상태 구독 (React 상태 업데이트용)
    const edgeZoneSub = cameraActions.edgeZoneObservable$.subscribe((zone) => {
      setEdgeZone(zone);
    });

    return () => {
      edgeZoneSub.unsubscribe();
      cameraActions.dispose();
      mouseEvents.dispose();
      mouseEventsRef.current = null;
      cameraActionsRef.current = null;
    };
  }, [camera, gl.domElement]); // cameraState와 setCameraState는 의존성에서 제외

  // 초기 상태 복원 (마운트 후 한 번만)
  useEffect(() => {
    if (cameraActionsRef.current && cameraState) {
      cameraActionsRef.current.setState(
        cameraState.x,
        cameraState.y,
        cameraState.zoom
      );
    }
  }, []); // 마운트 시 한 번만 실행

  // 패닝 오프셋 getter
  const getPanOffset = useCallback((): THREE.Vector3 => {
    if (cameraActionsRef.current) {
      return cameraActionsRef.current.getPanOffset();
    }
    return new THREE.Vector3();
  }, []);

  // 가장자리 영역 상태 getter
  const getEdgeZone = useCallback((): EdgeZone => {
    if (cameraActionsRef.current) {
      return cameraActionsRef.current.getEdgeZone();
    }
    return { left: false, right: false, top: false, bottom: false };
  }, []);

  // 줌 getter
  const getZoom = useCallback((): number => {
    if (cameraActionsRef.current) {
      return cameraActionsRef.current.getZoom();
    }
    return 1.0;
  }, []);

  return {
    getPanOffset,
    getEdgeZone,
    getZoom,
    edgeZone, // React 상태로도 제공
    cameraActionsRef,
    mouseEventsRef,
  };
}
