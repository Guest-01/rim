# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 프로젝트 개요

Rim (Redmine Improved) - Next.js 14 기반 일감 관리 도구

- **기술 스택**: Next.js 14 (App Router), TypeScript, TailwindCSS, DaisyUI, Prisma ORM, PostgreSQL
- **배포 환경**: Vercel (https://rim-hh.vercel.app/)
- **주요 기능**: 프로젝트별 일감 관리, 계정/역할 관리, 일감 할당 및 상태 추적, 댓글 시스템

## 주요 명령어

### 개발
```bash
npm run dev          # 개발 서버 실행 (Turbo 모드)
npm run build        # 프로덕션 빌드
npm start            # 프로덕션 서버 실행
npm run lint         # ESLint 실행
```

### 데이터베이스 (Prisma)
```bash
npx prisma migrate dev              # 로컬 개발용 마이그레이션 생성 및 적용
npx prisma migrate deploy           # 프로덕션 마이그레이션 적용
npx prisma migrate reset            # DB 초기화 및 재시드
npx prisma db seed                  # DB 시드 데이터 입력
npx prisma generate                 # Prisma Client 재생성
npx prisma studio                   # Prisma Studio (DB GUI) 실행
```

## 핵심 아키텍처

### 인증 시스템 (app/lib/auth.ts)
- `jose` 패키지를 사용한 JWT 기반 세션 관리
- 쿠키(`rim_session`)에 JWT 토큰 저장, 10분 만료 시간
- `middleware.ts`에서 모든 보호된 경로에 대해 세션 검증 및 갱신 자동 처리
- 비밀번호는 `bcrypt`로 해싱 (blowfish 알고리즘, salt rounds 10)

### 데이터베이스 스키마 (prisma/schema.prisma)
- **Account**: 사용자 계정, Role과 1:N 관계
- **Role**: 계정 역할 (관리자/사용자), enum 대신 참조 테이블 사용
- **Project**: 프로젝트, Account와 M:N 관계 (암시적 관계 테이블)
- **Issue**: 일감, Project와 1:N, Account(작성자/담당자)와 관계
- **IssueStatus**: 일감 상태 (신규/대기/수락/진행중/완료), enum 대신 참조 테이블 사용
- **Comment**: 댓글, Issue 및 Account와 관계

### Prisma 클라이언트 (app/lib/prisma.ts)
- 개발 환경에서는 HMR 대응을 위해 global 객체에 캐싱
- 프로덕션에서는 단일 인스턴스 생성
- 모든 컴포넌트와 Server Action에서 `import prisma from "@/app/lib/prisma"` 형태로 사용

### 폴더 구조
```
app/
├── lib/                    # 공용 유틸리티 (auth, prisma)
├── components/             # 재사용 가능한 컴포넌트 (NavBar, SideBar, Modal 등)
├── admin/                  # 관리자 전용 페이지 (accounts, projects)
├── issues/                 # 일감 관련 페이지 (목록, 상세, 신규 작성)
├── login/, signup/         # 인증 페이지
└── [route]/actions.ts      # 각 경로별 Server Actions
```

## 중요 구현 패턴

### Prisma 관계 처리
- **참조 관계 포함 생성**: `connect` 사용
  ```typescript
  await prisma.account.create({
    data: {
      role: { connect: { value: "관리자" } },
      // ...
    }
  })
  ```
- **참조 관계 포함 조회**: `include` 사용 및 타입 정의
  ```typescript
  import { Prisma } from '@prisma/client'
  type AccountWithRole = Prisma.AccountGetPayload<{ include: { role: true } }>
  ```
- **M:N 관계 업데이트**: 여러 항목 연결은 `connect` 배열, 모두 제거는 `set: []`

### Server Actions 및 폼 처리
- 폼 제출 후 성공 시 자동 리셋: `useFormState` + `useEffect` + `form.reset()`
- 입력값 검증은 Server Action에서 수행 후 에러 객체 반환
- URL Query String 기반 필터링/검색 (`searchParams` 활용)

### 컴포넌트 패턴
- `<dialog>` 태그 + DaisyUI 스타일로 모달 구현
- `forwardRef` + `createPortal`로 테이블 외부에 모달 렌더링
- 서버 컴포넌트 기본, 클라이언트 상호작용 필요 시에만 `'use client'`

## 환경 변수
- `DATABASE_URL`: Neon PostgreSQL 연결 URL (pooled)
- `DATABASE_URL_UNPOOLED`: Direct 연결 URL (마이그레이션용)
- 로컬 개발: `.env` 파일에 설정
- 프로덕션: Vercel Environment Variables에서 관리

## 주의사항
- SQLite에서 PostgreSQL로 마이그레이션 완료 (Vercel은 파일 시스템 DB 미지원)
- `postinstall` 스크립트에서 `prisma generate && prisma migrate deploy && prisma db seed` 실행
- 타입 에러 방지를 위해 배포 전 `npm run build` 실행 권장
- 세션 만료는 페이지 이동마다 자동 갱신됨
