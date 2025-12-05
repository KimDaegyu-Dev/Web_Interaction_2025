import { useEffect, useRef } from "react";
import { useThree } from "@react-three/fiber";
import { OrthographicCamera } from "@react-three/drei";
import * as THREE from "three";
import { useCameraStore } from "@/stores/cameraStore";
import { CAMERA_CONFIG } from "../config/constants";

interface IsometricCameraProps {
  position?: [number, number, number];
  target?: [number, number, number];
  zoom?: number;
  near?: number;
  far?: number;
}

/**
 * 아이소메트릭 투영용 OrthographicCamera
 * - near/far 값을 크게 설정하여 모든 z 값의 객체가 보이도록 함
 * - lookAt을 통해 아이소메트릭 각도로 씬을 바라봄
 * - cameraStore의 상태를 사용하여 줌 레벨 유지
 */
export function IsometricCamera({
  position = CAMERA_CONFIG.POSITION,
  target = CAMERA_CONFIG.TARGET,
  zoom = CAMERA_CONFIG.ZOOM,
  near = -10000,
  far = 10000,
}: IsometricCameraProps) {
  const { gl } = useThree();
  const cameraRef = useRef<THREE.OrthographicCamera>(null);
  const cameraState = useCameraStore((state) => state.cameraState);

  // 저장된 상태가 있으면 그 값을 사용
  const initialZoom = cameraState ? 1 / cameraState.zoom : zoom;

  // 카메라가 타겟을 바라보도록 설정
  useEffect(() => {
    if (cameraRef.current) {
      cameraRef.current.lookAt(new THREE.Vector3(...target));
      cameraRef.current.updateProjectionMatrix();
    }
  }, [target]);

  useEffect(() => {
    const handleResize = () => {
      gl.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [gl]);

  return (
    <OrthographicCamera
      ref={cameraRef}
      makeDefault
      position={position}
      zoom={initialZoom}
      near={near}
      far={far}
      onUpdate={(camera) => {
        camera.lookAt(new THREE.Vector3(...target));
      }}
    />
  );
}
