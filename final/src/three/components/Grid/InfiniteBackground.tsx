import { useThree, useFrame } from "@react-three/fiber";
import { useMemo, useRef, useEffect } from "react";
import * as THREE from "three";
import gsap from "gsap";
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
uniform vec3 uCursorPositions[50]; // Max 50 cursors
uniform int uCursorCount;
uniform int uLightMode; // 0 = buildings, 1 = cursors
uniform float uInfluenceRadius; // Cursor/building influence radius
uniform vec3 uCameraPosition; // Camera position for LOD

varying vec2 vUv;

// Optimized gradient colors with cluster weighting
vec3 getGradientColor(vec2 worldPos, vec2 centerPos, float maxDist, float weight) {
  float dist = length(worldPos - centerPos) / maxDist;
  
  // Define color palette
  vec3 color1 = vec3(0.15, 0.2, 0.45);   // Bright blue-purple (center)
  vec3 color2 = vec3(0.25, 0.15, 0.5);   // Bright purple
  vec3 color3 = vec3(0.2, 0.1, 0.4);     // Purple
  vec3 color4 = vec3(0.1, 0.15, 0.35);   // Deep blue (edge)
  
  // Simplified gradient without branches (better GPU performance)
  float t1 = smoothstep(0.0, 0.3, dist);
  float t2 = smoothstep(0.3, 0.6, dist);
  float t3 = smoothstep(0.6, 1.0, dist);
  
  vec3 color = mix(color1, color2, t1);
  color = mix(color, color3, t2);
  color = mix(color, color4, t3);
  
  // OPTIMIZED: Use fract instead of sin (much faster!)
  float wave = fract(worldPos.x * 0.15 + uTime * 0.5);
  wave *= fract(worldPos.y * 0.15 + uTime * 0.3);
  color += vec3(0.02, 0.01, 0.03) * wave;
  
  // Smooth falloff at edges
  float falloff = 1.0 - smoothstep(0.5, 1.0, dist);
  
  // Apply weight (building count in cluster)
  // Normalize weight: 1 building = 1.0, 5+ buildings = 2.0 (capped)
  float normalizedWeight = min(weight / 3.0, 2.0);
  
  return color * falloff * normalizedWeight;
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
  
  // 5. Create beautiful gradient background
  vec2 worldPos = intersectPoint.xz;
  
  // Base dark background
  vec3 baseColor = vec3(0.08, 0.1, 0.25);
  vec3 finalGradient = baseColor;
  
  // OPTIMIZED: Single loop for both gradient and distance calculation
  float maxInfluenceRadius = uInfluenceRadius; // Use shared config value
  float minDistToLight = 1000.0;
  
  // Choose which positions to use based on light mode
  int count = uLightMode == 0 ? uBuildingCount : uCursorCount;
  
  // Early exit if no light sources
  if (count > 0) {
    for (int i = 0; i < 50; i++) {
      if (i >= count) break;
      
      vec2 lightPos = uLightMode == 0 ? uBuildingPositions[i].xz : uCursorPositions[i].xz;
      float distToLight = length(worldPos - lightPos);
      
      // Track minimum distance for grid fade
      minDistToLight = min(minDistToLight, distToLight);
      
      // Only calculate gradient if within influence radius (early exit optimization)
      if (distToLight < maxInfluenceRadius) {
        // Extract weight from Y component (building count in cluster)
        float weight = uLightMode == 0 ? uBuildingPositions[i].y : 1.0;
        vec3 gradient = getGradientColor(worldPos, lightPos, maxInfluenceRadius, weight);
        finalGradient += gradient;
      }
    }
  }
  
  // Clamp to prevent over-brightening
  finalGradient = min(finalGradient, vec3(0.5, 0.5, 0.7));
  
  // 6. Add subtle grid lines (only near light sources for performance)
  float grid = 0.0;
  float distFade = 1.0 - smoothstep(5.0, 30.0, minDistToLight);
  
  // Only calculate grid if near light sources
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
  cursors?: Array<{
    grid_x: number;
    grid_z: number;
  }>;
  myCursor?: {
    gridX: number;
    gridZ: number;
  } | null;
  lightMode?: "buildings" | "cursors";
}

