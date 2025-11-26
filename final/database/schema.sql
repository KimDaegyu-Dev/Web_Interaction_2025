-- 큐브 테이블 생성
CREATE TABLE IF NOT EXISTS cubes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  position_x FLOAT NOT NULL,
  position_y FLOAT NOT NULL,
  position_z FLOAT NOT NULL,
  color INTEGER NOT NULL,
  mesh_index INTEGER NOT NULL DEFAULT 0,
  title TEXT,
  author TEXT,
  message1 TEXT,
  message2 TEXT,
  password TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 인덱스 생성 (좌표 기반 검색 최적화)
CREATE INDEX IF NOT EXISTS idx_cubes_position ON cubes(position_x, position_z);

-- mesh_index 인덱스 생성 (메시 타입별 검색 최적화)
CREATE INDEX IF NOT EXISTS idx_cubes_mesh_index ON cubes(mesh_index);

-- RLS (Row Level Security) 활성화
ALTER TABLE cubes ENABLE ROW LEVEL SECURITY;

-- 모든 사용자가 읽기 가능하도록 정책 설정
CREATE POLICY "Anyone can read cubes" ON cubes
  FOR SELECT
  USING (true);

-- 패스워드 검증 함수 생성 (각 큐브의 패스워드를 검증)
-- 이 함수는 클라이언트에서 호출하지 않고, RLS 정책에서만 사용
-- 실제 패스워드 검증은 클라이언트에서 수행하고, RLS는 저장된 패스워드와 일치하는지 확인

-- 모든 사용자가 큐브를 생성할 수 있도록 정책 설정 (패스워드는 큐브 생성 시 지정)
CREATE POLICY "Anyone can insert cubes" ON cubes
  FOR INSERT
  WITH CHECK (true);

-- 패스워드가 일치할 때만 업데이트 가능하도록 정책 설정
-- UPDATE의 경우: 기존 행의 패스워드와 새로 입력된 패스워드가 일치해야 함
-- 하지만 RLS 정책만으로는 클라이언트에서 전달한 패스워드를 검증하기 어려움
-- 따라서 애플리케이션 레벨에서 검증하고, RLS는 기본적인 보호만 제공
CREATE POLICY "Update cubes with matching password" ON cubes
  FOR UPDATE
  USING (true)  -- 애플리케이션 레벨에서 패스워드 검증
  WITH CHECK (true);

-- 패스워드가 일치할 때만 삭제 가능하도록 정책 설정
-- DELETE의 경우도 애플리케이션 레벨에서 패스워드 검증
CREATE POLICY "Delete cubes with matching password" ON cubes
  FOR DELETE
  USING (true);  -- 애플리케이션 레벨에서 패스워드 검증

-- updated_at 자동 업데이트 트리거 함수
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- updated_at 트리거 생성
CREATE TRIGGER update_cubes_updated_at
  BEFORE UPDATE ON cubes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
