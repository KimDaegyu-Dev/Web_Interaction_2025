# Oblique Projection Scene - React Three Fiber

Week 9에서 리팩토링한 Oblique 투영 코드를 React Three Fiber로 변환한 프로젝트입니다.

## 🎯 프로젝트 구조

```
src/three/
├── config/
│   ├── constants.ts          # 상수 정의 (방 크기, 높이 등)
│   ├── types.ts              # TypeScript 타입 정의
│   └── presets.ts            # 투영 프리셋 (Isometric, Dimetric 등)
├── components/
│   ├── Room/
│   │   ├── Floor.tsx         # 바닥 컴포넌트
│   │   ├── Ceiling.tsx       # 천장 컴포넌트
│   │   ├── Walls.tsx         # 벽 컴포넌트
│   │   └── index.tsx         # Room 통합 컴포넌트
│   ├── DisplayObjects/
│   │   ├── Cube.tsx          # 일반 큐브
│   │   ├── InteractiveCube.tsx  # 호버 애니메이션 큐브
│   │   ├── Pedestal.tsx      # 받침대
│   │   ├── InteractiveDisplayObjects.tsx  # 통합 인터랙티브 오브젝트
│   │   └── index.tsx
│   └── Decorations/
│       ├── FloorPattern.tsx  # 체크무늬 바닥
│       ├── WallArt.tsx       # 벽 액자
│       ├── LightFixture.tsx  # 조명 장식
│       ├── Pillars.tsx       # 기둥
│       └── index.tsx
├── lights/
│   └── Lights.tsx            # 모든 조명 설정
├── cameras/
│   └── MainCamera.tsx        # 메인 orthographic 카메라
├── hooks/
│   ├── useObliqueProjection.ts  # Oblique 투영 훅
│   └── useHoverInteraction.ts   # 호버 인터랙션 훅
├── utils/
│   └── projection.ts         # 투영 행렬 계산 유틸리티
└── ObliqueProjectionScene.tsx  # 메인 씬 컴포넌트
```

## ✨ 주요 기능

### 1. **Oblique 투영**
- 사용자 정의 가능한 축 각도 (thetaX, thetaY, thetaZ)
- 축별 스케일 조정 (scaleX, scaleY, scaleZ)
- 실시간 투영 행렬 계산 및 적용

### 2. **프리셋**
- **Isometric**: 표준 등각투영 (30°-30°)
- **Dimetric**: 비대칭 축 투영
- **Front Oblique**: 정면 경사투영
- **Cabinet**: 캐비닛 투영 (깊이 0.5배)

### 3. **인터랙션**
- 마우스 호버 시 큐브 스케일 애니메이션
- React Spring을 이용한 부드러운 전환
- 두 개의 회전하는 큐브 (서로 다른 속도)

### 4. **3D 갤러리 룸**
- 바닥, 천장, 4면 벽
- 체크무늬 바닥 패턴
- 벽에 걸린 발광 액자 2개
- 4개의 모서리 기둥
- 천장 조명 장식

### 5. **라이팅 시스템**
- Ambient Light: 전체 기본 조명
- Point Lights: 메인 조명 + 애니메이션 악센트 조명 2개
- Directional Light: 그림자 생성용
- 실시간 조명 강도 애니메이션

## 🚀 실행 방법

```bash
# 의존성 설치 (이미 완료)
npm install

# 개발 서버 실행
npm run dev

# http://localhost:5173 접속
```

## 🎮 사용법

### GUI 컨트롤 (Leva)
화면 오른쪽 상단에 GUI 패널이 표시됩니다:

#### Projection 폴더
- **thetaX**: X축 투영 각도 (0-360°)
- **thetaY**: Y축 투영 각도 (0-360°)
- **thetaZ**: Z축 투영 각도 (0-360°)
- **scaleX**: X축 스케일 (0.1-2)
- **scaleY**: Y축 스케일 (0.1-2)
- **scaleZ**: Z축 스케일 (0.1-2)

