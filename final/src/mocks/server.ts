// 테스트 전용 mock 서버 코드 (Node.js 환경에서 사용)
// 사용 예:
// Vitest, Playwright 등에서 API를 가짜로 처리
// setupServer()로 실제 API 호출 없이 테스트

import { setupServer } from 'msw/node'
import { handlers } from './handler'

export const server = setupServer(...handlers)
