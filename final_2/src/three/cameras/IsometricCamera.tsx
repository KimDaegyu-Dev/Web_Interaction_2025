import { useEffect } from "react";
import { useThree } from "@react-three/fiber";
import { OrthographicCamera } from "@react-three/drei";
import { useCameraStore } from "@/stores/cameraStore";

interface IsometricCameraProps {
  position?: [number, number, number];
  zoom?: number;
  near?: number;
  far?: number;
}

/**
 * Oblique 투영에 최적화된 OrthographicCamera
 * - near/far 값을 크게 설정하여 모든 z 값의 객체가 보이도록 함
 * - Oblique 행렬이 씬 변환을 처리하므로 카메라는 고정
 */
export function IsometricCamera({
  position = [1, 10, 5],
  zoom = 50,
  near = -10000,
  far = 10000,
}: IsometricCameraProps) {
  const { gl } = useThree();
  const cameraState = useCameraStore((state) => state.cameraState);

  // 저장된 상태가 있으면 그 값을 사용
  const initialZoom = cameraState ? 1 / cameraState.zoom : zoom;

  useEffect(() => {
    const handleResize = () => {
      gl.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [gl]);

  return (
    <OrthographicCamera
      makeDefault
      position={position}
      zoom={initialZoom}
      near={near}
      far={far}
    />
  );
}
