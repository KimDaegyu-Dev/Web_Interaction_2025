import { OrthographicCamera } from "@react-three/drei";

export function MainCamera() {
  return (
    <OrthographicCamera
      makeDefault
      position={[1, 5, 5]}
      zoom={50}
      near={0.1}
      far={100}
    />
  );
}
