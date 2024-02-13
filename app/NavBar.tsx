import Link from "next/link";
import { deleteSession, getSession } from "./lib/auth";
import prisma from "./lib/prisma";
import { redirect } from "next/navigation";

export default async function NavBar() {
  const session = await getSession();
  let account = null;
  if (session) {
    account = await prisma.account.findUnique({ where: { id: session.accountId } });
  }

  return (
    <header className="navbar border-b justify-between">
      {/* Title */}
      <div>
        <Link href="/" className="btn btn-ghost">
          <span className="text-xl">Rim</span>
        </Link>
        <span className="mx-2 text-sm text-gray-600">
          <strong>R</strong>edmine <strong>Im</strong>proved
        </span>
      </div>
      {/* Main Actions */}
      <ul className="menu menu-sm menu-horizontal bg-base-200 rounded-box">
        <li><Link href="/issues/new">일감 생성</Link></li>
        <li><Link href="/issues">일감 목록</Link></li>
      </ul>
      {/* Search and Profiles */}
      <div className="gap-4 mr-2">
        <input type="text" placeholder="검색" className="input input-sm input-bordered w-24 md:w-auto" />
        <div className="flex gap-2 items-center">
          {session ?
            // <Avatar account={account!} />
            <>
              <div>{account?.name}</div>
              <form action={async () => {
                "use server";
                await deleteSession();
                redirect("/login");
              }}>
                <button type="submit" className="btn btn-sm">로그아웃</button>
              </form>
            </>
            : <>
              <Link href="/login" className="btn btn-sm">로그인</Link>
              <Link href="/signup" className="btn btn-sm btn-primary">회원가입</Link>
            </>
          }
        </div>
      </div>
    </header>
  )
}