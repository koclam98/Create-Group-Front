# Create-Group-Front (Meeting App)

## 프로젝트 개요
모임/참여자 관리 데스크톱 앱. Electron + React 19 + Spring Boot 백엔드.

## 기술 스택
- **프론트엔드**: React 19, TypeScript 5.9, Vite 7, React Router 7 (HashRouter)
- **상태관리**: TanStack React Query v5
- **HTTP**: Axios (baseURL: localhost:9999)
- **데스크톱**: Electron 40
- **백엔드**: Spring Boot (Gradle) — `server/` 디렉토리
- **테스트**: Vitest + Testing Library
- **린트**: ESLint 9 + Prettier

## 디렉토리 구조
```
src/
├── app/          # App.tsx, main.tsx, 글로벌 CSS
├── pages/        # 라우트별 페이지 컴포넌트 + CSS
├── components/
│   ├── layout/   # Layout.tsx (Outlet 기반)
│   └── ui/       # 재사용 UI (Table, ProfileSlider, ProfileGrid, AlertModal)
├── features/     # 도메인별 기능 컴포넌트 (cast-slider)
├── hooks/        # 커스텀 훅 (useMeeting, useMeetingList, useParticipantForm, useGroupedParticipants)
├── services/     # API 서비스 (meetingService, participantService, profileService)
├── lib/          # axios 인스턴스
├── utils/        # format, sortUtils, storage
├── styles/       # 공통 CSS
├── assets/       # 이미지
└── electron/     # Electron main process
server/           # Spring Boot 백엔드 (Java)
```

## 도메인 모델
- **Participant**: id, name, position, season, phone, profile, meetings
- **Meeting**: id, title, desc, date, location, participants
- **Profile**: id, imageUrl, participantId

## 라우트
| 경로 | 페이지 | 설명 |
|---|---|---|
| `/` | HomePage | 메인 |
| `/list` | ListPage | 참여자 목록 |
| `/add` | AddPage | 참여자 추가 |
| `/dtl/:id` | DtlPage | 참여자 상세 |
| `/meetingDtl/:id` | MeetingDtlPage | 모임 상세 |
| `/grid/:id` | ParticipantGridPage | 참여자 그리드 |

## 컨벤션
- 서비스 파일: `xxxService.ts`에 API 호출 로직 집중
- 커스텀 훅: `useXxx.ts`에 상태 로직 캡슐화
- CSS: 페이지/컴포넌트 별 co-located CSS 파일
- 타입: 서비스 파일 내 interface 정의

## 빌드/실행
```bash
npm run dev            # Vite 개발 서버 (5173)
npm run build          # TypeScript 빌드 + Vite 빌드
npm run electron:dev   # Electron + Vite 동시 실행
npm run electron:build # Electron 앱 패키징
```

## 백엔드 (server/)
- Spring Boot, Gradle
- 포트: 9999
- 엔티티: Meeting, Participant, Profile
- 패키지: controller, repository, dto, config, util
