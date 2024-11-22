import Breadcrumbs from "./components/Breadcrumbs";
import { getSession } from "./lib/auth";
import prisma from "./lib/prisma";

export default async function Home() {
  const session = await getSession();
  if (!session) return <p>로그인이 필요합니다.</p>

  const user = await prisma.account.findFirst({
    where: { id: session.accountId },
  });

  const ongoing = await prisma.issue.count({
    where: {
      AND: [
        { assigneeId: user?.id },
        { status: { value: { in: ["진행중", "수락"] } } },
      ],
    },
  });

  const pending = await prisma.issue.count({
    where: {
      AND: [
        { assigneeId: user?.id },
        { status: { value: "대기" } },
      ],
    },
  });

  const done = await prisma.issue.count({
    where: {
      AND: [
        { assigneeId: user?.id },
        { status: { value: "완료" } },
      ],
    },
  });

  return (
    <>
      <Breadcrumbs tree={["홈"]} />

      <h3 className="text-xl my-2 ml-2">안녕하세요, <span className="font-bold">{user?.name}</span>님의 이번주 일감 현황입니다.</h3>

      <div className="stats shadow border border-base-300">
        <div className="stat">
          <div className="stat-figure">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.91 11.672a.375.375 0 0 1 0 .656l-5.603 3.113a.375.375 0 0 1-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112Z" />
            </svg>
          </div>
          <div className="stat-title">수락 & 진행 중</div>
          <div className="stat-value">{ongoing}</div>
          <div className="stat-desc mt-2">↗︎ 400 (22%) </div>
        </div>

        <div className="stat">
          <div className="stat-figure">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 9v6m-4.5 0V9M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
          </div>
          <div className="stat-title">대기</div>
          <div className="stat-value">{pending}</div>
          <div className="stat-desc mt-2">↗︎ 400 (22%)</div>
        </div>

        <div className="stat">
          <div className="stat-figure">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
          </div>
          <div className="stat-title">완료</div>
          <div className="stat-value">{done}</div>
          <div className="stat-desc mt-2">↘︎ 90 (14%)</div>
        </div>
      </div>
    </>
  );
}
