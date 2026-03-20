# 📝 Title: Shopping

`장바구니`와 `위시리스트`, `제품 검색` 및 `회원정보관리`를 제공하는 쇼핑몰 서비스입니다.

`실무에서 직면한 문제들`을 혼자 해결하고, 해결 과정에서 얻은 기술과 지식을 `구체적으로 구현 및 문서화`하였습니다.

프론트엔드 개발 경험을 바탕으로 RESTful API 설계와 데이터베이스 모델링을 직접 수행했습니다.  
`백엔드 및 데이터베이스 영역에서의 협업 능력 향상을 목표`로 작업했습니다.

## <a href="https://fantasy-grey-9ba.notion.site/Shopping-33e5f0b6e22a4a949ae1292fadfb40ed" target="_blank">🗂️ Shopping 프로젝트 Notion 문서 링크</a>

## <a href="https://shopping-lac-beta.vercel.app/" target="_blank">🌐 Shopping 프로젝트 배포 링크</a>

## 👥 TEST 계정 : guest001 / aa112233#@

<br/><br/>

# 🛠️ 개발 환경 & 기술 스택

| 사용 언어 (FE/BE)     | TypeScript (FE/BE)                                                                            |
| --------------------- | --------------------------------------------------------------------------------------------- |
| 웹 프레임워크 (FE/BE) | [FE/BE] Next.js (v14, App Router)                                                             |
| Auth 라이브러리       | NextAuth.js (v4)                                                                              |
| 상태 관리 라이브러리  | Zustand                                                                                       |
| 스타일링 도구         | TailwindCSS                                                                                   |
| ORM / DBMS            | Prisma / Supabase (PostgreSQL)                                                                |
| 패키지 관리자         | pnpm (v9.5.0)                                                                                 |
| 런타임 환경           | Node.js v20                                                                                   |
| 이미지 CDN            | Supabase Storage                                                                              |
| 배포 (FE/BE)          | **FE 배포**: Vercel, BE 배포: Vercel (API 라우팅, 서버리스 함수), Supabase (PostgreSQL, DBMS) |
| 문서화 도구 / IDE     | Notion / VSCode                                                                               |
| 개발 환경 / 운영 체제 | Mac                                                                                           |

<br/><br/>

# 👩‍💻 작업 내용

## 1.  SEO 지표 리포트 점수 개선 (Mobile: 🔺약 187%, Desktop: 🔺약 45%)

- 이미지가 가장 많이 몰려있는 메인 페이지를 기준으로 점수를 측정
- 최초 `Desktop 66점`, `Mobile 33점` 에서 시작하여 개선

### 📝 SEO 최적화 작업 관련 작성 Notion 문서

- <a href="https://fantasy-grey-9ba.notion.site/SEO-80b9a3de657a42549c668a8510194400" target="_blank">[SEO] 리소스 최적화 Notion 문서 링크</a>
- <a href="https://fantasy-grey-9ba.notion.site/SEO-metadata-062514db4a894a11a671d478df4980d1?pvs=73" target="_blank">[SEO] 메타 데이터 Notion 문서 링크</a>
- <a href="https://fantasy-grey-9ba.notion.site/SEO-sitemap-96a03ef22dcc416f884d5d41bb576e83" target="_blank">[SEO] 사이트맵 적용 Notion 문서 링크</a>

<br/><br/>

### 📈 최종 Performance 점수 (Desktop: 96점 / Mobile: 95점)

- [PageSpeed Insights 최종 Performance 점수 (Desktop: 96점 / Mobile: 95점)]

|                                                           Desktop: `96점`                                                           |                                                           Mobile: `95점`                                                           |
| :---------------------------------------------------------------------------------------------------------------------------------: | :--------------------------------------------------------------------------------------------------------------------------------: |
| <img src="https://hhgfywdzkbdfwrhfqlbn.supabase.co/storage/v1/object/public/images/github/2026-seo-result-desktop.png" width="400"> | <img src="https://hhgfywdzkbdfwrhfqlbn.supabase.co/storage/v1/object/public/images/github/2026-seo-result-mobile.png" width="400"> |

