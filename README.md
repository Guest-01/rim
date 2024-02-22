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

```bash
npm install prisma --save-dev
npx prisma init --datasource-provider sqlite
```

별도의 DB 서버를 띄우고 싶지 않아서, 우선은 간단하게 파일시스템을 활용하는 Sqlite를 사용함.

`prisma init`을 하게되면 프로젝트내에 `prisma/schema.prisma` 파일이 생성됨.

이 파일 안에는 연결할 DB에 대한 정보(`datasource db`)가 들어있고, 여기에 추가로 Model을 작성할 수 있음.

`prisma/schema.prisma`
```prisma
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

```bash
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

### 계정 등록 시 폼 검증

계정 등록 폼을 만든 후, Server Action을 통해 우선 입력값을 검증함.   
이때, 빈 양식이 있는지 걸러내기 위해 `formData.values()`를 사용해서 빈 값이 있는지 검사했는데 `formData`에는 사용자가 입력한 값 뿐만 아니라 NextJS에서 내부적으로 삽입한 값도 존재하였음. 그래서 `formData.entries()`를 이용해 키 값과 함께 순회하면서 실제로 사용자가 입력한 폼 값만 선별적으로 검사해야했음.

### 계정 등록 및 로그인 시 비밀번호 해싱 및 세션 쿠키 구현

`bcrypt` 패키지를 이용해서 직접 구현하기로 함.   
원래는 `next-auth`라는 올인원 패키지를 사용하려고 했으나, 단순히 이메일/비밀번호 인증을 하기 위해 불필요하게 큰 패키지를 사용하여 보일러플레이트를 잔뜩 작성하게 되는 것이 불만이었음. 추후 써드파티 로그인(구글 로그인 등)을 많이 연동하게 된다면 모를까, 현재는 계획에 없으므로 안전한 해싱 함수 정도만 bcrypt를 이용해서 사용하고 나머지 로직은 직접 구현해보는 것으로 함.

참고로 `bcrypt`는 기본 내장 crypto 모듈에서 흔히 사용하는 `SHA` 알고리즘이 아닌 더 강력한 `blowfish` 알고리즘을 사용한다고 함.

세션은 쿠키에 JWT로 저장하는 방식을 사용. (`jose` 패키지)   
세션 주기를 짧게(10분 내외)로 잡은 뒤 대신 미들웨어에서 페이지 이동이 일어날 때마다 갱신하는 식으로 편의성 추구.
다만 세션이 종료되어 쿠키가 삭제되었을 때, 바로 로그아웃이 되지 않고 페이지 어딘가에서 `getSession`을 호출 했을 때 로그아웃이 UI에 반영됨.
바로 반영시키는 방법이 있는지, 혹은 원래 JWT 방식이 다 그런 것인지 확인 필요.

### 일감 검색 필터를 URL Query String으로 구현

일감 목록 페이지는 URL 표준을 따라 Query String을 이용하여 검색하거나 필터 및 정렬을 수행하게 만듬. 서버 컴포넌트로 된 페이지이기 때문에 사용자와 상호작용은 정석대로 `form` 태그를 기반으로 동작. 이때 사용자가 폼을 제출하면 페이지가 리로드되는데 입력했던 값이 남아있을 수 있도록 `searchParams`를 파싱한 후 `defaultValue` 속성에 할당함.

그리고 ORM(`prisma`)의 필터 조건식(`where`)에 `undefined`를 주면 해당 `where` 조건이 무시되는 점을 이용, 마침 존재하지 않는 `searchParam`의 키를 가져오려고 하면 다행히 `undefined`가 돌아와서 따로 해줄 건 없었으나 `input` 같이 사용자가 빈값을 입력할 수 있는 경우에는 `""` 빈 문자열이 들어간다. 이 부분을 직접 삼항 연산자를 통해 `undefined`로 변환해놓았음.

### 재사용 가능한 Modal

