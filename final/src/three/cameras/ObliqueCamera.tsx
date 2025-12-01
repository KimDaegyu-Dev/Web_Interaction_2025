import { useEffect } from "react";
import { useThree } from "@react-three/fiber";
import { OrthographicCamera } from "@react-three/drei";
import { useCameraStore } from "../../stores/cameraStore";

interface ObliqueCameraProps {
  position?: [number, number, number];
  zoom?: number;
  near?: number;
  far?: number;
}

/**
 * Oblique 투영에 최적화된 카메라
 * z 값에 관계없이 모든 객체가 보이도록 far 값을 매우 크게 설정
 * Oblique 투영에서는 z 값이 depth에 영향을 주지 않으므로,
 * 모든 z 값의 객체가 보이도록 far 값을 크게 설정합니다.
 */
export function ObliqueCamera({
  position = [1, 5, 5],
  zoom = 50,
  near = -10000,
  far = 10000, // 매우 큰 far 값으로 z 값 제한 제거
}: ObliqueCameraProps) {
  const { gl } = useThree();
  const cameraState = useCameraStore((state) => state.cameraState);

  // 저장된 상태가 있으면 그 값을 사용 (ObliqueControls의 zoom은 1/camera.zoom 형태이므로 변환)
  // 저장된 상태가 없으면 prop으로 전달된 기본값 사용
  const initialZoom = cameraState ? 1 / cameraState.zoom : zoom;

  useEffect(() => {
    // 리사이즈 이벤트 핸들러
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
