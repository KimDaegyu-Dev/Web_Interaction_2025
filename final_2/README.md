# 아이소메트릭 도시 그리드 (Isometric City Grid)

React Three Fiber + Supabase를 사용한 실시간 협업 3D 도시 건설 앱

## 주요 기능

### 🏗️ CSG 기반 건물 시스템

- **12가지 건물 프리셋**: ㄱ자, ㄷ자, 타워, 계단형 등 다양한 형태
- **CSG Union 연산**: `three-bvh-csg`를 사용한 복합 지오메트리 생성
- **지오메트리 캐싱**: 싱글톤 패턴으로 동일 프리셋 재사용

### 🛣️ 도로 클러스터링 알고리즘

- **Union-Find 기반**: 인접 건물 그룹화
- **크기 제한**: 최대 3x5 블록 단위
- **GLSL 셰이더**: Full-Screen Quad로 도로 경계 렌더링

### 🎉 화환 물리 시뮬레이션

- **@react-three/cannon**: 2D 텍스처 이미지에 물리 적용
- **낙하 완료 감지**: 속도 기반으로 정지 상태 판별
- **최종 위치 저장**: 데이터베이스에 영구 저장

### 🔄 실시간 동기화

- **Supabase Realtime**: 건물/화환 CRUD 실시간 반영
- **Broadcast**: 다른 사용자 커서 위치 공유
- **RxJS 스로틀링**: 200ms 단위로 커서 업데이트 제한

## 기술 스택

- **Frontend**: React 19, TypeScript 5.8
- **3D**: React Three Fiber 9, Three.js, @react-three/drei
- **CSG**: three-bvh-csg
- **물리**: @react-three/cannon, cannon-es
- **텍스트**: troika-three-text
- **상태 관리**: Zustand 5, TanStack Query 5
- **스트림**: RxJS 7
- **스타일링**: Tailwind CSS 4
- **빌드**: Vite 7

## 프로젝트 구조

```
src/
├── pages/
│   ├── IsometricCityPage.tsx    # 메인 그리드 뷰
│   └── BuildingDetailPage.tsx    # 건물 상세 (2D 시점)
├── components/
│   ├── BuildingModal.tsx         # 건물 CRUD 모달
│   └── WreathModal.tsx           # 화환 생성 모달
├── stores/
│   ├── cameraStore.ts            # 카메라 상태
│   └── buildingStore.ts          # 건물 데이터 캐시
├── three/
│   ├── cameras/
│   │   └── IsometricCamera.tsx   # 아이소메트릭 카메라
│   ├── lights/
│   │   └── Lights.tsx            # 조명 설정
│   ├── config/
│   │   ├── grid.ts               # 그리드 설정
│   │   └── buildingPresets.ts    # 12가지 건물 프리셋
│   ├── components/
│   │   ├── DisplayObjects/
│   │   │   ├── BuildingModel.tsx       # CSG 건물 + 텍스트
│   │   │   ├── InteractiveBuildings.tsx
│   │   │   └── BuildingTooltip.tsx
│   │   ├── Grid/
│   │   │   ├── InfiniteBackground.tsx  # GLSL 도로 렌더링
│   │   │   └── GridHighlight.tsx       # 호버 하이라이트
│   │   ├── Wreath/
│   │   │   ├── WreathModel.tsx         # 물리 화환
│   │   │   └── WreathPhysics.tsx       # 물리 월드
│   │   └── RealtimeCursors.tsx         # 실시간 커서
│   ├── objectSystem/
│   │   └── CSGBuildingCache.ts   # CSG 지오메트리 캐시
│   ├── hooks/
│   │   ├── useBuildingPersistence.ts   # 건물 CRUD
│   │   ├── useWreathPersistence.ts     # 화환 CRUD
│   │   ├── useRealtimeCursors.ts       # 커서 브로드캐스트
│   │   ├── useGridInteraction.ts       # 그리드 인터랙션
│   │   └── useRoadClustering.ts        # 도로 클러스터링
│   └── utils/
│       └── clusteringAlgorithm.ts      # Union-Find 알고리즘
├── utils/
│   ├── index.ts                  # 유틸리티 함수
│   └── supabase.ts               # Supabase 클라이언트
└── apis/
    └── client.ts                 # API 클라이언트
```

## 설치 및 실행

```bash
# 의존성 설치
pnpm install

# 개발 서버 시작
pnpm dev

# 프로덕션 빌드
pnpm build
```

## 환경 변수

`.env` 파일을 생성하고 다음 변수를 설정하세요:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## 데이터베이스 설정

`database/schema.sql` 파일을 Supabase SQL Editor에서 실행하세요.

### 테이블 구조

**buildings** (건물)

- `id`: UUID
- `grid_x`, `grid_y`, `grid_z`: 그리드 좌표
- `mesh_index`: 건물 프리셋 인덱스 (0-11)
- `building_structure`: JSONB (복합 지오메트리 데이터)
- `building_text`: VARCHAR(10) (외벽 텍스트)
- `title`, `author`, `password`

**wreaths** (화환)

- `id`: UUID
- `building_id`: 연결된 건물 FK
- `message`, `sender`: 축하 메시지
- `final_position_x/y/z`: 물리 시뮬레이션 후 최종 위치

## 라이선스

MIT
