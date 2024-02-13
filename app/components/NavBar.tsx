import Link from "next/link";
import { deleteSession, getSession } from "../lib/auth";
import prisma from "../lib/prisma";
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
        <label htmlFor="my-drawer" className="btn btn-ghost btn-square drawer-button lg:hidden">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-5 h-5 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
        </label>
        <Link href="/" className="btn btn-ghost">
          <span className="text-xl">
            Rim.
            <span className="mx-2 text-sm text-gray-600 font-normal">
              <strong>R</strong>edmine <strong>Im</strong>proved.
            </span>
          </span>
        </Link>
      </div>
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