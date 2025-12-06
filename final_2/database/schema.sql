-- ============================================
-- 아이소메트릭 도시 그리드 데이터베이스 스키마
-- ============================================

-- 큐브(건물) 테이블 생성
CREATE TABLE IF NOT EXISTS buildings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  position_x FLOAT NOT NULL,
  position_y FLOAT NOT NULL,
  position_z FLOAT NOT NULL,
  color INTEGER NOT NULL,
  mesh_index INTEGER NOT NULL DEFAULT 0,
  -- 신규 필드: 건물 구조 (CSG용 JSONB)
  building_structure JSONB,
  -- 신규 필드: 건물 외벽 텍스트 (최대 50자)
  building_text VARCHAR(50),
  title TEXT,
  message1 TEXT,
  message2 TEXT,
  -- 사용자 인증: Supabase Auth의 user_id 참조
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 인덱스 생성 (좌표 기반 검색 최적화)
CREATE INDEX IF NOT EXISTS idx_buildings_position ON buildings(position_x, position_z);

-- mesh_index 인덱스 생성 (메시 타입별 검색 최적화)
CREATE INDEX IF NOT EXISTS idx_buildings_mesh_index ON buildings(mesh_index);

-- user_id 인덱스 생성 (사용자별 건물 조회 최적화)
CREATE INDEX IF NOT EXISTS idx_buildings_user_id ON buildings(user_id);

-- RLS (Row Level Security) 활성화
ALTER TABLE buildings ENABLE ROW LEVEL SECURITY;

-- 모든 사용자가 읽기 가능하도록 정책 설정
CREATE POLICY "Anyone can read buildings" ON buildings
  FOR SELECT
  USING (true);

-- 인증된 사용자만 건물 생성 가능 (자신의 user_id로)
CREATE POLICY "Authenticated users can insert buildings" ON buildings
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 건물 소유자만 수정 가능
CREATE POLICY "Building owners can update buildings" ON buildings
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 건물 소유자만 삭제 가능
CREATE POLICY "Building owners can delete buildings" ON buildings
  FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- 화환(Wreath) 테이블 생성
-- ============================================

CREATE TABLE IF NOT EXISTS wreaths (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  building_id UUID NOT NULL REFERENCES buildings(id) ON DELETE CASCADE,
  message TEXT,                           -- 축하하는 말
  -- 사용자 인증: Supabase Auth의 user_id 참조
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE SET NULL,
  -- 물리 시뮬레이션 후 최종 위치 저장
  final_position_x FLOAT,
  final_position_y FLOAT,
  final_position_z FLOAT,
  dropped_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 건물 ID 기반 인덱스 (특정 건물의 화환 조회 최적화)
CREATE INDEX IF NOT EXISTS idx_wreaths_building_id ON wreaths(building_id);

-- user_id 인덱스 생성 (사용자별 화환 조회 최적화)
CREATE INDEX IF NOT EXISTS idx_wreaths_user_id ON wreaths(user_id);

-- RLS 활성화
ALTER TABLE wreaths ENABLE ROW LEVEL SECURITY;

-- 모든 사용자가 화환 읽기 가능
CREATE POLICY "Anyone can read wreaths" ON wreaths
  FOR SELECT
  USING (true);

-- 인증된 사용자만 화환 생성 가능 (자신의 user_id로)
CREATE POLICY "Authenticated users can insert wreaths" ON wreaths
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 화환 소유자만 수정 가능 (최종 위치 저장용)
CREATE POLICY "Wreath owners can update wreaths" ON wreaths
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ============================================
-- 트리거 함수
-- ============================================

-- updated_at 자동 업데이트 트리거 함수
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- buildings 테이블 updated_at 트리거
CREATE TRIGGER update_buildings_updated_at
  BEFORE UPDATE ON buildings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- Realtime 활성화
-- ============================================

-- buildings 테이블 Realtime 활성화
ALTER PUBLICATION supabase_realtime ADD TABLE buildings;

-- wreaths 테이블 Realtime 활성화
ALTER PUBLICATION supabase_realtime ADD TABLE wreaths;
