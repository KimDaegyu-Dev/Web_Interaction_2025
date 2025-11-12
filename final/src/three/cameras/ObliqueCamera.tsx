import { useEffect } from "react";
import { useThree } from "@react-three/fiber";
import { OrthographicCamera } from "@react-three/drei";

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
      zoom={zoom}
      near={near}
      far={far}
    />
  );
}