#### Presets 폴더
- **Isometric** 버튼: 등각투영
- **Dimetric** 버튼: 이등각투영
- **FrontOblique** 버튼: 정면 경사투영
- **Cabinet** 버튼: 캐비닛 투영

### 마우스 인터랙션
- 큐브에 마우스를 올리면 크기가 1.2배로 확대
- 마우스를 떼면 원래 크기로 복원
- 부드러운 spring 애니메이션

## 🔧 기술 스택

### Core
- **React 19**: UI 라이브러리
- **TypeScript**: 타입 안전성
- **Vite**: 빌드 도구

### 3D Graphics
- **Three.js**: 3D 렌더링 엔진
- **React Three Fiber (R3F)**: React용 Three.js 렌더러
- **@react-three/drei**: R3F 헬퍼 라이브러리

### UI/Animation
- **Leva**: GUI 컨트롤
- **@react-spring/three**: 3D 애니메이션

## 📚 코드 구조 설명

### 컴포넌트 패턴

#### 1. **선언적 3D 구성**
```tsx
<mesh position={[0, 0, 0]} castShadow receiveShadow>
  <boxGeometry args={[1, 1, 1]} />
  <meshStandardMaterial color={0x6c5ce7} />
</mesh>
```

#### 2. **커스텀 훅**
```tsx
// Oblique 투영 적용
const { panOffset } = useObliqueProjection(groupRef, params);

// 호버 인터랙션
const { onPointerOver, onPointerOut } = useHoverInteraction();
```

#### 3. **애니메이션 (useFrame)**
```tsx
useFrame(() => {
  if (meshRef.current) {
    meshRef.current.rotation.x += 0.01;
  }
});
```

### 투영 시스템

#### 행렬 계산
```typescript
// utils/projection.ts
export function calculateObliqueMatrix(
  params: ProjectionParams,
  panOffset: THREE.Vector3
): THREE.Matrix4
```

#### 실시간 적용
```typescript
// hooks/useObliqueProjection.ts
useFrame(() => {
  if (groupRef.current) {
    const matrix = calculateObliqueMatrix(params);
    applyObliqueProjection(groupRef.current, matrix);
  }
});
```

## 🎨 스타일링

- **배경**: `#1a1a2e` (어두운 네이비)
- **바닥**: `#2d3436` (회색) + 체크무늬 `#1e272e`
- **벽**: `#3d5a80` (파란 회색)
- **큐브 1**: `#6c5ce7` (보라)
- **큐브 2**: `#ff6b9d` (핑크)
- **액자**: `#e74c3c` (빨강), `#3498db` (파랑)

## 🔄 Week 9에서 달라진 점

### Before (Vanilla Three.js)
```javascript
// 명령형 스타일
const cube = new THREE.Mesh(geometry, material);
cube.position.set(0, 0, 0);
scene.add(cube);

// 애니메이션 루프
function animate() {
  cube.rotation.x += 0.01;
  renderer.render(scene, camera);
}
```

### After (React Three Fiber)
```tsx
// 선언적 스타일
<Cube position={[0, 0, 0]} rotationSpeed={[0.01, 0.01]} />

// useFrame 훅으로 애니메이션
useFrame(() => {
  meshRef.current.rotation.x += 0.01;
});
```

### 장점
1. **컴포넌트 재사용**: 각 요소를 독립적인 React 컴포넌트로
2. **선언적 구조**: JSX로 씬 계층 구조 명확하게 표현
3. **React 생태계**: 훅, 상태 관리, 라이프사이클 활용
4. **타입 안전성**: TypeScript로 타입 체크
5. **Hot Module Replacement**: 빠른 개발 피드백

## 📝 라이센스

MIT

## 👨‍💻 개발자

Week 9 프로젝트를 React Three Fiber로 현대화한 버전입니다.