<br/><br/>

## 2. 🖥️ 💻 📱 반응형 퍼블리싱 (Mobile, Tablet, Desktop)

|                                          `Desktop` 브라우저 반응형 해상도 (Mac 기준)                                           |
| :----------------------------------------------------------------------------------------------------------------------------: |
| <img src="https://hhgfywdzkbdfwrhfqlbn.supabase.co/storage/v1/object/public/images/github/publishing-desktop.gif" width="600"> |

<br/><br/>

|                                                `Tablet` 해상도 (iOS 웹뷰 기준)                                                 |                                                `Mobile` 해상도 (iOS 웹뷰 기준)                                                 |
| :----------------------------------------------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------------------------------------------------: |
| <img src="https://hhgfywdzkbdfwrhfqlbn.supabase.co/storage/v1/object/public/images/github/publishing-tablet.gif" height="600"> | <img src="https://hhgfywdzkbdfwrhfqlbn.supabase.co/storage/v1/object/public/images/github/publishing-mobile.gif" height="600"> |

<br/><br/>

## 3. 🤹 UI 인터랙션

- ### [동적 콘텐츠 로딩] 무한 스크롤 (Infinite Scroll) 구현

  <img src="https://hhgfywdzkbdfwrhfqlbn.supabase.co/storage/v1/object/public/images/github/ui-infinite-scroll.gif" width="600">

- ### [데이터 필터링] 각 카테고리 및 전체 필터 기능 구현

  <img src="https://hhgfywdzkbdfwrhfqlbn.supabase.co/storage/v1/object/public/images/github/ui-category-filter.gif" width="600">

- ### [UI/UX] 제품 아이템 Hover 애니메이션: Marquee

  <img src="https://hhgfywdzkbdfwrhfqlbn.supabase.co/storage/v1/object/public/images/github/ui-marquee.gif" width="600">

- ### [비동기 상태 관리] 검색어 자동완성 및 결과 리스트 키보드 조작을 통한 선택 기능을 구현
  <img src="https://hhgfywdzkbdfwrhfqlbn.supabase.co/storage/v1/object/public/images/github/ui-search-debounce.gif" width="600">

<br/><br/>

## 4. 💬 입력 데이터 처리 및 UI 관리

- ### [UI/UX] 전체 동의, 개별 동의 체크박스 기능

  <img src="https://hhgfywdzkbdfwrhfqlbn.supabase.co/storage/v1/object/public/images/github/register-agreement.gif" width="600">

- ### [사용자 피드백] 이미 존재하는 ID, Email 경우 사용자에게 알림, 인풋 데이터 Reset

  <img src="https://hhgfywdzkbdfwrhfqlbn.supabase.co/storage/v1/object/public/images/github/register-already-exist.gif" width="600">

- ### [이벤트관리] 최종 데이터 DB 전송시 로딩 레이어 모달 처리

  <img src="https://hhgfywdzkbdfwrhfqlbn.supabase.co/storage/v1/object/public/images/github/register-final-submit.gif" width="600">

<br/><br/>

## 5. ⚙️ Excel 파일을 이용한 제품 DB 관리

- ### [비동기 상태 관리] 제품 DB를 Excel 파일로 업로드

  <img src="https://hhgfywdzkbdfwrhfqlbn.supabase.co/storage/v1/object/public/images/github/admin-excel-upload.gif" width="600">

- ### [UI/UX] 페이징 처리 (맨얖, 맨뒤로)

  <img src="https://hhgfywdzkbdfwrhfqlbn.supabase.co/storage/v1/object/public/images/github/admin-excel-paging.gif" width="600">

- ### [UI/UX] 체크박스 UI 전체 삭제, 부분 삭제 구현

  <img src="https://hhgfywdzkbdfwrhfqlbn.supabase.co/storage/v1/object/public/images/github/admin-excel-delete-one.gif" width="600">

