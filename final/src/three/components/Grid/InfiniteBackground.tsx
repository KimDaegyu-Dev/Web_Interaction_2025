import { useTexture } from "@react-three/drei";
import { useThree, useFrame } from "@react-three/fiber";
import { useMemo, useRef, useLayoutEffect } from "react";
import * as THREE from "three";
import { calculateObliqueMatrix } from "../../utils/projection";
import { useProjectionControls } from "../../hooks/useProjectionControls";
import { useObliqueControls } from "../../hooks/useObliqueControls";
import { GRID_CONFIG } from "../../config/grid";

const GROUND_TEXTURES = [
  "./texture/ground_tile1.jpg",
  "./texture/ground_tile2.jpg",
  "./texture/ground_tile3.jpg",
];

const vertexShader = `
varying vec2 vUv;
void main() {
  vUv = uv;
  // Force full-screen quad at far plane (z=0.999 in NDC)
  gl_Position = vec4(position.xy, 0.999, 1.0);
}
`;

const fragmentShader = `
precision highp float;

uniform sampler2D uTexture0;
uniform sampler2D uTexture1;
uniform sampler2D uTexture2;
uniform mat4 uInverseViewProj;
uniform mat4 uInverseOblique;
uniform float uGridSize;

varying vec2 vUv;

// Simple pseudo-random hash function
float hash(vec2 p) {
  return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
}

void main() {
  // 1. NDC Coordinates
  vec2 ndc = vUv * 2.0 - 1.0;

  // 2. Unproject to Distorted World Space (Ray Origin at Near Plane)
  vec4 ndcNear = vec4(ndc, -1.0, 1.0);
  vec4 ndcFar = vec4(ndc, 1.0, 1.0);

  vec4 worldNear = uInverseViewProj * ndcNear;
  vec4 worldFar = uInverseViewProj * ndcFar;

  worldNear /= worldNear.w;
  worldFar /= worldFar.w;

  vec3 rayOrigin = worldNear.xyz;
  vec3 rayDir = normalize(worldFar.xyz - worldNear.xyz);

  // 3. Transform Ray to Real World Space
  // Transform Point (w=1)
  vec4 realOrigin4 = uInverseOblique * vec4(rayOrigin, 1.0);
  vec3 realOrigin = realOrigin4.xyz / realOrigin4.w;

  // Transform Vector (w=0) - direction only
  vec4 realDir4 = uInverseOblique * vec4(rayDir, 0.0);
  vec3 realDir = normalize(realDir4.xyz);

  // 4. Intersect with Plane Y=0
  // t = (planeY - origin.y) / dir.y
  
  float t = -realOrigin.y / realDir.y;
  
  // If looking away from plane or parallel
  if (t < 0.0) discard;
  
  vec3 intersectPoint = realOrigin + realDir * t;
  
  // 5. Sample Texture
  // Grid coordinates are x, z.
  vec2 uv = intersectPoint.xz / uGridSize;
  
  // Determine cell index for random texture selection
  vec2 cellIndex = floor(uv);
  vec2 cellUv = fract(uv);
  
  float rnd = hash(cellIndex);
  
  vec4 color;
  if (rnd < 0.33) {
    color = texture2D(uTexture0, cellUv);
  } else if (rnd < 0.66) {
    color = texture2D(uTexture1, cellUv);
  } else {
    color = texture2D(uTexture2, cellUv);
  }
  
  gl_FragColor = color;
}
`;

export function InfiniteBackground() {
  const textures = useTexture(GROUND_TEXTURES);
  const { camera } = useThree();
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  
  // Controls for Oblique Matrix
  const projectionParams = useProjectionControls();
  const { getPanOffset } = useObliqueControls();

  // Setup texture
  useLayoutEffect(() => {
    textures.forEach(t => {
      t.wrapS = THREE.RepeatWrapping;
      t.wrapT = THREE.RepeatWrapping;
      t.colorSpace = THREE.SRGBColorSpace;
    });
  }, [textures]);

  const uniforms = useMemo(
    () => ({
      uTexture0: { value: textures[0] },
      uTexture1: { value: textures[1] },
      uTexture2: { value: textures[2] },
      uInverseViewProj: { value: new THREE.Matrix4() },
      uInverseOblique: { value: new THREE.Matrix4() },
      uGridSize: { value: GRID_CONFIG.CELL_SIZE },
    }),
    [textures]
  );

  // Temporary objects to avoid GC
  const tempMatrix = useMemo(() => new THREE.Matrix4(), []);

  useFrame(() => {
    if (!materialRef.current) return;

    // 1. Calculate Inverse ViewProjection Matrix
    // Inverse(Proj * View) = Inverse(View) * Inverse(Proj) = World * ProjInv
    tempMatrix.copy(camera.matrixWorld).multiply(camera.projectionMatrixInverse);
    materialRef.current.uniforms.uInverseViewProj.value.copy(tempMatrix);
    
    // 2. Calculate Inverse Oblique Matrix
    const panOffset = getPanOffset();
    // calculateObliqueMatrix returns a new matrix, unavoidable
    const obliqueMatrix = calculateObliqueMatrix(projectionParams, panOffset);
    tempMatrix.copy(obliqueMatrix).invert();
    materialRef.current.uniforms.uInverseOblique.value.copy(tempMatrix);
  });

  return (
    <mesh frustumCulled={false} renderOrder={-100}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        depthWrite={false}
        depthTest={false}
      />
    </mesh>
  );
}
