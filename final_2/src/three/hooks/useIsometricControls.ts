import { useEffect, useRef, useCallback } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { IsometricControls } from "../controls/IsometricControls";
import { useCameraStore } from "@/stores/cameraStore";
import { CAMERA_CONFIG } from "../config/constants";

/**
 * IsometricControls를 React에서 사용하기 위한 Hook
 * 
 * 인터랙션:
 * - 우클릭 드래그: 맵 패닝 (이동)
 * - 마우스 휠: 줌 인/아웃
 * - 가장자리 호버: 자동 스크롤 (조이스틱 방식)
 */
export function useIsometricControls() {
  const { camera, gl } = useThree();
  const controlsRef = useRef<IsometricControls | null>(null);
  const panOffsetRef = useRef(new THREE.Vector3());
  const edgeZoneRef = useRef({
    left: false,
    right: false,
    top: false,
    bottom: false,
  });
  
  // 카메라 초기 위치 및 타겟 저장
  const initialPositionRef = useRef(new THREE.Vector3(...CAMERA_CONFIG.POSITION));
  const targetRef = useRef(new THREE.Vector3(...CAMERA_CONFIG.TARGET));

  // Zustand store
  const cameraState = useCameraStore((state) => state.cameraState);
  const setCameraState = useCameraStore((state) => state.setCameraState);

  useEffect(() => {
    // 컨트롤 생성
    const controls = new IsometricControls(
      camera,
      gl.domElement,
      (state) => {
        // 상태 변경 시 Zustand에 저장
        setCameraState({
          x: state.x,
          y: state.y,
          zoom: state.zoom,
        });
        panOffsetRef.current.set(state.x, state.y, 0);
      }
    );

    // 저장된 상태가 있으면 복원
    if (cameraState) {
      controls.setState(cameraState.x, cameraState.y, cameraState.zoom);
      panOffsetRef.current.set(cameraState.x, cameraState.y, 0);
    }

    controlsRef.current = controls;

    return () => {
      controls.dispose();
      controlsRef.current = null;
    };
  }, [camera, gl.domElement, cameraState, setCameraState]);

  // 매 프레임마다 카메라 위치 업데이트 (아이소메트릭 각도 유지)
  useFrame(() => {
    if (!controlsRef.current) return;

    const panOffset = controlsRef.current.getPanOffset();
    
    // 아이소메트릭 뷰에서 패닝은 XZ 평면에서 이동
    // 화면의 좌우(X) 이동은 월드의 X+Z 방향
    // 화면의 상하(Y) 이동은 월드의 -X+Z 방향 (또는 X-Z 방향)
    // 아이소메트릭 각도: 45도 회전
    const angle = Math.PI / 4; // 45도
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    
    // 스크린 좌표를 월드 좌표로 변환
    const worldX = panOffset.x * cos - panOffset.y * sin;
    const worldZ = panOffset.x * sin + panOffset.y * cos;
    
    // 카메라 위치 업데이트 (초기 위치 + 오프셋)
    camera.position.x = initialPositionRef.current.x + worldX;
    camera.position.z = initialPositionRef.current.z + worldZ;
    
    // 타겟도 같이 이동
    const newTarget = new THREE.Vector3(
      targetRef.current.x + worldX,
      targetRef.current.y,
      targetRef.current.z + worldZ
    );
    
    // 카메라가 항상 타겟을 바라보도록
    camera.lookAt(newTarget);
  });

  // 패닝 오프셋 getter
  const getPanOffset = useCallback(() => panOffsetRef.current, []);

  // 가장자리 영역 상태 getter
  const getEdgeZone = useCallback(() => {
    if (controlsRef.current) {
      return controlsRef.current.getEdgeZone();
    }
    return edgeZoneRef.current;
  }, []);

  return {
    getPanOffset,
    getEdgeZone,
    controlsRef,
  };
}
