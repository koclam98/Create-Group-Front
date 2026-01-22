# 모임만들기 (Meeting Maker)

참여자와 모임을 관리하는 데스크톱 애플리케이션(Electron)입니다. React 프론트엔드와 Spring Boot 백엔드로 구성된 모노레포 프로젝트이며, Windows 설치형(`exe`) 프로그램을 제공합니다.

## 📋 프로젝트 개요

모임만들기는 참여자를 등록하고 모임을 생성 및 관리할 수 있는 애플리케이션입니다. 직관적인 그리드 뷰와 커스텀 모달을 통해 향상된 사용자 경험을 제공합니다.

### 주요 기능

- **참여자 관리**: 등록, 조회, 수정, 삭제 (프로필 이미지 관리)
- **모임 관리**: 생성, 조회, 수정, 삭제 (참석자 관리)
- **그리드 뷰**: 전체 참석자 현황을 한눈에 파악할 수 있는 대시보드 (새 창)
- **검색 및 필터링**: 이름/기수로 실시간 검색
- **일괄 작업**: 다중 선택 및 일괄 삭제
- **커스텀 모달**: 시스템 Alert 대신 비차단형(Non-blocking) 레이어 팝업 사용

## 🛠 기술 스택

### Frontend & Desktop

- **React 19** - UI 라이브러리
- **TypeScript 5.9** - 타입 안정성
- **Vite 7** - 초고속 빌드 도구
- **Electron 28** - 데스크톱 앱 프레임워크
- **Pure CSS** - CSS Variables 기반 커스텀 스타일링
- **HashRouter** - Electron 파일 시스템 라우팅 최적화

### Backend (Embedded)

- **Java 17** - 프로그래밍 언어
- **Spring Boot 3** - 백엔드 프레임워크
- **H2 Database** - 로컬 임베디드 데이터베이스
- **Gradle 8.5** - 빌드 자동화

## 📂 프로젝트 구조

```text
모임만들기/
├── src/                          # React Frontend
│   ├── electron/                 # Electron Main Process
│   │   └── main.cjs              # 앱 진입점 및 백엔드 프로세스 관리
│   ├── pages/                    # 페이지 컴포넌트
│   │   ├── HomePage.tsx          # 메인 대시보드
│   │   ├── ListPage.tsx          # 목록 및 등록
│   │   └── ...
│   ├── components/               # 재사용 UI 컴포넌트
│   │   └── ui/
│   │       ├── AlertModal.tsx    # 커스텀 알림 모달
│   │       └── ...
│   └── assets/                   # 정적 리소스 (아이콘, 기본 이미지)
│
├── server/                       # Spring Boot Backend
│   └── build/libs/               # 빌드된 JAR 파일 위치
│
├── build/                        # Electron 빌드 리소스 (아이콘 등)
├── release/                      # 배포 파일 (.exe) 출력 폴더
└── package.json                  # 의존성 및 빌드 스크립트
```

## 🚀 시작하기

### 1. 개발 환경 실행 (Dev Mode)

웹 브라우저 환경에서 프론트엔드만 빠르게 개발할 때 사용합니다.

```bash
# 의존성 설치
npm install

# React 개발 서버 실행
npm run dev
```

### 2. 데스크톱 앱 빌드 (Production)

Windows 설치 파일(`.exe`)을 생성합니다. 이 과정은 백엔드 JAR 파일과 프론트엔드 정적 파일을 모두 포함합니다.

```bash
# 1. 백엔드 빌드 (Java/Spring Boot)
cd server
./gradlew build
cd ..

# 2. 통합 빌드 및 패키징 (Clean Build + Package)
npm run package
```

> **빌드 결과물**: `release/meeting-app Setup 1.0.0.exe` 파일이 생성됩니다.

## 🗄️ 데이터베이스 스키마

- **Participant**: 참여자 정보 (이름, 기수, 연락처)
- **Profile**: 프로필 이미지 (Base64)
- **Meeting**: 모임 기본 정보
- **Meeting_Participants**: 모임-참여자 다대다 관계

## 📝 최근 업데이트 (v1.0.0)

### 🔄 Electron 최적화

- **HashRouter 전환**: `file://` 프로토콜 호환성을 위해 라우팅 방식 변경.
- **이미지 경로 개선**: 로컬 파일 시스템에서의 이미지 로딩 문제 해결.
- **Backend 통합**: Spring Boot JAR를 Electron 앱 내부에 내장하여 별도 서버 실행 없이 구동.

### 🎨 UI/UX 개선

- **커스텀 모달 도입**: 기존 `alert()` 창의 윈도우 포커스 충돌 문제 해결 및 디자인 통일성 확보.
- **그리드 뷰 네비게이션**: 새 창에서 최적화된 참석자 현황판 제공.

## 📄 라이선스

개인 프로젝트 (Private)

---

**최종 업데이트**: 2026-01-22
