import { useRef, useState, useMemo } from "react";
import { useFrame, ThreeEvent } from "@react-three/fiber";
import * as THREE from "three";

interface GlobalSwitchObjectProps {
  position: [number, number, number];
  isLightMode: boolean;
  onToggle: () => void;
}

// Shared geometries to prevent WebGL context loss
const sharedSphereGeometry = new THREE.SphereGeometry(0.3, 32, 32);
const sharedRingGeometry = new THREE.RingGeometry(0.4, 0.6, 32);
const sharedCylinderGeometry = new THREE.CylinderGeometry(0.2, 0.3, 0.1, 16);
const sharedPlaneGeometry = new THREE.PlaneGeometry(1.5, 0.3);

export function GlobalSwitchObject({
  position,
  isLightMode,
  onToggle,
}: GlobalSwitchObjectProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  const switchColor = isLightMode ? "#FFD700" : "#4169E1"; // Gold for light, Blue for dark

  // Memoize materials
  const materials = useMemo(() => ({
    sphere: new THREE.MeshStandardMaterial({
      color: switchColor,
      emissive: switchColor,
      emissiveIntensity: isLightMode ? 2 : 1,
      metalness: 0.8,
      roughness: 0.2,
    }),
    ring: new THREE.MeshBasicMaterial({
      color: switchColor,
      transparent: true,
      opacity: 0.4,
      side: THREE.DoubleSide,
    }),
    pedestal: new THREE.MeshStandardMaterial({
      color: "#333333",
      metalness: 0.6,
      roughness: 0.4,
    }),
    label: new THREE.MeshBasicMaterial({
      color: "#000000",
      transparent: true,
      opacity: 0.7,
      side: THREE.DoubleSide,
    }),
  }), [switchColor, isLightMode]);

  // Animate the switch
  useFrame(({ clock }) => {
    if (meshRef.current) {
      // Rotate slowly
      meshRef.current.rotation.y = clock.getElapsedTime() * 0.5;
      
      // Gentle floating
      const float = Math.sin(clock.getElapsedTime() * 2) * 0.1;
      meshRef.current.position.y = position[1] + 0.5 + float;
      
      // Scale pulse when hovered
      if (hovered) {
        const pulse = Math.sin(clock.getElapsedTime() * 5) * 0.05 + 1.05;
        meshRef.current.scale.setScalar(pulse);
      } else {
        meshRef.current.scale.setScalar(1);
      }
    }
  });

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    onToggle();
  };

  return (
    <group position={position}>
      {/* Main switch sphere */}
      <mesh
        ref={meshRef}
        onClick={handleClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        geometry={sharedSphereGeometry}
        material={materials.sphere}
      />

      {/* Point light emanating from switch */}
      <pointLight
        color={switchColor}
        intensity={isLightMode ? 3 : 1.5}
        distance={8}
        decay={2}
        position={[0, 0.5, 0]}
      />

      {/* Outer ring indicator */}
      <mesh 
        position={[0, 0.05, 0]} 
        rotation={[-Math.PI / 2, 0, 0]}
        geometry={sharedRingGeometry}
        material={materials.ring}
      />

      {/* Pedestal */}
      <mesh 
        position={[0, 0, 0]}
        geometry={sharedCylinderGeometry}
        material={materials.pedestal}
      />

      {/* Label text (using a simple plane for now) */}
      {hovered && (
        <mesh 
          position={[0, 1.2, 0]} 
          rotation={[0, 0, 0]}
          geometry={sharedPlaneGeometry}
          material={materials.label}
        />
      )}
    </group>
  );
}
