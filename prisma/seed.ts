import { PrismaClient } from "@prisma/client";

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
  console.log({ admin, user, _new, onprogress, done });
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
