# Meeting Server (Spring Boot)

모임 관리 서버 - Spring Boot + JPA + H2

## 기술 스택

- Java 17
- Spring Boot 3.2.1
- Spring Data JPA
- H2 Database
- Lombok
- Gradle

## 실행 방법

### 1. Gradle로 실행

```bash
# Windows
gradlew.bat bootRun

# Mac/Linux
./gradlew bootRun
```

### 2. 빌드 후 실행

```bash
# 빌드
gradlew.bat build

# 실행
java -jar build/libs/meeting-0.0.1-SNAPSHOT.jar
```

## 서버 정보

- 서버 포트: `http://localhost:3000`
- H2 콘솔: `http://localhost:3000/h2-console`
  - JDBC URL: `jdbc:h2:file:./data/meeting`
  - Username: `sa`
  - Password: (비어있음)

## API 엔드포인트

### Participants (참여자)

- `GET /participants` - 모든 참여자 조회
- `GET /participants/{id}` - 특정 참여자 조회
- `POST /participants` - 참여자 생성
- `PATCH /participants/{id}` - 참여자 수정
- `DELETE /participants/{id}` - 참여자 삭제

### Profiles (프로필)

- `POST /profiles` - 프로필 생성
- `GET /profiles/participant/{participantId}` - 참여자의 프로필 조회
- `PATCH /profiles/participant/{participantId}` - 프로필 수정
- `DELETE /profiles/participant/{participantId}` - 프로필 삭제

### Meetings (모임)

- `GET /meetings` - 모든 모임 조회
- `GET /meetings/{id}` - 특정 모임 조회
- `GET /meetings/host/{hostId}` - 특정 호스트의 모임 조회
- `POST /meetings` - 모임 생성
- `PATCH /meetings/{id}` - 모임 수정
- `DELETE /meetings/{id}` - 모임 삭제

## 프로젝트 구조

```
src/main/java/com/example/meeting/
├── MeetingApplication.java          # 메인 애플리케이션
├── config/
│   └── WebConfig.java              # CORS 설정
├── domain/
│   ├── Participant.java            # 참여자 엔티티
│   ├── Profile.java                # 프로필 엔티티
│   └── Meeting.java                # 모임 엔티티
├── repository/
│   ├── ParticipantRepository.java
│   ├── ProfileRepository.java
│   └── MeetingRepository.java
├── dto/
│   ├── ParticipantDto.java
│   ├── ProfileDto.java
│   └── MeetingDto.java
├── service/
│   ├── ParticipantService.java
│   ├── ProfileService.java
│   └── MeetingService.java
└── controller/
    ├── ParticipantController.java
    ├── ProfileController.java
    └── MeetingController.java
```

## 데이터베이스 스키마

### Participant (참여자)
- id: String (UUID, PK)
- name: String
- season: String
- phone: String (Unique)
- createdAt: LocalDateTime
- updatedAt: LocalDateTime

### Profile (프로필)
- id: String (UUID, PK)
- imageUrl: String (Text)
- participantId: String (FK, Unique)

### Meeting (모임)
- id: String (UUID, PK)
- title: String
- desc: String (Text)
- date: LocalDateTime
- location: String
- hostId: String (FK)
- createdAt: LocalDateTime
- updatedAt: LocalDateTime

## 주의사항

- H2 데이터베이스는 파일 기반으로 `./data/meeting.mv.db`에 저장됩니다
- 첫 실행 시 테이블이 자동으로 생성됩니다 (ddl-auto: update)
- CORS는 `http://localhost:5173` (Vite 기본 포트)만 허용됩니다