무언가를 삭제할 때 확인(Confirm) 모달을 띄우기 위해 모달 구현.

HTML 기본 `<dialog>` 태그를 이용하였으며 스타일링은 Daisy UI의 `modal` 클래스를 활용하였음. 이 때 기본 HTML Dialog의 `.showModal()`이라는 DOM 메소드를 호출해야하기 때문에 `forwardRef`를 이용하여 `useRef()`를 통해 제어할 수 있도록 구현하였음.

※ 추가 작업: 모달이 `table` 태그 안쪽에 있을 수 없다는 오류가 발생하여, `createPortal`로 감싸서 `document.body`쪽으로 옮겨주었음. 이때 `document`를 사용하기 위해 `useEffect`훅으로 클라이언트 렌더링 여부를 확인해야하는 과정이 있었음. `app/components/ConfirmDlg.tsx` 참고. (관련 QnA: https://stackoverflow.com/a/76308331/14834190)

### enum 대신 참조 테이블 사용

원래 계정의 역할은 `Int` 타입을 마치 enum처럼 사용해서 0: 관리자, 1: 사용자 이런식으로 할당할 예정이었으나, 이렇게 하지 않고 대신 역할 테이블을 새로 만들어서 참조 관계로 만들기로 함.

enum을 사용하는 것 보다 확장성이 좋다는 장점이 있음. 그러나 조회할 때 일일이 `JOIN`을 해야한다는 단점이 있다. 하지만 ORM차원에서 손쉽게 `include`문으로 조인해주기 때문에 단점이 상쇄되었음.

### DB Seeding

위에서 enum 컬럼들을 별도 테이블로 분리하게 되어서, 기본적인 값들을 미리 넣어둘 필요가 생김. 예를 들어 역할 테이블의 경우 "관리자", "사용자"등의 값을 미리 넣어두어야 계정을 만들 때 활용할 수 있다. 이는 어플리케이션 시작부터 디폴트로 들어가는 것이 좋으므로 DB에 초기 데이터로 입력해주는 방법으로 진행.

사용하고 있는 ORM에서 DB Seeding을 지원하여 참고한 후 적용함. (링크: https://www.prisma.io/docs/orm/prisma-migrate/workflows/seeding)

### 참조 관계 포함하여 생성하기

Prisma에서 Create할 때도 참조관계를 포함시키려면 아래와 같이 하면 된다.

```typescript
await prisma.account.create({
  data: {
    role: { connect: { value: formData.get("role")?.toString().trim() } }, // <-- ✔
    email: formData.get("email")!.toString().trim(),
    name: formData.get("username")!.toString().trim(),
    password: await bcrypt.hash(
      formData.get("password")!.toString().trim(),
      10
    ),
  },
});
```


`connect`를 쓸 경우 기존에 존재하는 Row를 연결하는 것이고, 그 밖에 `create`, `connectOrCreate` 등이 있음.

### include를 이용해 참조관계를 포함하여 가져온 경우의 Typing 방법

만일 DB에서 조회할 때 ORM(Prisma)의 `include`문을 통해 조인을해서 가져왔다면, 가져온 외래 필드까지 Type에 포함하기 위해 아래와 같이 해주어야 함.

```typescript
import { Prisma } from '@prisma/client'

type AccountWithRole = Prisma.AccountGetPayload<{ include: { role: true } }>;
```

### 로컬 개발용 sqlite DB를 .gitignore 처리

새로 리파지토리를 `git clone`한 경우, `npx prisma db push` 혹은 `npx prisma migrate reset`을 해주면 알아서 `/prisma/dev.db`를 생성해주기 때문에, 해당 DB를 깃에 올릴 필요가 없음. 오히려 내부 데이터가 공유되어 버리기 때문에 보안상 좋지 않음. 비밀번호는 암호화 되어있고, 개발중에는 실제 정보가 아닌 더미 데이터만 입력하고 있었기 때문에 여태 푸시한 내용은 문제 없음.
