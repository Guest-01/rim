import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const admin = await prisma.role.upsert({
    where: { value: "관리자" },
    update: {},
    create: { value: "관리자" },
  });
  const user = await prisma.role.upsert({
    where: { value: "사용자" },
    update: {},
    create: { value: "사용자" },
  });
  const _new = await prisma.issueStatus.upsert({
    where: { value: "신규" },
    update: {},
    create: { value: "신규" },
  });
  const pending = await prisma.issueStatus.upsert({
    where: { value: "대기" },
    update: {},
    create: { value: "대기" },
  });
  const accepted = await prisma.issueStatus.upsert({
    where: { value: "수락" },
    update: {},
    create: { value: "수락" },
  });
  const onprogress = await prisma.issueStatus.upsert({
    where: { value: "진행중" },
    update: {},
    create: { value: "진행중" },
  });
  const done = await prisma.issueStatus.upsert({
    where: { value: "완료" },
    update: {},
    create: { value: "완료" },
  });

  const admin1 = await prisma.account.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: "기본관리자계정",
      email: "test1@test.com",
      password: await bcrypt.hash("admin123!", 10),
      description: "데모용 관리자 계정",
      role: { connect: { value: "관리자" } },
      active: true
    }
  })
  const admin2 = await prisma.account.upsert({
    where: { id: 2 },
    update: {},
    create: {
      name: "김관리",
      email: "admin@rim.com",
      password: await bcrypt.hash("admin123!", 10),
      description: "프로젝트 관리자",
      role: { connect: { value: "관리자" } },
      active: true
    }
  })
  const user1 = await prisma.account.upsert({
    where: { id: 3 },
    update: {},
    create: {
      name: "기본사용자계정",
      email: "test2@test.com",
      password: await bcrypt.hash("user123!", 10),
      description: "데모용 사용자 계정",
      role: { connect: { value: "사용자" } },
      active: true
    }
  })
  const user2 = await prisma.account.upsert({
    where: { id: 4 },
    update: {},
    create: {
      name: "이개발",
      email: "dev1@rim.com",
      password: await bcrypt.hash("user123!", 10),
      description: "프론트엔드 개발자",
      role: { connect: { value: "사용자" } },
      active: true
    }
  })
  const user3 = await prisma.account.upsert({
    where: { id: 5 },
    update: {},
    create: {
      name: "박백엔드",
      email: "dev2@rim.com",
      password: await bcrypt.hash("user123!", 10),
      description: "백엔드 개발자",
      role: { connect: { value: "사용자" } },
      active: true
    }
  })
  const user4 = await prisma.account.upsert({
    where: { id: 6 },
    update: {},
    create: {
      name: "최디자인",
      email: "designer@rim.com",
      password: await bcrypt.hash("user123!", 10),
      description: "UI/UX 디자이너",
      role: { connect: { value: "사용자" } },
      active: true
    }
  })
  const user5 = await prisma.account.upsert({
    where: { id: 7 },
    update: {},
    create: {
      name: "정테스터",
      email: "tester@rim.com",
      password: await bcrypt.hash("user123!", 10),
      description: "QA 엔지니어",
      role: { connect: { value: "사용자" } },
      active: true
    }
  })

  const proj1 = await prisma.project.upsert({
    where: { id: 1 },
    update: {},
    create: {
      title: "웹사이트 리뉴얼",
      subtitle: "메인 웹사이트 UI/UX 개선 프로젝트",
      members: {
        connect: [
          { id: 1 },
          { id: 2 },
          { id: 4 },
          { id: 6 }
        ]
      }
    }
  })
  const proj2 = await prisma.project.upsert({
    where: { id: 2 },
    update: {},
    create: {
      title: "모바일 앱 개발",
      subtitle: "iOS/Android 네이티브 앱 제작",
      members: {
        connect: [
          { id: 2 },
          { id: 4 },
          { id: 5 }
        ]
      }
    }
  })
  const proj3 = await prisma.project.upsert({
    where: { id: 3 },
    update: {},
    create: {
      title: "API 서버 구축",
      subtitle: "RESTful API 및 GraphQL 엔드포인트 개발",
      members: {
        connect: [
          { id: 1 },
          { id: 5 },
          { id: 7 }
        ]
      }
    }
  })
  const proj4 = await prisma.project.upsert({
    where: { id: 4 },
    update: {},
    create: {
      title: "데이터 분석 플랫폼",
      subtitle: "실시간 데이터 시각화 대시보드",
      members: {
        connect: [
          { id: 2 },
          { id: 3 },
          { id: 4 },
          { id: 5 }
        ]
      }
    }
  })

  const issue1 = await prisma.issue.upsert({
    where: { id: 1 },
    update: {},
    create: {
      title: "로그인 페이지 디자인 개선",
      content: "현재 로그인 페이지의 UI가 오래되어 보입니다. 모던한 디자인으로 개선이 필요합니다.",
      projectId: 1,
      authorId: 2,
      assigneeId: 6,
      issueStatusId: onprogress.id
    }
  })
  const issue2 = await prisma.issue.upsert({
    where: { id: 2 },
    update: {},
    create: {
      title: "메인 페이지 반응형 레이아웃 적용",
      content: "모바일 환경에서 레이아웃이 깨지는 문제를 수정해야 합니다.",
      projectId: 1,
      authorId: 1,
      assigneeId: 4,
      issueStatusId: accepted.id
    }
  })
  const issue3 = await prisma.issue.upsert({
    where: { id: 3 },
    update: {},
    create: {
      title: "다크모드 지원 추가",
      content: "사용자 설정에 따라 다크모드/라이트모드 전환이 가능하도록 구현",
      projectId: 1,
      authorId: 6,
      assigneeId: 4,
      issueStatusId: _new.id
    }
  })
  const issue4 = await prisma.issue.upsert({
    where: { id: 4 },
    update: {},
    create: {
      title: "iOS 푸시 알림 기능 구현",
      content: "Firebase Cloud Messaging을 사용한 푸시 알림 시스템 구축",
      projectId: 2,
      authorId: 2,
      assigneeId: 4,
      issueStatusId: onprogress.id
    }
  })
  const issue5 = await prisma.issue.upsert({
    where: { id: 5 },
    update: {},
    create: {
      title: "안드로이드 권한 관리 로직 수정",
      content: "Android 13 대응 런타임 권한 처리 개선",
      projectId: 2,
      authorId: 2,
      assigneeId: 5,
      issueStatusId: done.id
    }
  })
  const issue6 = await prisma.issue.upsert({
    where: { id: 6 },
    update: {},
    create: {
      title: "앱 내 결제 시스템 연동",
      content: "Google Play Billing / App Store Connect 인앱결제 구현",
      projectId: 2,
      authorId: 5,
      assigneeId: null,
      issueStatusId: pending.id
    }
  })
  const issue7 = await prisma.issue.upsert({
    where: { id: 7 },
    update: {},
    create: {
      title: "사용자 인증 API 엔드포인트 개발",
      content: "JWT 기반 로그인/로그아웃/토큰 갱신 API 구현",
      projectId: 3,
      authorId: 1,
      assigneeId: 5,
      issueStatusId: done.id
    }
  })
  const issue8 = await prisma.issue.upsert({
    where: { id: 8 },
    update: {},
    create: {
      title: "GraphQL 스키마 설계",
      content: "주요 데이터 모델에 대한 Query/Mutation 타입 정의",
      projectId: 3,
      authorId: 5,
      assigneeId: 5,
      issueStatusId: onprogress.id
    }
  })
  const issue9 = await prisma.issue.upsert({
    where: { id: 9 },
    update: {},
    create: {
      title: "API 성능 테스트 및 최적화",
      content: "부하 테스트를 통한 병목 지점 파악 및 쿼리 최적화",
      projectId: 3,
      authorId: 7,
      assigneeId: 5,
      issueStatusId: accepted.id
    }
  })
  const issue10 = await prisma.issue.upsert({
    where: { id: 10 },
    update: {},
    create: {
      title: "데이터 수집 파이프라인 구축",
      content: "Apache Kafka 기반 실시간 데이터 스트리밍 구현",
      projectId: 4,
      authorId: 2,
      assigneeId: 5,
      issueStatusId: onprogress.id
    }
  })
  const issue11 = await prisma.issue.upsert({
    where: { id: 11 },
    update: {},
    create: {
      title: "차트 라이브러리 선정 및 적용",
      content: "D3.js vs Chart.js 비교 후 프로젝트에 적합한 라이브러리 도입",
      projectId: 4,
      authorId: 3,
      assigneeId: 4,
      issueStatusId: _new.id
    }
  })
  const issue12 = await prisma.issue.upsert({
    where: { id: 12 },
    update: {},
    create: {
      title: "실시간 대시보드 UI 구현",
      content: "WebSocket을 활용한 실시간 데이터 업데이트 화면",
      projectId: 4,
      authorId: 4,
      assigneeId: 4,
      issueStatusId: pending.id
    }
  })
  const issue13 = await prisma.issue.upsert({
    where: { id: 13 },
    update: {},
    create: {
      title: "데이터 시각화 성능 개선",
      content: "대용량 데이터 렌더링 시 프레임 드롭 현상 해결",
      projectId: 4,
      authorId: 2,
      assigneeId: null,
      issueStatusId: _new.id
    }
  })
  const issue14 = await prisma.issue.upsert({
    where: { id: 14 },
    update: {},
    create: {
      title: "접근성 개선 작업",
      content: "WCAG 2.1 AA 수준 준수를 위한 스크린 리더 지원 및 키보드 네비게이션 개선",
      projectId: 1,
      authorId: 6,
      assigneeId: 4,
      issueStatusId: pending.id
    }
  })
  const issue15 = await prisma.issue.upsert({
    where: { id: 15 },
    update: {},
    create: {
      title: "API 문서 자동화",
      content: "Swagger/OpenAPI를 통한 API 문서 자동 생성 시스템 구축",
      projectId: 3,
      authorId: 1,
      assigneeId: null,
      issueStatusId: _new.id
    }
  })

  const comment1 = await prisma.comment.upsert({
    where: { id: 1 },
    update: {},
    create: {
      content: "Figma 디자인 시안 공유드립니다. 검토 부탁드립니다.",
      issueId: 1,
      accountId: 6
    }
  })
  const comment2 = await prisma.comment.upsert({
    where: { id: 2 },
    update: {},
    create: {
      content: "시안 확인했습니다. 전반적으로 좋아 보이는데 버튼 색상만 조금 조정하면 좋을 것 같습니다.",
      issueId: 1,
      accountId: 2
    }
  })
  const comment3 = await prisma.comment.upsert({
    where: { id: 3 },
    update: {},
    create: {
      content: "Tailwind CSS breakpoint 기준으로 작업 진행 중입니다. 내일까지 완료 예정입니다.",
      issueId: 2,
      accountId: 4
    }
  })
  const comment4 = await prisma.comment.upsert({
    where: { id: 4 },
    update: {},
    create: {
      content: "FCM 토큰 발급까지는 완료했고, 백엔드 API 연동 대기 중입니다.",
      issueId: 4,
      accountId: 4
    }
  })
  const comment5 = await prisma.comment.upsert({
    where: { id: 5 },
    update: {},
    create: {
      content: "서버 API 작업 완료했습니다. 테스트 부탁드립니다.",
      issueId: 4,
      accountId: 5
    }
  })
  const comment6 = await prisma.comment.upsert({
    where: { id: 6 },
    update: {},
    create: {
      content: "권한 체크 로직 수정 완료했습니다. QA 확인 부탁드립니다.",
      issueId: 5,
      accountId: 5
    }
  })
  const comment7 = await prisma.comment.upsert({
    where: { id: 7 },
    update: {},
    create: {
      content: "테스트 완료했습니다. 정상 동작 확인했습니다!",
      issueId: 5,
      accountId: 7
    }
  })
  const comment8 = await prisma.comment.upsert({
    where: { id: 8 },
    update: {},
    create: {
      content: "Query 성능 측정 결과 공유드립니다. 인덱스 추가가 필요해 보입니다.",
      issueId: 9,
      accountId: 7
    }
  })
  const comment9 = await prisma.comment.upsert({
    where: { id: 9 },
    update: {},
    create: {
      content: "인덱스 추가 후 응답 속도가 70% 개선되었습니다.",
      issueId: 9,
      accountId: 5
    }
  })
  const comment10 = await prisma.comment.upsert({
    where: { id: 10 },
    update: {},
    create: {
      content: "Chart.js가 번들 사이즈도 작고 사용하기 쉬워서 이쪽으로 진행하는 게 좋을 것 같습니다.",
      issueId: 11,
      accountId: 4
    }
  })

  console.log({ admin, user, _new, pending, accepted, onprogress, done, admin1, admin2, user1, user2, user3, user4, user5, proj1, proj2, proj3, proj4 });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
