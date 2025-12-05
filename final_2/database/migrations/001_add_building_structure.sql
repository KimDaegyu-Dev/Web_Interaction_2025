-- ============================================
-- Migration: 건물 구조 및 텍스트 필드 추가
-- ============================================

-- building_structure 필드 추가 (JSONB)
-- 각 건물을 구성하는 Box들의 위치, 크기 정보를 저장
-- 예: [{"position": [0, 0, 0], "scale": [1, 2, 1]}, {"position": [1, 0, 0], "scale": [1, 1, 1]}]
ALTER TABLE buildings
ADD COLUMN IF NOT EXISTS building_structure JSONB;

-- building_text 필드 추가 (최대 10자)
-- 건물 외벽에 렌더링될 텍스트
ALTER TABLE buildings
ADD COLUMN IF NOT EXISTS building_text VARCHAR(10);

-- 기존 건물에 대해 mesh_index 기반으로 기본 building_structure 설정
-- (실제로는 애플리케이션에서 프리셋 기반으로 설정)
COMMENT ON COLUMN buildings.building_structure IS '건물을 구성하는 Box들의 배열. 각 Box는 position과 scale을 가짐.';
COMMENT ON COLUMN buildings.building_text IS '건물 외벽에 표시될 텍스트 (최대 10자)';
