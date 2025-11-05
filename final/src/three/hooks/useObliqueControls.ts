import { useEffect, useRef } from "react";
import { useThree } from "@react-three/fiber";
import { ObliqueControls } from "../controls/ObliqueControls";
import * as THREE from "three";

/**
 * ObliqueControls를 React Three Fiber 환경에서 사용하기 위한 커스텀 훅
 * 패닝(드래그)과 줌(휠)을 지원합니다.
 *
 * @returns panOffset - 현재 패닝 오프셋 (Oblique 투영 계산에 사용)
 */
export function useObliqueControls() {
  const { camera, gl } = useThree();
  const controlsRef = useRef<ObliqueControls | null>(null);
  const panOffsetRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 0, 0));

  useEffect(() => {
    if (!camera || !gl.domElement) return;

    // ObliqueControls 인스턴스 생성
    const controls = new ObliqueControls(camera, gl.domElement);
    controlsRef.current = controls;

    return () => {
      // 클린업: 이벤트 리스너 제거
      controls.dispose();
      controlsRef.current = null;
    };
  }, [camera, gl.domElement]);

  // panOffset을 반환하는 함수
  const getPanOffset = () => {
    if (controlsRef.current) {
      return controlsRef.current.getPanOffset();
    }
    return panOffsetRef.current;
  };

  return {
    getPanOffset,
    controls: controlsRef.current,
  };
}
