# Backend Server (NestJS + Prisma + SQLite)

이 프로젝트는 `NestJS`, `Prisma`, `SQLite`를 사용하여 구축된 백엔드 서버입니다.
별도의 DB 설치 없이 로컬 파일(`prisma/dev.db`)을 데이터베이스로 사용하므로 이동성이 뛰어납니다.

## 🚀 시작하기 (Getting Started)

### 1. 설치 (Installation)

프로젝트 의존성을 설치합니다.

```bash
cd server
npm install
```

### 2. 패키지 실행 (Running the app)

**개발 모드 실행 (추천)**

```bash
npm run start:dev
```

서버는 기본적으로 `http://localhost:3000`에서 실행됩니다.

### 3. 데이터베이스 설정 (Database Setup)

이 프로젝트는 **SQLite**를 사용합니다. 별도의 설치가 필요 없으며, `prisma/dev.db` 파일이 데이터베이스 자체입니다.

**최초 실행 시 또는 스키마 변경 시:**

```bash
# DB 파일 생성 및 테이블 구조 반영
npx prisma migrate dev --name init
```

**Prisma Studio 실행 (DB 데이터 확인용 GUI):**

```bash
npx prisma studio
```

브라우저에서 `http://localhost:5555`로 접속하여 데이터를 시각적으로 관리할 수 있습니다.

---

## 📂 프로젝트 구조 (Project Structure)

- `src/`: NestJS 소스 코드
- `prisma/schema.prisma`: 데이터베이스 모델 정의
- `prisma/dev.db`: **실제 데이터가 저장되는 파일 (삭제 주의)**

---

## 🚚 프로젝트 이동 시 주의사항 (Portability)

다른 PC로 프로젝트를 옮길 때는 `server` 폴더를 통째로 복사하면 됩니다.
단, `node_modules` 폴더는 복사하지 말고 새 PC에서 `npm install`을 수행하는 것이 좋습니다.

**중요**: `prisma/dev.db` 파일이 함께 이동되어야 기존 데이터가 유지됩니다. 만약 데이터를 초기화하고 싶다면 이 파일을 삭제하고 `npx prisma migrate dev`를 다시 실행하면 됩니다.