- ### [데이터 필터링] 셀렉트박스를 사용한 카테고리 필터 기능

  <img src="https://hhgfywdzkbdfwrhfqlbn.supabase.co/storage/v1/object/public/images/github/admin-excel-filter.gif" width="600">

<br/><br/>

## 6. 📨 🔐 이메일 기반 인증 및 보안

- ### [JWT 토큰 생성] 가입할때 작성한 Email로 비밀번호 재설정 토큰 링크 이메일 전송

  <img src="https://hhgfywdzkbdfwrhfqlbn.supabase.co/storage/v1/object/public/images/github/pw-email-request.gif" width="600">

- ### [이메일 템플릿] 요청일시, ID, 링크 만료기한 안내, 재설정 토큰 링크 전달

  <img src="https://hhgfywdzkbdfwrhfqlbn.supabase.co/storage/v1/object/public/images/github/pw-email-reset.gif" width="600">

  <img src="https://hhgfywdzkbdfwrhfqlbn.supabase.co/storage/v1/object/public/images/github/pw-email-template.png" width="600">

<br/><br/>

# 📦 프로젝트 구조

```bash
📦 shopping
├── 📂 app
│   ├── 📂 actions
│   ├── 📂 api
│   ├── 📂 hooks
│   ├── 📂 add-product
│   ├── 📂 my-shopping
│   ├── 📂 profile
│   ├── 📂 request-reset
│   ├── 📂 reset-password
│   ├── 📂 search
│   ├── 📂 signIn
│   └── 📂 signUp
│
├── 📄 favicon.ico
├── 📄 global.css
├── 📄 layout.tsx
├── 📄 not-found.tsx
├── 📄 page.tsx
│
├── 📂 lib
│   ├── 📂 components
│   ├── 📂 stores
│   ├── 📄 auth.ts
│   ├── 📄 zodSchema.ts
│   ├── 📄 supabaseClient.ts
│   ├── 📄 prisma.ts
│   ├── 📄 constants.ts
│   └── 📄 utils.ts
│
├── 📂 prisma
├── 📂 public
├── 📂 types
│
├── 📄 middleware.ts
├── 📄 next.config.mjs
├── 📄 tailwind.config.js
└── 📄 tsconfig.json
```

- 📂 app > actions (Server Actions)

  - 데이터 처리가 즉시 필요한 작업
    - [CRUD] 위시리스트, 주문리스트, 배송지
    - [조회, 업데이트] 프로필
    - [조회] 제품 검색, email 중복여부
    - [조회, 생성, 제거] 장바구니
    - [조회, 삭제, 생성] 제품 리스트
      - Toggle 하여 사용자 위시리스트, 장바구니 반영 여부 반영
      - 일괄조회, 페이징 조회 (infinite scroll 기능)
    - [CRUD] admin 제품 리스트 관리

- 📂 app > api (Route API)
  - 인증, 권한 체크가 필요한 작업
    - 로그인, 로그아웃, 비밀번호 갱신 및 갱신 요청 관련
- 📂 app > hooks
  - 상태 관리 및 비즈니스 로직을 커스텀 훅으로 분리
  - 비즈니스 로직과 UI 로직을 분리
- 📂 lib > components
  - 일반, 관리자, 공통으로 쓰이는 컴포넌트 관리
- 📂 lib > stores
  - 배송지, 장바구니, 주문리스트, 제품리스트, 위시리스트 관련 Zustand 상태 store

<br/><br/>

# ⚙️ DB 모델 ERD

| User      | 사용자 정보               | Cartlist  | 장바구니 목록                     |
| --------- | ------------------------- | --------- | --------------------------------- |
| Agreement | 정보이용동의 (선택/필수)  | Wishlist  | 위시리스트                        |
| Address   | 사용자 배송지 (기본/기타) | Order     | 사용자가 만든 각 주문에 대한 정보 |
| Product   | 제품 정보                 | OrderItem | 각 주문에 포함된 개별 상품의 정보 |

<img src="https://hhgfywdzkbdfwrhfqlbn.supabase.co/storage/v1/object/public/images/github/table-erd.png" width="800">
