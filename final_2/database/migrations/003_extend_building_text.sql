-- ============================================
-- 건물 외벽 텍스트 길이 확장 마이그레이션
-- ============================================
-- building_text를 VARCHAR(10)에서 VARCHAR(50)으로 확장

-- building_text 컬럼 타입 변경
ALTER TABLE buildings 
ALTER COLUMN building_text TYPE VARCHAR(50);

