import { useMemo, useLayoutEffect, useRef } from "react";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { ThreeEvent } from "@react-three/fiber";
import { MODEL_CONFIG } from "../../config/models";
import { GRID_CONFIG } from "../../config/grid";
import type { SceneObjectInstance } from "../../hooks/usePlacedObjects";
import type { CursorData } from "../../hooks/useRealtimeCursors";

interface InstancedFlowerProps {
  objects: SceneObjectInstance[];
  onObjectClick?: (e: ThreeEvent<MouseEvent>, id: string) => void;
  cursors?: CursorData[];
  myCursor?: {
    gridX: number;
    gridZ: number;
  } | null;
  isLightMode?: boolean;
}

export function InstancedFlower({
  objects,
  onObjectClick,
  cursors = [],
  myCursor = null,
  isLightMode = false,
}: InstancedFlowerProps) {
  const { nodes, scene } = useGLTF(MODEL_CONFIG.SHARED_GLB_URL) as any;

  // 1. 모델 분석: GLTF 내의 모든 메쉬 파츠와 그 상대적 변환(Transform) 정보를 추출합니다.
  // 이것이 플라이웨이트 패턴의 '공유 객체'가 됩니다.
  const meshParts = useMemo(() => {
    const parts: {
      name: string;
      geometry: THREE.BufferGeometry;
      material: THREE.Material | THREE.Material[];
      relativeMatrix: THREE.Matrix4;
    }[] = [];

    // 0. 초기 회전 및 위치 설정
    scene.rotation.set(0, Math.PI - 0.7, 0);
    scene.position.set(0, 0, 0);
    scene.scale.set(1, 1, 1);
    scene.updateMatrixWorld(true);

    // scene의 회전을 반영하기 위해 rootInverse를 Identity로 설정합니다.
    // 이렇게 하면 scene의 회전값이 각 파츠의 relativeMatrix에 포함됩니다.
    const rootInverse = new THREE.Matrix4();
    // nodes 객체를 순회하며 Mesh만 추출 (안전한 방식)
    Object.values(nodes).forEach((node: any) => {
      if (node.isMesh) {
        const relativeMatrix = new THREE.Matrix4().multiplyMatrices(
          rootInverse,
          node.matrixWorld,
        );
        parts.push({
          name: node.name,
          geometry: node.geometry,
          material: node.material,
          relativeMatrix,
        });
      }
    });

    return parts;
  }, [nodes, scene]);

  // 2. 가시성 로직 (메모리 문제 해결을 위해 다시 활성화 권장하지만, 일단 요청대로 전체 렌더링 유지 가능)
  // 성능 최적화를 위해 가시성 체크를 다시 켜는 것이 좋습니다.
  const visibleObjects = useMemo(() => {
    // LightMode일 때는 모든 빌딩 표시
    if (isLightMode) return objects;

    // 커서가 없으면 렌더링 안 함 (선택 사항)
    const allCursorPositions: { x: number; z: number }[] = [];
    cursors.forEach((c) =>
      allCursorPositions.push({ x: c.grid_x, z: c.grid_z }),
    );
    if (myCursor)
      allCursorPositions.push({ x: myCursor.gridX, z: myCursor.gridZ });

    if (allCursorPositions.length === 0) return [];

    const influenceRadius = GRID_CONFIG.CURSOR_INFLUENCE_RADIUS;

    return objects.filter((obj) => {
      const x = obj.position[0];
      const z = obj.position[2];
      // 간단한 거리 체크
      return allCursorPositions.some((c) => {
        const dx = x - c.x;
        const dz = z - c.z;
        return dx * dx + dz * dz <= (influenceRadius - 6) ** 2;
      });
    });
  }, [objects, cursors, myCursor, isLightMode]);

  // 3. 각 메쉬 파츠별 InstancedMesh 참조를 저장할 배열
  const meshRefs = useRef<THREE.InstancedMesh[]>([]);

  // 4. 매트릭스 업데이트: 모든 꽃의 위치/회전/크기를 계산하여 GPU에 전달
  useLayoutEffect(() => {
    if (visibleObjects.length === 0) return;

    const tempObject = new THREE.Object3D();
    const tempMatrix = new THREE.Matrix4();

    // 각 메쉬 파츠(꽃잎, 줄기 등)에 대해 반복
    meshParts.forEach((part, partIndex) => {
      const mesh = meshRefs.current[partIndex];
      if (!mesh) return;

      // 인스턴스 개수 설정 (필요한 만큼만 렌더링)
      mesh.count = visibleObjects.length;

      // 각 꽃(인스턴스)에 대해 반복
      visibleObjects.forEach((obj, instanceIndex) => {
        // 1. 꽃 자체의 변환 (위치, 회전, 스케일)
        const [sx, sy, sz] = obj.scale.map(
          (s) => s * MODEL_CONFIG.SCALE_MULTIPLIER,
        );
        tempObject.position.set(...obj.position);
        tempObject.rotation.set(...obj.rotation);
        tempObject.scale.set(sx, sy, sz);
        tempObject.updateMatrix();

        // 2. 최종 행렬 = 꽃의 월드 변환 * 파츠의 로컬 변환
        // 예: "꽃 전체가 (10,0,10)에 있고, 꽃잎은 꽃 중심에서 (0,1,0)에 있다"
        tempMatrix.multiplyMatrices(tempObject.matrix, part.relativeMatrix);

        // 3. GPU에 행렬 설정
        mesh.setMatrixAt(instanceIndex, tempMatrix);

        // 색상 변경 등 추가적인 인스턴스 속성 설정 가능
      });

      mesh.instanceMatrix.needsUpdate = true;
    });
  }, [visibleObjects, meshParts]);

  return (
    <group>
      {meshParts.map((part, index) => (
        <instancedMesh
          key={part.name}
          ref={(el) => {
            if (el) meshRefs.current[index] = el;
          }}
          args={[part.geometry, part.material, visibleObjects.length]}
          onClick={(e) => {
            e.stopPropagation();
            // 인스턴스 ID(instanceId)를 통해 어떤 꽃을 클릭했는지 찾음
            if (e.instanceId !== undefined) {
              const clickedObj = visibleObjects[e.instanceId];
              if (clickedObj) {
                onObjectClick?.(e, clickedObj.id);
              }
            }
          }}
        >
          {/* 그림자 설정 등 필요 시 추가 */}
        </instancedMesh>
      ))}
    </group>
  );
}
