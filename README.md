# 모임만들기 (Meeting Maker)

참여자와 모임을 관리하는 풀스택 웹 애플리케이션입니다. React 프론트엔드와 Spring Boot 백엔드로 구성된 모노레포 프로젝트입니다.

## 📋 프로젝트 개요

모임만들기는 참여자를 등록하고 모임을 생성 및 관리할 수 있는 웹 애플리케이션입니다. 참여자 정보와 프로필 이미지를 관리하고, 여러 참여자를 선택하여 모임을 만들 수 있습니다.

### 주요 기능

- **참여자 관리**: 등록, 조회, 수정, 삭제 (프로필 이미지 포함)
- **모임 관리**: 생성, 조회, 수정, 삭제 (참석자 관리)
- **검색 및 필터링**: 이름/기수로 검색
- **일괄 작업**: 다중 선택 및 삭제
- **반응형 UI**: 모바일 친화적 디자인

## 🛠 기술 스택

### Frontend
- **React 19.2.0** - UI 라이브러리
- **TypeScript ~5.9.3** - 타입 안정성
- **Vite 7.2.4** - 빌드 도구 및 개발 서버
- **React Router 7.12.0** - 클라이언트 라우팅
- **TanStack Query 5.90.17** - 서버 상태 관리
- **Axios 1.13.2** - HTTP 클라이언트
- **Pure CSS** - CSS Variables 기반 스타일링

**개발 서버**: `http://localhost:5173`

### Backend
- **Java 17** - 프로그래밍 언어
- **Spring Boot 3.2.1** - 웹 프레임워크
- **Spring Data JPA** - ORM 추상화
- **H2 Database** - 임베디드 데이터베이스
- **Lombok** - 보일러플레이트 코드 감소
- **Gradle 8.5** - 빌드 자동화

**서버**: `http://localhost:3000`
**H2 콘솔**: `http://localhost:3000/h2-console`

## 📂 프로젝트 구조

```
모임만들기/
│
├── src/                          # React 프론트엔드 (TypeScript)
│   ├── app/                      # 애플리케이션 진입점
│   │   ├── App.tsx               # 메인 라우팅
│   │   ├── main.tsx              # React 진입점
│   │   ├── App.css               # 글로벌 레이아웃 스타일
│   │   └── index.css             # 테마 변수
│   │
│   ├── pages/                    # 페이지 컴포넌트
│   │   ├── HomePage.tsx          # 홈 페이지
│   │   ├── ListPage.tsx          # 참여자/모임 목록
│   │   ├── AddPage.tsx           # 참여자 등록
│   │   ├── DtlPage.tsx           # 참여자 상세
│   │   └── MeetingDtlPage.tsx    # 모임 상세
│   │
│   ├── components/               # 재사용 컴포넌트
│   │   ├── layout/
│   │   │   └── Layout.tsx        # 메인 레이아웃
│   │   └── ui/
│   │       ├── Table.tsx         # 제네릭 테이블
│   │       └── Table.css
│   │
│   ├── features/                 # 기능별 모듈
│   │   └── cast-slider/
│   │       ├── ImageSlider.tsx   # 이미지 캐러셀
│   │       └── ImageSlider.css
│   │
│   ├── services/                 # API 서비스
│   │   ├── meetingService.ts
│   │   ├── participantService.ts
│   │   └── profileService.ts
│   │
│   ├── lib/
│   │   └── api.ts                # Axios 인스턴스
│   │
│   ├── utils/
│   │   └── storage.ts            # LocalStorage 유틸
│   │
│   ├── styles/                   # 공통 스타일
│   │   └── common.css            # CSS 유틸리티 클래스
│   │
│   └── assets/                   # 정적 리소스
│
├── server/                       # Spring Boot 백엔드 (Java 17)
│   ├── src/main/
│   │   ├── java/com/example/meeting/
│   │   │   ├── MeetingApplication.java
│   │   │   │
│   │   │   ├── domain/           # JPA 엔티티
│   │   │   │   ├── Participant.java
│   │   │   │   ├── Profile.java
│   │   │   │   └── Meeting.java
│   │   │   │
│   │   │   ├── dto/              # 데이터 전송 객체
│   │   │   │   ├── ParticipantDto.java
│   │   │   │   ├── ProfileDto.java
│   │   │   │   ├── MeetingDto.java
│   │   │   │   ├── ErrorResponse.java
│   │   │   │   └── ValidationErrorResponse.java
│   │   │   │
│   │   │   ├── controller/       # REST 컨트롤러
│   │   │   │   ├── ParticipantController.java
│   │   │   │   ├── ProfileController.java
│   │   │   │   └── MeetingController.java
│   │   │   │
│   │   │   ├── service/          # 비즈니스 로직
│   │   │   │   ├── ParticipantService.java
│   │   │   │   ├── ProfileService.java
│   │   │   │   └── MeetingService.java
│   │   │   │
│   │   │   ├── repository/       # JPA 리포지토리
│   │   │   │   ├── ParticipantRepository.java
│   │   │   │   ├── ProfileRepository.java
│   │   │   │   └── MeetingRepository.java
│   │   │   │
│   │   │   ├── config/
│   │   │   │   └── WebConfig.java  # CORS 설정
│   │   │   │
│   │   │   ├── exception/        # 예외 처리
│   │   │   │   ├── GlobalExceptionHandler.java
│   │   │   │   ├── ResourceNotFoundException.java
│   │   │   │   └── DuplicateResourceException.java
│   │   │   │
│   │   │   └── util/
│   │   │       └── DateTimeUtil.java
│   │   │
│   │   └── resources/
│   │       └── application.yml
│   │
│   └── build.gradle
│
├── public/                       # 정적 웹 자산
├── package.json
├── vite.config.ts
├── tsconfig.json
├── index.html
└── README.md
```

