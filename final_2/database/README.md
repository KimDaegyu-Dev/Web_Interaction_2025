# 데이터베이스 스키마

이 폴더에는 Supabase PostgreSQL 데이터베이스 스키마가 포함되어 있습니다.

## 테이블 구조

### buildings (건물)

| 필드               | 타입        | 설명                      |
| ------------------ | ----------- | ------------------------- |
| id                 | UUID        | Primary Key               |
| position_x/y/z     | FLOAT       | 건물 위치                 |
| color              | INTEGER     | 건물 색상                 |
| mesh_index         | INTEGER     | 건물 프리셋 인덱스 (0-11) |
| building_structure | JSONB       | CSG용 Box 배열            |
| building_text      | VARCHAR(10) | 외벽 텍스트 (최대 10자)   |
| title              | TEXT        | 건물 이름                 |
| author             | TEXT        | 작성자                    |
| password           | TEXT        | 수정/삭제용 비밀번호      |

### wreaths (화환)

| 필드                 | 타입      | 설명                         |
| -------------------- | --------- | ---------------------------- |
| id                   | UUID      | Primary Key                  |
| building_id          | UUID      | 연결된 건물 ID (FK)          |
| message              | TEXT      | 축하 메시지                  |
| sender               | TEXT      | 보낸 사람                    |
| final_position_x/y/z | FLOAT     | 물리 시뮬레이션 후 최종 위치 |
| dropped_at           | TIMESTAMP | 화환 드롭 시간               |

## 설정 방법

1. Supabase 프로젝트 생성
2. SQL Editor에서 `schema.sql` 실행
3. `.env` 파일에 Supabase URL과 Anon Key 설정
