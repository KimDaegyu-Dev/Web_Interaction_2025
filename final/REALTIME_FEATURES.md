# Real-time Multiplayer Features Setup

이 프로젝트에는 Supabase를 이용한 실시간 멀티플레이어 기능이 포함되어 있습니다.

## 기능

### 1. 실시간 커서 (Real-time Cursors)
- 현재 접속 중인 다른 사용자들의 마우스 위치가 그리드 위에서 **반짝이는 빛(Point Light)**으로 표현됩니다
- 각 사용자는 랜덤한 색상의 커서를 가집니다
- 커서는 부드럽게 펄스하고 떠다니는 애니메이션 효과가 있습니다
- 10초 이상 업데이트되지 않은 커서는 자동으로 정리됩니다

### 2. 공용 스위치 (Global Light Switch)
- 그리드 왼쪽 아래 구석(-10, 0, -10)에 **전등 스위치** 오브젝트가 있습니다
- 누군가 이 스위치를 클릭하면 **실시간으로 모든 접속자의 화면 모드(Dark/Light)가 바뀝니다**
- Light Mode: 밝은 배경, 높은 ambient light
- Dark Mode: 어두운 배경, 낮은 ambient light

## Supabase 설정

### 1. 테이블 생성

Supabase 대시보드의 SQL Editor에서 `supabase_realtime_setup.sql` 파일의 내용을 실행하세요:

```sql
-- 파일 내용을 복사해서 실행
```

이 스크립트는 다음을 생성합니다:
- `cursors` 테이블: 실시간 커서 위치 저장
- `global_switch` 테이블: 전역 스위치 상태 저장
- Row Level Security (RLS) 정책
- Real-time 구독 활성화
- 자동 타임스탬프 업데이트 트리거

### 2. Real-time 활성화 확인

Supabase 대시보드에서:
1. **Database** → **Replication** 메뉴로 이동
2. `cursors`와 `global_switch` 테이블이 활성화되어 있는지 확인
3. 활성화되어 있지 않다면 토글을 켜주세요

### 3. 환경 변수 설정

`.env` 파일에 Supabase 정보가 설정되어 있는지 확인:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 사용 방법

### 실시간 커서
- 그리드 위로 마우스를 움직이면 자동으로 커서 위치가 업데이트됩니다
- 다른 사용자들의 커서가 색색의 빛으로 표시됩니다
- 각 커서는 부드럽게 펄스하며 떠다닙니다

### 공용 스위치
1. 그리드 왼쪽 아래 구석에 있는 빛나는 구체를 찾으세요
2. 구체를 클릭하면 모든 사용자의 화면이 Light/Dark 모드로 전환됩니다
3. 스위치 색상:
   - 🟡 Gold: Light Mode
   - 🔵 Blue: Dark Mode

## 기술 스택

- **Supabase Real-time**: PostgreSQL의 변경사항을 실시간으로 구독
- **React Three Fiber**: 3D 렌더링
- **Custom Hooks**:
  - `useRealtimeCursors`: 커서 위치 동기화
  - `useGlobalSwitch`: 전역 스위치 상태 관리

## 성능 최적화

- 커서 업데이트는 100ms로 throttle되어 있습니다 (초당 10회)
- 오래된 커서는 5초마다 자동으로 정리됩니다
- Supabase Real-time은 초당 10개 이벤트로 제한되어 있습니다

## 문제 해결

### 커서가 보이지 않아요
1. Supabase 테이블이 올바르게 생성되었는지 확인
2. Real-time이 활성화되어 있는지 확인
3. 브라우저 콘솔에서 에러 메시지 확인

### 스위치가 작동하지 않아요
1. `global_switch` 테이블에 초기 데이터가 있는지 확인
2. RLS 정책이 올바르게 설정되었는지 확인
3. Real-time 구독이 활성화되어 있는지 확인

## 향후 개선 사항

- [ ] 사용자 이름 표시
- [ ] 커서 클릭 이벤트 공유
- [ ] 채팅 기능
- [ ] 더 많은 공용 인터랙션 오브젝트