## 🗄️ 데이터베이스 스키마

### 엔티티 관계
- **Participant ↔ Profile**: 일대일 (OneToOne)
- **Participant ↔ Meeting**: 다대다 (ManyToMany)

### 주요 테이블

**Participant (참여자)**
- id (UUID, PK)
- name (이름)
- season (기수)
- phone (연락처, Unique)
- created_at, updated_at

**Profile (프로필)**
- id (UUID, PK)
- image_url (Base64 이미지)
- participant_id (FK, Unique)

**Meeting (모임)**
- id (UUID, PK)
- title (모임명)
- desc (설명)
- date, location
- created_at, updated_at

**Meeting_Participants (조인 테이블)**
- meeting_id (FK)
- participant_id (FK)

## 🚀 시작하기

### 사전 요구사항
- Node.js 18.x 이상
- Java 17 이상
- Gradle 8.x 이상

### 프론트엔드 실행

```bash
# 의존성 설치
npm install

# 개발 서버 실행 (http://localhost:5173)
npm run dev

# 프로덕션 빌드
npm run build

# 린트 실행
npm run lint
```

### 백엔드 실행

```bash
# 서버 디렉토리로 이동
cd server

# Spring Boot 애플리케이션 실행 (http://localhost:3000)
./gradlew bootRun

# 또는 JAR 빌드 후 실행
./gradlew build
java -jar build/libs/meeting-0.0.1-SNAPSHOT.jar
```

### H2 데이터베이스 콘솔

```
URL: http://localhost:3000/h2-console
JDBC URL: jdbc:h2:file:./data/meeting
Username: sa
Password: (비워두기)
```

## 🔌 API 엔드포인트

### 참여자 (Participants)
- `GET /participants` - 모든 참여자 조회
- `GET /participants/{id}` - 특정 참여자 조회
- `POST /participants` - 참여자 생성
- `PATCH /participants/{id}` - 참여자 수정
- `DELETE /participants/{id}` - 참여자 삭제

### 프로필 (Profiles)
- `GET /profiles` - 모든 프로필 조회
- `POST /profiles` - 프로필 생성
- `PUT /profiles/{participantId}` - 프로필 수정
- `DELETE /profiles/{participantId}` - 프로필 삭제

### 모임 (Meetings)
- `GET /meetings` - 모든 모임 조회
- `GET /meetings/{id}` - 특정 모임 조회
- `POST /meetings` - 모임 생성
- `PATCH /meetings/{id}` - 모임 수정
- `DELETE /meetings/{id}` - 모임 삭제

## 🎨 디자인 시스템

### 컬러 팔레트
CSS 변수로 관리되는 4가지 핵심 컬러 (`src/app/index.css`)

- **Background**: `#F1F5F9` (Light Slate)
- **Surface**: `#FFFFFF` (White)
- **Accent**: `#0284C7` (Deep Sky Blue)
- **Text**: `#0F172A` (Deep Navy)

### 스타일 시스템
- **CSS Variables**: 테마 색상 관리
- **공통 CSS 클래스**: 재사용 가능한 유틸리티 (`src/styles/common.css`)
- **컴포넌트별 CSS**: 페이지/컴포넌트 전용 스타일
- **반응형 디자인**: 모바일 우선 접근

## 🏗️ 아키텍처

### 프론트엔드
- **Feature-Based Structure**: 기능별 코드 구성
- **Service Layer Pattern**: API 호출 추상화
- **Type Safety**: TypeScript 인터페이스 활용

### 백엔드
- **Layered Architecture**: Controller → Service → Repository
- **DTO Pattern**: API 계약과 도메인 분리
- **Global Exception Handler**: 중앙화된 예외 처리
- **JPA Relationships**: 엔티티 간 관계 관리

## 📊 주요 특징

### 강점
1. **타입 안정성**: TypeScript로 컴파일 타임 에러 방지
2. **코드 품질**: ESLint, Prettier, JavaDoc 활용
3. **확장성**: 레이어드 아키텍처로 확장 용이
4. **사용자 경험**: 반응형 디자인, 이미지 슬라이더
5. **데이터 무결성**: JPA 관계 및 유효성 검사

### 개선 가능 영역
- 전역 상태 관리 (Redux, Zustand 등)
- 프로덕션 DB (PostgreSQL, MySQL)
- 인증/인가 (Spring Security, JWT)
- 테스트 커버리지 (Jest, JUnit)
- CI/CD 파이프라인

## 📝 최근 리팩토링

### Frontend
- 인라인 스타일을 CSS 클래스로 분리
- 공통 CSS 유틸리티 클래스 생성 (`common.css`)
- 상수 추출 및 코드 가독성 개선
- 타이포 수정 (`formtDate` → `formatDate`)

### Backend
- 모든 클래스/메서드에 JavaDoc 추가
- Global Exception Handler 구현
- 유효성 검사 어노테이션 추가
- 디버그 코드 제거 (System.out.println)
- 일관된 코드 포맷팅

## 📄 라이선스

개인 프로젝트

---

**최종 업데이트**: 2026-01-19
