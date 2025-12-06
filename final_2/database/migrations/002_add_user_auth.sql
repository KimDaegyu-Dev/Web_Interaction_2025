-- ============================================
-- 사용자 인증 시스템 마이그레이션
-- ============================================
-- 이 마이그레이션은 password 기반 인증을 Supabase Auth로 전환합니다.
-- author와 sender 필드를 user_id로 변경합니다.

-- 1. buildings 테이블에 user_id 컬럼 추가
ALTER TABLE buildings 
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- 2. wreaths 테이블에 user_id 컬럼 추가
ALTER TABLE wreaths 
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

-- 3. user_id 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_buildings_user_id ON buildings(user_id);
CREATE INDEX IF NOT EXISTS idx_wreaths_user_id ON wreaths(user_id);

-- 4. 기존 RLS 정책 삭제
DROP POLICY IF EXISTS "Anyone can read buildings" ON buildings;
DROP POLICY IF EXISTS "Anyone can insert buildings" ON buildings;
DROP POLICY IF EXISTS "Update buildings with matching password" ON buildings;
DROP POLICY IF EXISTS "Delete buildings with matching password" ON buildings;

DROP POLICY IF EXISTS "Anyone can read wreaths" ON wreaths;
DROP POLICY IF EXISTS "Anyone can insert wreaths" ON wreaths;
DROP POLICY IF EXISTS "Anyone can update wreaths" ON wreaths;

-- 5. 새로운 RLS 정책 생성 (사용자 기반)

-- buildings 테이블 정책
-- 모든 사용자가 건물 읽기 가능
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

-- wreaths 테이블 정책
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

-- 6. 기존 데이터 마이그레이션 (선택사항)
-- 주의: 기존 데이터가 있는 경우, author/sender를 user_id로 매핑해야 합니다.
-- 이 부분은 수동으로 처리하거나 별도의 마이그레이션 스크립트가 필요할 수 있습니다.

-- 예시: author가 이메일인 경우 auth.users에서 찾아서 매핑
-- UPDATE buildings b
-- SET user_id = u.id
-- FROM auth.users u
-- WHERE b.author = u.email
-- AND b.user_id IS NULL;

-- 7. (선택사항) 기존 컬럼 제거
-- 주의: 기존 데이터를 마이그레이션한 후에만 실행하세요!
-- ALTER TABLE buildings DROP COLUMN IF EXISTS password;
-- ALTER TABLE buildings DROP COLUMN IF EXISTS author;
-- ALTER TABLE wreaths DROP COLUMN IF EXISTS sender;

-- 8. user_id를 NOT NULL로 변경 (기존 데이터 마이그레이션 후)
-- ALTER TABLE buildings ALTER COLUMN user_id SET NOT NULL;

