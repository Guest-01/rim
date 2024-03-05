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
  const user1 = await prisma.account.upsert({
    where: { id: 2 },
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
  const proj1 = await prisma.project.upsert({
    where: { id: 1 },
    update: {},
    create: {
      title: "demo proj1",
      subtitle: "lorem ipsum"
    }
  })

  console.log({ admin, user, _new, pending, accepted, onprogress, done, admin1, user1, proj1 });
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
