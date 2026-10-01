import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import "./globals.css";

import NavBar from "./components/NavBar";
import SideBar from "./components/SideBar";
import { getSession } from "./lib/auth";
import prisma from "./lib/prisma";

const noto = Noto_Sans_KR({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Rim - Redmine Improved",
  description: "improved alternative of redmine",
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode; }>) {
  const session = await getSession();
  const user = await prisma.account.findFirst({ where: { id: session?.accountId } });
  // 첫 화면부터 배지가 보이도록 서버에서 미리 계산. 이후 갱신은 SideBar의 polling이 담당
  // (조건은 대기 일감 페이지 및 api/pending-count와 동일하게 유지)
  const pendingCount = session
    ? await prisma.issue.count({ where: { assigneeId: session.accountId, status: { value: "대기" } } })
    : 0;

  return (
    <html lang="en" data-theme="rim">
      <body className={noto.className}>
        <NavBar />
        {/* 전체 화면에서 헤더(4rem)과 헤더의 아랫 보더(1px)를 뺀 값이 높이 */}
        <div className="flex" style={{ height: "calc(100vh - 4rem - 1px)" }}>
          <SideBar isAdmin={user?.roleId === 1} pendingCount={pendingCount} />
          <main className="p-4 pt-0 w-full">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