export function InfiniteBackground({ 
  objects = [], 
  cursors = [], 
  myCursor = null,
  lightMode = "buildings" 
}: InfiniteBackgroundProps) {
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
      uBuildingPositions: { value: Array.from({ length: 50 }, () => new THREE.Vector3(0, 0, 0)) },
      uBuildingCount: { value: 0 },
      uCursorPositions: { value: Array.from({ length: 50 }, () => new THREE.Vector3(0, 0, 0)) },
      uCursorCount: { value: 0 },
      uLightMode: { value: 0 }, // 0 = buildings, 1 = cursors
      uInfluenceRadius: { value: GRID_CONFIG.CURSOR_INFLUENCE_RADIUS },
      uCameraPosition: { value: new THREE.Vector3() },
    }),
    []
  );

  // Temporary objects to avoid GC
  const tempMatrix = useMemo(() => new THREE.Matrix4(), []);
  const tempObliqueMatrix = useMemo(() => new THREE.Matrix4(), []);

  // SPATIAL HASHING CLUSTERING: Group buildings into clusters
  useEffect(() => {
    if (!materialRef.current) return;
    
    const CLUSTER_SIZE = 10; // 10x10 unit grid cells
    const MAX_CLUSTERS = 50; // Maximum clusters to send to shader
    
    // 1. Create clusters using spatial hashing
    const clusterMap = new Map<string, {
      buildings: typeof objects;
      centerX: number;
      centerZ: number;
      count: number;
    }>();
    
    objects.forEach(obj => {
      // Determine which cluster this building belongs to
      const clusterX = Math.floor(obj.position[0] / CLUSTER_SIZE);
      const clusterZ = Math.floor(obj.position[2] / CLUSTER_SIZE);
      const key = `${clusterX},${clusterZ}`;
      
      if (!clusterMap.has(key)) {
        clusterMap.set(key, {
          buildings: [],
          centerX: 0,
          centerZ: 0,
          count: 0
        });
      }
      
      clusterMap.get(key)!.buildings.push(obj);
    });
    
    // 2. Calculate cluster centers (weighted average)
    const clusters = Array.from(clusterMap.values()).map(cluster => {
      const avgX = cluster.buildings.reduce((sum, b) => sum + b.position[0], 0) / cluster.buildings.length;
      const avgZ = cluster.buildings.reduce((sum, b) => sum + b.position[2], 0) / cluster.buildings.length;
      
      return {
        centerX: avgX,
        centerZ: avgZ,
        count: cluster.buildings.length,
        distance: Math.sqrt(
          Math.pow(avgX - camera.position.x, 2) +
          Math.pow(avgZ - camera.position.z, 2)
        )
      };
    });
    
    // 3. Sort by distance to camera and take nearest clusters
    const nearestClusters = clusters
      .sort((a, b) => a.distance - b.distance)
      .slice(0, MAX_CLUSTERS);
    
    // 4. Convert to shader format
    const positions = nearestClusters.map(cluster => 
      new THREE.Vector3(cluster.centerX, cluster.count, cluster.centerZ)
      // Y component stores building count for weighting
    );
    
    // Fill remaining slots with zeros
    while (positions.length < 50) {
      positions.push(new THREE.Vector3(0, 0, 0));
    }
    
    materialRef.current.uniforms.uBuildingPositions.value = positions;
    materialRef.current.uniforms.uBuildingCount.value = Math.min(nearestClusters.length, 50);
  }, [objects, camera.position]);

  // Update cursor positions when cursors or myCursor change
  useEffect(() => {
    if (!materialRef.current) return;
    
    // Combine all cursors (other users + my cursor)
    const allCursors = [...cursors];
    if (myCursor) {
      allCursors.push({ grid_x: myCursor.gridX, grid_z: myCursor.gridZ });
    }
    
    console.log("InfiniteBackground: Updating cursors", allCursors.length, allCursors); // Debug log
    
    const targetPositions = allCursors.slice(0, 50).map(cursor => 
      new THREE.Vector3(cursor.grid_x, 0, cursor.grid_z)
    );
    
    // GSAP smooth interpolation for each cursor position
    const currentPositions = materialRef.current.uniforms.uCursorPositions.value;
    
    // Update existing cursors with GSAP animation
    targetPositions.forEach((targetPos, index) => {
      if (currentPositions[index]) {
        // Only animate if position actually changed
        const current = currentPositions[index];
        if (current.x !== targetPos.x || current.z !== targetPos.z) {
          gsap.to(current, {
            x: targetPos.x,
            y: targetPos.y,
            z: targetPos.z,
            duration: 0.3, // 300ms smooth transition (same as cursor light)
            ease: "power2.out", // Smooth easing
            overwrite: true, // Cancel previous animations
          });
        }
      } else {
        // This shouldn't happen with proper initialization, but handle it anyway
        currentPositions[index] = targetPos.clone();
      }
    });
    
    // Reset positions beyond the cursor count to (0,0,0)
    for (let i = targetPositions.length; i < 50; i++) {
      if (currentPositions[i]) {
        gsap.to(currentPositions[i], {
          x: 0,
          y: 0,
          z: 0,
          duration: 0.3,
          ease: "power2.out",
          overwrite: true,
        });
      }
    }
    
    materialRef.current.uniforms.uCursorCount.value = Math.min(allCursors.length, 50);
  }, [cursors, myCursor]);

  // Update light mode
  useEffect(() => {
    if (!materialRef.current) return;
    materialRef.current.uniforms.uLightMode.value = lightMode === "buildings" ? 0 : 1;
  }, [lightMode]);

  useFrame(() => {
    if (!materialRef.current) return;

    // Update camera position uniform for shader
    materialRef.current.uniforms.uCameraPosition.value.copy(camera.position);

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

