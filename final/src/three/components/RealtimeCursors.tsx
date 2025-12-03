import { useRef, useMemo, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import gsap from "gsap";
import type { CursorData } from "@/three/hooks/useRealtimeCursors";

interface RealtimeCursorsProps {
  cursors: CursorData[];
  myCursor?: { gridX: number; gridZ: number; color: string } | null;
}

// Shared geometries to prevent WebGL context loss
const sharedSphereGeometry = new THREE.SphereGeometry(0.15, 16, 16);
const sharedRingGeometry = new THREE.RingGeometry(0.3, 0.5, 32);

export function RealtimeCursors({ cursors, myCursor }: RealtimeCursorsProps) {
  return (
    <group>
      {/* My cursor - shown with distinct styling */}
      {myCursor && (
        <CursorLight
          key="my-cursor"
          gridX={myCursor.gridX}
          gridZ={myCursor.gridZ}
          color={myCursor.color}
          isMe={true}
        />
      )}
      
      {/* Other users' cursors */}
      {cursors.map((cursor) => (
        <CursorLight
          key={cursor.user_id}
          gridX={cursor.grid_x}
          gridZ={cursor.grid_z}
          color={cursor.color}
          isMe={false}
        />
      ))}
    </group>
  );
}

interface CursorLightProps {
  gridX: number;
  gridZ: number;
  color: string;
  isMe: boolean;
}

function CursorLight({ gridX, gridZ, color, isMe }: CursorLightProps) {
  const groupRef = useRef<THREE.Group>(null);
  const lightRef = useRef<THREE.PointLight>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  // Use shared materials to reduce memory
  const materials = useMemo(() => ({
    sphere: new THREE.MeshStandardMaterial({
      color,
      emissive: color,
      emissiveIntensity: isMe ? 2.0 : 1.5,
      transparent: true,
      opacity: isMe ? 0.9 : 0.8,
    }),
    ring: new THREE.MeshBasicMaterial({
      color,
      transparent: true,
      opacity: isMe ? 0.5 : 0.3,
      side: THREE.DoubleSide,
    }),
  }), [color, isMe]);

  // Cleanup materials on unmount
  useEffect(() => {
    return () => {
      materials.sphere.dispose();
      materials.ring.dispose();
    };
  }, [materials]);

  // GSAP smooth interpolation for position changes
  useEffect(() => {
    if (groupRef.current) {
      // Animate to new position smoothly
      gsap.to(groupRef.current.position, {
        x: gridX,
        z: gridZ,
        duration: 0.3, // 300ms smooth transition
        ease: "power2.out", // Smooth easing
        overwrite: true, // Cancel previous animations
      });
    }
  }, [gridX, gridZ]);

  useFrame(({ clock }) => {
    if (lightRef.current) {
      const pulse = Math.sin(clock.getElapsedTime() * (isMe ? 4 : 3)) * 0.3 + 0.7;
      lightRef.current.intensity = pulse * (isMe ? 2.5 : 2);
    }

    if (meshRef.current) {
      // Gentle floating animation
      const float = Math.sin(clock.getElapsedTime() * 2) * 0.1;
      meshRef.current.position.y = 0.5 + float;
      
      // Rotate the glow sphere
      meshRef.current.rotation.y += isMe ? 0.03 : 0.02;
    }

    if (ringRef.current && isMe) {
      // Extra rotation for my cursor's ring
      ringRef.current.rotation.z += 0.01;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Point light for illumination */}
      <pointLight
        ref={lightRef}
        color={color}
        intensity={isMe ? 2.5 : 2}
        distance={isMe ? 6 : 5}
        decay={2}
        position={[0, 100.5, 0]}
      />

      {/* Visible glowing sphere */}
      <mesh ref={meshRef} position={[0, 100.5, 0]} geometry={sharedSphereGeometry} material={materials.sphere} />

      {/* Outer glow ring */}
      <mesh 
        ref={ringRef}
        scale={[3.5, 3.5, 3.5]}
        position={[0, 0.05, 0]} 
        rotation={[-Math.PI / 2, 0, 0]}
        geometry={sharedRingGeometry}
        material={materials.ring}
      />
    </group>
  );
}
