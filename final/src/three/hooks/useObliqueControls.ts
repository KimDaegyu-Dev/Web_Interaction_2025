import { useEffect, useRef } from "react";
import { useThree } from "@react-three/fiber";
import { ObliqueControls } from "../controls/ObliqueControls";
import * as THREE from "three";
import { useCameraStore } from "../../stores/cameraStore";

export function useObliqueControls() {
  const { camera, gl } = useThree();
  const controlsRef = useRef<ObliqueControls | null>(null);
  const panOffsetRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 0, 0));

  // Store actions
  const setCameraState = useCameraStore((state) => state.setCameraState);
  const cameraState = useCameraStore((state) => state.cameraState);

  // Debounce ref to avoid re-creating function on every render
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!camera || !gl.domElement) return;

    // 상태 저장 함수 (디바운스 적용)
    const handleStateChange = (state: {
      x: number;
      y: number;
      zoom: number;
    }) => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      debounceTimerRef.current = setTimeout(() => {
        setCameraState(state);
      }, 500); // 500ms 디바운스
    };

    // ObliqueControls 인스턴스 생성
    const controls = new ObliqueControls(
      camera,
      gl.domElement,
      handleStateChange,
    );

    // 저장된 상태가 있으면 복원
    if (cameraState) {
      controls.setState(cameraState.x, cameraState.y, cameraState.zoom);
    }

    controlsRef.current = controls;

    return () => {
      // 언마운트 시 상태 저장
      const panOffset = controls.getPanOffset();
      setCameraState({
        x: panOffset.x,
        y: panOffset.y,
        zoom: controls.zoom,
      });

      // 클린업: 이벤트 리스너 제거
      controls.dispose();
      controlsRef.current = null;

      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [camera, gl.domElement]); // cameraState와 setCameraState는 의존성에서 제외하여 마운트/언마운트 시에만 실행되도록 함

  // panOffset을 반환하는 함수
  const getPanOffset = () => {
    if (controlsRef.current) {
      return controlsRef.current.getPanOffset();
    }
    return panOffsetRef.current;
  };

  // 가장자리 영역 상태를 반환하는 함수
  const getEdgeZone = () => {
    if (controlsRef.current) {
      return controlsRef.current.getEdgeZone();
    }
    return { left: false, right: false, top: false, bottom: false };
  };

  return {
    getPanOffset,
    getEdgeZone,
    controls: controlsRef.current,
  };
}
