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
    <header className="navbar border-b">
      <div className="navbar-start">
        <Link href="/" className="btn btn-ghost">
          <span className="text-xl">
            Rim.
            <span className="ml-2 text-sm text-gray-600 font-normal">
              <strong>R</strong>edmine <strong>Im</strong>proved.
            </span>
          </span>
        </Link>
      </div>
      <div className="navbar-end gap-2">
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
            <Link href="/signup" className="btn btn-sm btn-primary">계정 등록</Link>
          </>
        }
      </div>
    </header>
  )
}