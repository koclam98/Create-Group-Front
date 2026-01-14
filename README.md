# 모임만들기 (Meeting Maker)

이 프로젝트는 **React**, **TypeScript**, **Vite**를 사용하여 구축된 웹 애플리케이션입니다.
확장성과 유지보수성을 고려하여 **기능 기반 구조(Feature-based Structure)**로 설계되었습니다.

## 🛠 Tech Stack

- **Framework**: [React](https://react.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: Pure CSS (CSS Variables for Theming)

## 📂 Project Structure

이 프로젝트는 FSD(Feature-Sliced Design) 아키텍처의 아이디어를 차용하여, 기능 단위로 모듈을 분리하는 구조를 따릅니다.

```text
src/
├── app/                  # 앱의 진입점 및 전역 설정
│   ├── App.tsx           # 메인 라우팅 및 레이아웃 래퍼
│   ├── main.tsx          # React Entry Point
│   └── index.css         # 전역 스타일 및 Theme 변수 정의
│
├── features/             # 비즈니스 로직이 포함된 기능 단위 모듈
│   └── cast-slider/      # [기능] 출연진 슬라이더 (이미지, 텍스트 포함)
│       ├── ImageSlider.tsx
│       └── ImageSlider.css
│
├── pages/                # 라우팅에 매핑되는 페이지 단위 컴포넌트
│   └── HomePage.tsx      # 메인 페이지 (슬라이더 및 레이아웃 조합)
│
├── components/           # (Optional) 도메인과 무관한 재사용 가능한 공통 UI
│   └── layout/           # Header, Footer 등 레이아웃 컴포넌트
│
└── assets/               # 이미지, 폰트 등 정적 리소스
```

## 🎨 Design System

단순하고 일관된 디자인을 위해 4가지 핵심 컬러를 사용하며, CSS 변수로 관리합니다. (`src/app/index.css`)

- **Light Theme** (Current)
  - `Background`: `#F1F5F9` (Light Slate)
  - `Surface`: `#FFFFFF` (White)
  - `Accent`: `#0284C7` (Deep Sky Blue)
  - `Text`: `#0F172A` (Deep Navy)

## 🚀 Getting Started

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Run development server**
   ```bash
   npm run dev
   ```

3. **Build for production**
   ```bash
   npm run build
   ```
