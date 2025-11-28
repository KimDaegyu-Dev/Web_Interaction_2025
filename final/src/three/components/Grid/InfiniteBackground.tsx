import { useThree, useFrame } from "@react-three/fiber";
import { useMemo, useRef, useEffect } from "react";
import * as THREE from "three";
import { calculateObliqueMatrix } from "../../utils/projection";
import { useProjectionControls } from "../../hooks/useProjectionControls";
import { useObliqueControls } from "../../hooks/useObliqueControls";
import { GRID_CONFIG } from "../../config/grid";


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

uniform mat4 uInverseViewProj;
uniform mat4 uInverseOblique;
uniform float uGridSize;
uniform float uTime;
uniform vec3 uBuildingPositions[50]; // Max 50 buildings
uniform int uBuildingCount;

varying vec2 vUv;

// Smooth gradient colors (deep blue to purple to pink)
vec3 getGradientColor(vec2 worldPos, vec2 centerPos, float maxDist) {
  float dist = length(worldPos - centerPos) / maxDist;
  
  // Define color palette
  vec3 color1 = vec3(0.15, 0.2, 0.45);   // Bright blue-purple (center)
  vec3 color2 = vec3(0.25, 0.15, 0.5);   // Bright purple
  vec3 color3 = vec3(0.2, 0.1, 0.4);     // Purple
  vec3 color4 = vec3(0.1, 0.15, 0.35);   // Deep blue (edge)
  
  // Create radial gradient with smooth falloff
  vec3 color;
  
  if (dist < 0.3) {
    color = mix(color1, color2, smoothstep(0.0, 0.3, dist));
  } else if (dist < 0.6) {
    color = mix(color2, color3, smoothstep(0.3, 0.6, dist));
  } else {
    color = mix(color3, color4, smoothstep(0.6, 1.0, dist));
  }
  
  // Add subtle animated waves
  float wave = sin(worldPos.x * 0.15 + uTime * 0.5) * 0.5 + 0.5;
  wave *= sin(worldPos.y * 0.15 + uTime * 0.3) * 0.5 + 0.5;
  color += vec3(0.02, 0.01, 0.03) * wave;
  
  // Smooth falloff at edges
  float falloff = 1.0 - smoothstep(0.5, 1.0, dist);
  
  return color * falloff;
}

// Grid line function with anti-aliasing
float gridLine(vec2 pos, float lineWidth) {
  vec2 grid = abs(fract(pos - 0.5) - 0.5) / fwidth(pos);
  float line = min(grid.x, grid.y);
  return 1.0 - min(line / lineWidth, 1.0);
}

