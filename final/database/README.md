# Database Schema

이 디렉토리는 Supabase 데이터베이스 스키마와 마이그레이션 파일을 포함합니다.

## 파일 구조

- `schema.sql`: 전체 데이터베이스 스키마 (새 데이터베이스 생성용)
- `migrations/`: 데이터베이스 마이그레이션 파일들

## 스키마 적용 방법

### 새 데이터베이스 생성 시

1. Supabase 대시보드에 로그인
2. SQL Editor로 이동
3. `schema.sql` 파일의 내용을 복사하여 실행

### 기존 데이터베이스 업데이트 시

1. Supabase 대시보드에 로그인
2. SQL Editor로 이동
3. `migrations/` 디렉토리의 마이그레이션 파일을 순서대로 실행

## Cubes 테이블 구조

| 컬럼명 | 타입 | 설명 |
|--------|------|------|
| id | UUID | 고유 식별자 (자동 생성) |
| position_x | FLOAT | X 좌표 |
| position_y | FLOAT | Y 좌표 |
| position_z | FLOAT | Z 좌표 |
| color | INTEGER | 색상 코드 |
| mesh_index | INTEGER | 메시 인덱스 (0-12) |
| title | TEXT | 제목 (선택) |
| author | TEXT | 작성자 (선택) |
| message1 | TEXT | 메시지 1 (선택) |
| message2 | TEXT | 메시지 2 (선택) |
| password | TEXT | 비밀번호 (수정/삭제용) |
| created_at | TIMESTAMP | 생성 시간 |
| updated_at | TIMESTAMP | 수정 시간 |

## 메시 인덱스

`mesh_index` 컬럼은 `building.glb` 파일에서 렌더링할 메시를 지정합니다:

- 0: Cube.138
- 1: Cube
- 2: Cube.085
- 3: Cube.121
- 4: Cube.001
- 5: Cube.135
- 6: Plane.043
- 7: Plane.038
- 8: Cube.002
- 9: Cube.004
- 10: Cube.035
- 11: Cube.003
- 12: Cube.039

## 인덱스

성능 최적화를 위해 다음 인덱스가 생성됩니다:

- `idx_cubes_position`: 좌표 기반 검색 최적화 (position_x, position_z)
- `idx_cubes_mesh_index`: 메시 타입별 검색 최적화

## Row Level Security (RLS)

- **읽기**: 모든 사용자가 가능
- **생성**: 모든 사용자가 가능
- **수정/삭제**: 애플리케이션 레벨에서 비밀번호 검증 필요
