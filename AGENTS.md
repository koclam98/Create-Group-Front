# AGENTS.md — Sub-Agent 분배 설정

## Agent 라우팅 규칙

### executor (haiku) — 기능 구현
- **담당**: 페이지/컴포넌트/훅/서비스 코드 작성 및 수정
- **파일 범위**: `src/pages/`, `src/components/`, `src/hooks/`, `src/services/`, `src/features/`
- **트리거 키워드**: 추가, 수정, 구현, 만들어, 변경, CRUD
- **원칙**: 기존 서비스/훅 패턴 따르기, TanStack Query 활용

### designer (haiku) — UI/UX
- **담당**: CSS 스타일링, 레이아웃 조정, 반응형 대응, UI 컴포넌트
- **파일 범위**: `src/pages/*.css`, `src/components/ui/`, `src/styles/`, `src/app/*.css`
- **트리거 키워드**: 디자인, 스타일, CSS, 레이아웃, UI, 반응형, 해상도
- **원칙**: co-located CSS, 기존 디자인 패턴 유지

### architect (haiku) — 구조 설계
- **담당**: 아키텍처 결정, 디렉토리 구조 변경, 리팩토링 전략, 기술 선택
- **파일 범위**: 전체 (READ-ONLY로 분석 후 계획 제시)
- **트리거 키워드**: 설계, 구조, 아키텍처, 리팩토링, 분리
- **원칙**: 현재 규모에 맞는 단순한 구조 유지, 과도한 추상화 금지

### debugger (haiku) — 디버깅
- **담당**: 런타임 에러 추적, API 연동 이슈, 빌드 에러, Electron 이슈
- **파일 범위**: 전체
- **트리거 키워드**: 에러, 버그, 안됨, 오류, 크래시, 디버그
- **원칙**: 증거 기반 원인 추적, 재현 → 원인 분석 → 수정

### test-engineer (haiku) — 테스트
- **담당**: 단위/통합 테스트 작성, 테스트 실행 및 검증
- **파일 범위**: `src/**/*.test.ts(x)`, `src/setupTests.ts`
- **트리거 키워드**: 테스트, 검증, vitest, 커버리지
- **도구**: Vitest + @testing-library/react
- **원칙**: 사용자 행동 기반 테스트, 구현 디테일 테스트 금지

### code-reviewer (haiku) — 코드 리뷰
- **담당**: PR 리뷰, 코드 품질 체크, 보안 검토
- **트리거 키워드**: 리뷰, 검토, 확인

## 도메인별 파일 매핑

| 도메인 | 서비스 | 훅 | 페이지 |
|---|---|---|---|
| 참여자 | participantService.ts | useParticipantForm.ts, useGroupedParticipants.ts | ListPage, AddPage, DtlPage, ParticipantGridPage |
| 모임 | meetingService.ts | useMeeting.ts, useMeetingList.ts | MeetingDtlPage, HomePage |
| 프로필 | profileService.ts | — | — |

## 병렬 실행 가이드

독립적인 작업은 병렬로 실행:
- UI 변경 + 서비스 로직 변경 → designer + executor 병렬
- 기능 구현 + 테스트 작성 → executor 먼저, 완료 후 test-engineer
- 다중 페이지 수정 → 페이지별 executor 병렬 (worktree 격리)
