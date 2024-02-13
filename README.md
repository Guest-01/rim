# Rim - Redmine Improved

> 일감 관리 도구

(개발중)

### 기술 스택

- NextJS 14 (with App Router)
- TailwindCSS + Daisy UI
- Prisma + SQLite
- Docker (예정)

(작성중)

## 개발 과정

NextJS + TailwindCSS + Daisy UI까지는 순조롭게 진행되어 과정 생략.

### DB 및 ORM 연동

특정 DB에 의존하지 않고, 확장이 용이하도록 ORM을 사용하기로 결정하였음. ORM은 Prisma를 도입하기로 결정.

공식문서의 [QuickStart](https://www.prisma.io/docs/getting-started/quickstart)를 참고하여 진행.

```sh
npm install prisma --save-dev
npx prisma init --datasource-provider sqlite
```

별도의 DB 서버를 띄우고 싶지 않아서, 우선은 간단하게 파일시스템을 활용하는 Sqlite를 사용함.

`prisma init`을 하게되면 프로젝트내에 `prisma/schema.prisma` 파일이 생성됨.

이 파일 안에는 연결할 DB에 대한 정보(`datasource db`)가 들어있고, 여기에 추가로 Model을 작성할 수 있음.

`prisma/schema.prisma`
```
// ... 생략

datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

model Issue {
  id        Int     @id @default(autoincrement())
  title     String
  content   String?
}
```

Model을 작성했다면, 이제 실제 DB에 반영은 아래 명령어를 통해 가능.

```sh
npx prisma migrate dev --name init
```

위 명령어를 실행하면 Sqlite이기 때문에 `prisma/dev.db`라는 Sqlite DB 파일이 생성되고,   
우리가 작성한 Model에 따른 테이블이 자동으로 생성됨.   
그리고 이 작업의 실제 내용은 `prisma/migrations` 하위 폴더에서 확인할 수 있음.

또한 `migrate` 명령어를 실행하면 자동으로 `generate` 명령어까지 진행됨.  
원래 따로 입력하던 `generate`는 스키마에 따른 ORM 클라이언트를 생성하는 명령어임.   
이제는 자동으로 `npm install`까지 되기 때문에 아래처럼 바로 전역으로 초기화하여 `export`함.

`lib/prisma.ts` 라는 파일을 만들고, 아래와 같이 작성:

```typescript
import { PrismaClient } from '@prisma/client';

let prisma: PrismaClient;

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient();
} else {
  let globalWithPrisma = global as typeof globalThis & {
    prisma: PrismaClient;
  };
  if (!globalWithPrisma.prisma) {
    globalWithPrisma.prisma = new PrismaClient();
  }
  prisma = globalWithPrisma.prisma;
}

export default prisma;
```

공식문서와 약간 다를 수 있는데, 공식문서대로 작성하면 ESlint 오류가 발생하기 때문. ([참고](https://github.com/prisma/prisma/discussions/10037))

이제는 위 클라이언트를 컴포넌트에서 `import` 해서 사용하면 됨.

```tsx
import prisma from "../lib/prisma"

export default async function List() {
  const issues = await prisma.issue.findMany();
  // console.log(issues);
  return (
    <div>
      <span>이슈 목록</span>
      {issues.map(issue => <div key={issue.id}>{issue.title}</div>)}
    </div>
  )
}
```

### 계정 모델(테이블) 생성

계정에는 역할(관리자/사용자) 컬럼이 있는데, 여기에 `enum` 타입을 사용하려고 했으나 sqlite에서는 해당 타입을 지원하지 않았음. 따라서 그냥 `Int` 사용. 추후 DB를 변경하게 된다면 개선해볼 것.

보통은 `relation` 관계를 줄 때, 굳이 `name`을 설정하지 않아도 되는데 본 프로젝트의 경우 이슈에 작성자와 담당자가 별도로 있기 때문에 계정에는 이슈 필드가 2개, 이슈에는 계정 필드가 2개씩 생기게 된다. 따라서 둘을 구분하기 위해 `@relation(name: "")`을 필수로 설정해주어야 함.

```prisma
model Account {
  id             Int      @id @default(autoincrement())
  email          String   @unique
  password       String
  name           String
  role           Int      @default(0) /// 0: User, 1: Admin
  active         Boolean  @default(false)
  createdAt      DateTime @default(now())
  issuesCreated  Issue[]  @relation(name: "issuesCreated")
  issuesAssigned Issue[]  @relation(name: "issuesAssigned")
}

model Issue {
  id         Int      @id @default(autoincrement())
  title      String
  content    String?
  createdAt  DateTime @default(now())
  updatedAt  DateTime @default(now()) @updatedAt
  author     Account? @relation(name: "issuesCreated", fields: [authorId], references: [id])
  authorId   Int?
  assignee   Account? @relation(name: "issuesAssigned", fields: [assigneeId], references: [id])
  assigneeId Int?
}
```

### 회원가입 시 폼 검증

회원가입 폼을 만든 후, Server Action을 통해 우선 입력값을 검증함.   
이때, 빈 양식이 있는지 걸러내기 위해 `formData.values()`를 사용해서 빈 값이 있는지 검사했는데 `formData`에는 사용자가 입력한 값 뿐만 아니라 NextJS에서 내부적으로 삽입한 값도 존재하였음. 그래서 `formData.entries()`를 이용해 키 값과 함께 순회하면서 실제로 사용자가 입력한 폼 값만 선별적으로 검사해야했음.

### 회원가입 및 로그인 시 비밀번호 해싱 및 세션 쿠키 구현

`bcrypt` 패키지를 이용해서 직접 구현하기로 함.   
원래는 `next-auth`라는 올인원 패키지를 사용하려고 했으나, 단순히 이메일/비밀번호 인증을 하기 위해 불필요하게 큰 패키지를 사용하여 보일러플레이트를 잔뜩 작성하게 되는 것이 불만이었음. 추후 써드파티 로그인(구글 로그인 등)을 많이 연동하게 된다면 모를까, 현재는 계획에 없으므로 안전한 해싱 함수 정도만 bcrypt를 이용해서 사용하고 나머지 로직은 직접 구현해보는 것으로 함.

참고로 `bcrypt`는 기본 내장 crypto 모듈에서 흔히 사용하는 `SHA` 알고리즘이 아닌 더 강력한 `blowfish` 알고리즘을 사용한다고 함.

세션은 쿠키에 JWT로 저장하는 방식을 사용. (`jose` 패키지)   
세션 주기를 짧게(10분 내외)로 잡은 뒤 대신 미들웨어에서 페이지 이동이 일어날 때마다 갱신하는 식으로 편의성 추구.   
그러나 아직 쿠키가 만료되었을 때 앱이 바로 인식하는 방법을 찾는 중. (revalidating server components 관련)

(작성중)