void main() {
  // 1. NDC Coordinates
  vec2 ndc = vUv * 2.0 - 1.0;

  // 2. Unproject to Distorted World Space
  vec4 ndcNear = vec4(ndc, -1.0, 1.0);
  vec4 ndcFar = vec4(ndc, 1.0, 1.0);

  vec4 worldNear = uInverseViewProj * ndcNear;
  vec4 worldFar = uInverseViewProj * ndcFar;

  worldNear /= worldNear.w;
  worldFar /= worldFar.w;

  vec3 rayOrigin = worldNear.xyz;
  vec3 rayDir = normalize(worldFar.xyz - worldNear.xyz);

  // 3. Transform Ray to Real World Space
  vec4 realOrigin4 = uInverseOblique * vec4(rayOrigin, 1.0);
  vec3 realOrigin = realOrigin4.xyz / realOrigin4.w;

  vec4 realDir4 = uInverseOblique * vec4(rayDir, 0.0);
  vec3 realDir = normalize(realDir4.xyz);

  // 4. Intersect with Plane Y=0
  float t = -realOrigin.y / realDir.y;
  
  if (t < 0.0) discard;
  
  vec3 intersectPoint = realOrigin + realDir * t;
  
  // 5. Create beautiful gradient background around each building
  vec2 worldPos = intersectPoint.xz;
  
  // Base dark background
  vec3 baseColor = vec3(0.08, 0.1, 0.25);
  vec3 finalGradient = baseColor;
  
  // OPTIMIZED: Single loop for both gradient and distance calculation
  float maxInfluenceRadius = 20.0; // How far each building's gradient extends
  float minDistToBuilding = 1000.0;
  
  // Early exit if no buildings
  if (uBuildingCount > 0) {
    for (int i = 0; i < 50; i++) {
      if (i >= uBuildingCount) break;
      
      vec2 buildingPos = uBuildingPositions[i].xz;
      float distToBuilding = length(worldPos - buildingPos);
      
      // Track minimum distance for grid fade
      minDistToBuilding = min(minDistToBuilding, distToBuilding);
      
      // Only calculate gradient if within influence radius (early exit optimization)
      if (distToBuilding < maxInfluenceRadius) {
        vec3 gradient = getGradientColor(worldPos, buildingPos, maxInfluenceRadius);
        finalGradient += gradient;
      }
    }
  }
  
  // Clamp to prevent over-brightening
  finalGradient = min(finalGradient, vec3(0.5, 0.5, 0.7));
  
  // 6. Add subtle grid lines (only near buildings for performance)
  float grid = 0.0;
  float distFade = 1.0 - smoothstep(5.0, 30.0, minDistToBuilding);
  
  // Only calculate grid if near buildings
  if (distFade > 0.01) {
    vec2 gridUv = worldPos / uGridSize * 2.0;
    grid = gridLine(gridUv, 1.5) * distFade * 0.2;
  }
  
  // Grid color with subtle glow
  vec3 gridColor = vec3(0.3, 0.4, 0.6);
  
  // Combine gradient and grid
  vec3 finalColor = finalGradient + gridColor * grid;
  
  // Add slight vignette effect
  float vignette = 1.0 - length(vUv - 0.5) * 0.3;
  finalColor *= vignette;
  
  gl_FragColor = vec4(finalColor, 1.0);
}
`;

interface InfiniteBackgroundProps {
  objects?: Array<{
    position: [number, number, number];
  }>;
}

export function InfiniteBackground({ objects = [] }: InfiniteBackgroundProps) {
  const { camera, clock } = useThree();
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  
  // Controls for Oblique Matrix
  const projectionParams = useProjectionControls();
  const { getPanOffset } = useObliqueControls();

  const uniforms = useMemo(
    () => ({
      uInverseViewProj: { value: new THREE.Matrix4() },
      uInverseOblique: { value: new THREE.Matrix4() },
      uGridSize: { value: GRID_CONFIG.CELL_SIZE },
      uTime: { value: 0 },
      uBuildingPositions: { value: new Array(50).fill(new THREE.Vector3(0, 0, 0)) },
      uBuildingCount: { value: 0 },
    }),
    []
  );

  // Temporary objects to avoid GC
  const tempMatrix = useMemo(() => new THREE.Matrix4(), []);
  const tempObliqueMatrix = useMemo(() => new THREE.Matrix4(), []);

  // Update building positions when objects change
  useEffect(() => {
    if (!materialRef.current) return;
    
    const positions = objects.slice(0, 50).map(obj => 
      new THREE.Vector3(obj.position[0], obj.position[1], obj.position[2])
    );
    
    // Fill remaining slots with zeros
    while (positions.length < 50) {
      positions.push(new THREE.Vector3(0, 0, 0));
    }
    
    materialRef.current.uniforms.uBuildingPositions.value = positions;
    materialRef.current.uniforms.uBuildingCount.value = Math.min(objects.length, 50);
  }, [objects]);

  useFrame(() => {
    if (!materialRef.current) return;

    // Update time for animation
    materialRef.current.uniforms.uTime.value = clock.getElapsedTime();

    // 1. Calculate Inverse ViewProjection Matrix (camera changes every frame)
    tempMatrix.copy(camera.matrixWorld).multiply(camera.projectionMatrixInverse);
    materialRef.current.uniforms.uInverseViewProj.value.copy(tempMatrix);
    
    // 2. Calculate Inverse Oblique Matrix (panOffset changes when camera moves)
    const panOffset = getPanOffset();
    const obliqueMatrix = calculateObliqueMatrix(projectionParams, panOffset);
    tempObliqueMatrix.copy(obliqueMatrix).invert();
    materialRef.current.uniforms.uInverseOblique.value.copy(tempObliqueMatrix);
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

