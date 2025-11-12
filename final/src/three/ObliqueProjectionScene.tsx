import { useRef, useEffect, useState, useCallback } from "react";
import { Canvas, useThree, useFrame, ThreeEvent } from "@react-three/fiber";
import { useControls, button } from "leva";
import * as THREE from "three";
import { ObliqueCamera } from "./cameras/ObliqueCamera";
import { Lights } from "./lights/Lights";
import { InteractiveDisplayObjects } from "./components/DisplayObjects/InteractiveDisplayObjects";
import { useObliqueProjection } from "./hooks/useObliqueProjection";
import { useObliqueControls } from "./hooks/useObliqueControls";
import { useGridInteraction } from "./hooks/useGridInteraction";
import { calculateObliqueMatrix } from "./utils/projection";
import { DEFAULT_PARAMS, PRESETS } from "./config/presets";
import type { ProjectionParams } from "./config/types";
import { useDebugMode } from "../utils";
import { ROOM_HEIGHT } from "./config/constants";

interface SceneProps {
  gridInteraction: ReturnType<typeof useGridInteraction>;
  mousePosition: { x: number; y: number } | null;
}

function Scene({ gridInteraction, mousePosition }: SceneProps) {
  const gridHighlightGroupRef = useRef<THREE.Group>(null); // 그리드 강조 메시용
  const objectGroupRef = useRef<THREE.Group>(null);
  const debugMode = useDebugMode();
  const { scene, camera, gl } = useThree();
  const lastGridCoordsRef = useRef<{ x: number; z: number } | null>(null);

  // 배경색 설정
  useEffect(() => {
    scene.background = new THREE.Color("#f5f5f5");
  }, [scene]);

  // ObliqueControls 초기화 (패닝 & 줌)
  const { getPanOffset } = useObliqueControls();

  // Grid Interaction (Shift + 클릭으로 큐브 생성)
  const {
    hoveredCell,
    cubes,
    isShiftPressed,
    onCellPointerOver,
    onCellPointerOut,
    onCellClick,
    onCubeClick,
  } = gridInteraction;

  // Leva GUI 컨트롤 - #debug가 있을 때만 활성화
  const params = useControls(
    "Projection",
    {
      thetaX: {
        value: DEFAULT_PARAMS.thetaX,
        min: 0,
        max: 360,
        step: 1,
      },
      thetaY: {
        value: DEFAULT_PARAMS.thetaY,
        min: 0,
        max: 360,
        step: 1,
      },
      thetaZ: {
        value: DEFAULT_PARAMS.thetaZ,
        min: 0,
        max: 360,
        step: 1,
      },
      scaleX: {
        value: DEFAULT_PARAMS.scaleX,
        min: 0.1,
        max: 2,
        step: 0.01,
      },
      scaleY: {
        value: DEFAULT_PARAMS.scaleY,
        min: 0.1,
        max: 2,
        step: 0.01,
      },
      scaleZ: {
        value: DEFAULT_PARAMS.scaleZ,
        min: 0.1,
        max: 2,
        step: 0.01,
      },
    },
    { render: () => debugMode },
  ) as ProjectionParams;

  // Oblique 투영 행렬 계산 (그리드에서 역변환에 사용)
  // panOffset은 매 프레임 변하므로 실시간으로 계산
  const getObliqueMatrix = useCallback(() => {
    const panOffset = getPanOffset();
    return calculateObliqueMatrix(params, panOffset);
  }, [params, getPanOffset]);

  // 클릭 이벤트 핸들러
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      console.log("🖱️ 클릭 이벤트 발생", { shiftKey: e.shiftKey });

      // 정규화된 디바이스 좌표로 변환
      const rect = gl.domElement.getBoundingClientRect();
      const ndcX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ndcY = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      console.log("📍 NDC 좌표:", { ndcX, ndcY });

      // Raycaster 생성
      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(new THREE.Vector2(ndcX, ndcY), camera);
      console.log("🎯 Ray:", {
        origin: raycaster.ray.origin,
        direction: raycaster.ray.direction,
      });

      // Oblique 투영 행렬
      const obliqueMatrix = getObliqueMatrix();
      const inverseMatrix = obliqueMatrix.clone().invert();
      console.log("📐 Oblique 행렬:", obliqueMatrix);

      // Ray를 역변환하여 원본 좌표계로 변환
      const originalRayOrigin = raycaster.ray.origin
        .clone()
        .applyMatrix4(inverseMatrix);
      // 방향 벡터는 위치에 영향을 받지 않으므로 변환 행렬의 회전/스케일 부분만 적용
      const originalRayDirection = raycaster.ray.direction
        .clone()
        .transformDirection(inverseMatrix)
        .normalize();

      console.log("🔄 역변환된 Ray:", {
        origin: originalRayOrigin,
        direction: originalRayDirection,
      });

      // 바닥 평면 (y = -ROOM_HEIGHT / 2) - 원본 좌표계에서
      const floorY = -ROOM_HEIGHT / 2;
      const originalPlaneNormal = new THREE.Vector3(0, 1, 0);
      const originalPlanePoint = new THREE.Vector3(0, floorY, 0);
      console.log("🟦 원본 평면:", {
        normal: originalPlaneNormal,
        point: originalPlanePoint,
      });

      // 역변환된 Ray와 원본 평면의 교점 계산
      // backface culling 문제를 피하기 위해 수동으로 계산
      const denom = originalRayDirection.dot(originalPlaneNormal);

      if (Math.abs(denom) > 1e-6) {
        // Ray가 평면과 교차함
        const toPlane = originalPlanePoint.clone().sub(originalRayOrigin);
        const t = toPlane.dot(originalPlaneNormal) / denom;

        // t 값이 유효하면 교점 계산 (음수여도 Ray가 평면을 지나갈 수 있음)
        const intersectPoint = originalRayOrigin
          .clone()
          .addScaledVector(originalRayDirection, t);

        // 교점이 평면에 충분히 가까운지 확인
        const distanceToPlane = Math.abs(
          intersectPoint
            .clone()
            .sub(originalPlanePoint)
            .dot(originalPlaneNormal),
        );

        if (distanceToPlane < 0.1) {
          // 교점이 평면에 가까우면 유효한 교점으로 간주
          console.log("✅ 교점 계산 성공:", {
            intersectPoint,
            t,
            distanceToPlane,
          });

          // 그리드 좌표로 변환
          const gridSize = 1;
          const snappedX = Math.round(intersectPoint.x / gridSize) * gridSize;
          const snappedZ = Math.round(intersectPoint.z / gridSize) * gridSize;
          console.log("🎲 그리드 좌표:", { snappedX, snappedZ });

          // 실제 클릭 이벤트의 shiftKey 사용
          const syntheticEvent = {
            stopPropagation: () => {},
            shiftKey: e.shiftKey,
            point: intersectPoint,
          } as ThreeEvent<MouseEvent>;

          console.log("🚀 onCellClick 호출:", {
            shiftKey: e.shiftKey,
            x: snappedX,
            z: snappedZ,
          });
          onCellClick(syntheticEvent, snappedX, snappedZ);
        } else {
          console.warn("⚠️ 교점이 평면에서 너무 멀음:", {
            intersectPoint,
            distanceToPlane,
          });
        }
      } else {
        console.warn("⚠️ Ray와 평면이 평행함");
      }
    };

    gl.domElement.addEventListener("click", handleClick);
    return () => {
      gl.domElement.removeEventListener("click", handleClick);
    };
  }, [gl, camera, getObliqueMatrix, onCellClick]);

  // 프리셋 버튼 - #debug가 있을 때만 활성화
  useControls(
    "Presets" as const,
    {
      Isometric: button(() => {
        Object.assign(params, PRESETS.Isometric);
      }),
      Dimetric: button(() => {
        Object.assign(params, PRESETS.Dimetric);
      }),
      FrontOblique: button(() => {
        Object.assign(params, PRESETS.FrontOblique);
      }),
      Cabinet: button(() => {
        Object.assign(params, PRESETS.Cabinet);
      }),
    },
    { render: () => debugMode },
  );

  // Oblique 투영 적용 - 그리드 강조, 오브젝트에만 적용
  useObliqueProjection(gridHighlightGroupRef, params, getPanOffset);
  useObliqueProjection(objectGroupRef, params, getPanOffset);

  // 마우스 위치를 추적하여 바닥 평면과의 교점 계산
  useFrame(() => {
    if (!mousePosition) {
      if (lastGridCoordsRef.current) {
        lastGridCoordsRef.current = null;
        onCellPointerOut();
      }
      return;
    }

    // 정규화된 디바이스 좌표로 변환
    const rect = gl.domElement.getBoundingClientRect();
    const ndcX = ((mousePosition.x - rect.left) / rect.width) * 2 - 1;
    const ndcY = -((mousePosition.y - rect.top) / rect.height) * 2 + 1;

    // Raycaster 생성
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(new THREE.Vector2(ndcX, ndcY), camera);

    // Oblique 투영 행렬
    const obliqueMatrix = getObliqueMatrix();
    const inverseMatrix = obliqueMatrix.clone().invert();

    // Ray를 역변환하여 원본 좌표계로 변환
    const originalRayOrigin = raycaster.ray.origin
      .clone()
      .applyMatrix4(inverseMatrix);
    // 방향 벡터는 위치에 영향을 받지 않으므로 변환 행렬의 회전/스케일 부분만 적용
    const originalRayDirection = raycaster.ray.direction
      .clone()
      .transformDirection(inverseMatrix)
      .normalize();

    // 바닥 평면 (y = -ROOM_HEIGHT / 2) - 원본 좌표계에서
    const floorY = -ROOM_HEIGHT / 2;
    const originalPlaneNormal = new THREE.Vector3(0, 1, 0);
    const originalPlanePoint = new THREE.Vector3(0, floorY, 0);

    // 원본 평면 생성
    const plane = new THREE.Plane();
    plane.setFromNormalAndCoplanarPoint(
      originalPlaneNormal,
      originalPlanePoint,
    );

    // 역변환된 Ray와 원본 평면의 교점 계산
    const originalRay = new THREE.Ray(originalRayOrigin, originalRayDirection);
    const intersectPoint = new THREE.Vector3();
    const intersection = originalRay.intersectPlane(plane, intersectPoint);

    if (intersection) {
      // 교점은 이미 원본 좌표계에 있음

      // 그리드 좌표로 변환
      const gridSize = 1;
      const snappedX = Math.round(intersectPoint.x / gridSize) * gridSize;
      const snappedZ = Math.round(intersectPoint.z / gridSize) * gridSize;

      // 이전 좌표와 비교하여 변경된 경우에만 업데이트
      if (
        !lastGridCoordsRef.current ||
        lastGridCoordsRef.current.x !== snappedX ||
        lastGridCoordsRef.current.z !== snappedZ
      ) {
        lastGridCoordsRef.current = { x: snappedX, z: snappedZ };
        onCellPointerOver(snappedX, snappedZ);
        console.log("📍 그리드 호버:", { x: snappedX, z: snappedZ });
      }
    } else {
      // 교점이 없으면 호버 해제
      if (lastGridCoordsRef.current) {
        lastGridCoordsRef.current = null;
        onCellPointerOut();
      }
    }
  });

  // AxesHelper 추가
  useEffect(() => {
    const axesHelper = new THREE.AxesHelper(2);
    scene.add(axesHelper);
    return () => {
      scene.remove(axesHelper);
      axesHelper.dispose();
    };
  }, [scene]);

  return (
    <>
      <ObliqueCamera />
      <Lights />

      {/* 그리드 강조 메시 - 직접 렌더링 */}
      <group ref={gridHighlightGroupRef}>
        {hoveredCell && (
          <mesh
            position={[
              hoveredCell.x,
              -ROOM_HEIGHT / 2 + 0.05, // 바닥보다 더 위에 배치
              hoveredCell.z,
            ]}
            rotation={[-Math.PI / 2, 0, 0]}
            renderOrder={1000} // 항상 위에 렌더링
          >
            <planeGeometry args={[0.95, 0.95]} />
            <meshStandardMaterial
              color={isShiftPressed ? 0x00ff00 : 0x4a90e2}
              emissive={isShiftPressed ? 0x00ff00 : 0x4a90e2}
              emissiveIntensity={isShiftPressed ? 0.8 : 0.3}
              roughness={0.8}
              metalness={0.2}
              transparent
              opacity={isShiftPressed ? 1.0 : 0.7}
              depthTest={true} // 깊이 테스트 활성화
              depthWrite={false} // 깊이 버퍼에 쓰지 않음 (다른 객체를 가리지 않음)
            />
          </mesh>
        )}
      </group>

      {/* 오브젝트들 - Oblique 투영 적용 */}
      <group ref={objectGroupRef}>
        <InteractiveDisplayObjects
          dynamicCubes={cubes}
          onCubeClick={onCubeClick}
        />
      </group>
    </>
  );
}

export function ObliqueProjectionScene() {
  // Grid Interaction을 상위 레벨에서 관리하여 Canvas의 onPointerMissed에 전달
  const gridInteraction = useGridInteraction();
  const [mousePosition, setMousePosition] = useState<{
    x: number;
    y: number;
  } | null>(null);

  return (
    <div className="h-screen w-full">
      <Canvas
        shadows
        gl={{
          antialias: true,
        }}
        onPointerMove={(e) => {
          // 마우스 위치 추적
          setMousePosition({ x: e.clientX, y: e.clientY });
        }}
        onPointerLeave={() => {
          // 마우스가 Canvas를 벗어나면 호버 해제
          setMousePosition(null);
          gridInteraction.onCellPointerOut();
        }}
        onPointerMissed={() => {
          // 바닥을 벗어나면 호버 해제
          gridInteraction.onCellPointerOut();
        }}
      >
        <Scene
          gridInteraction={gridInteraction}
          mousePosition={mousePosition}
        />
      </Canvas>
    </div>
  );
}
