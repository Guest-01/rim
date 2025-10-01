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
    <header className="navbar border-b bg-gradient-to-r from-primary/5 to-secondary/5 shadow-sm">
      <div className="navbar-start">
        <Link href="/" className="btn btn-ghost hover:bg-primary/10">
          <span className="text-xl">
            <span className="font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Rim.</span>
            <span className="ml-2 text-sm text-gray-600 font-normal">
              <strong className="text-primary">R</strong>edmine <strong className="text-secondary">Im</strong>proved.
            </span>
          </span>
        </Link>
      </div>
      <div className="navbar-end gap-2">
        {session ?
          <>
            <div title={account?.name} className="avatar placeholder">
              <div className="bg-neutral text-neutral-content rounded-full w-8">
                <span className="text-xs">{account?.name.slice(0, 2)}</span>
              </div>
            </div>
            <div className="font-medium text-neutral">{account?.name}</div>
            <form action={async () => {
              "use server";
              await deleteSession();
              redirect("/login");
            }}>
              <button type="submit" className="btn btn-sm btn-outline btn-error">로그아웃</button>
            </form>
          </>
          : <>
            <Link href="/login" className="btn btn-sm btn-ghost">로그인</Link>
            <Link href="/signup" className="btn btn-sm btn-primary shadow-md hover:shadow-lg transition-shadow">계정 등록</Link>
          </>
        }
      </div>
    </header>
  )
}