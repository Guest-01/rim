import { redirect } from "next/navigation";
import { getSession } from "../lib/auth";
import clsx from "clsx";

export default async function Filter({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
  const session = await getSession();
  const isDefaultPage = Object.keys(searchParams).length === 0;
  const isMeAssigned = session && searchParams.assigneeId === session?.accountId.toString();
  const isMeAuthor = session && searchParams.authorId === session?.accountId.toString();
  
  return (
    <div className="card card-bordered">
      <div className="p-4 flex gap-2 items-center">
        <div className="label label-text">필터 프리셋</div>
        <form action={async () => {
          'use server';
          redirect("/issues")
        }}>
          <button className={clsx("btn btn-sm rounded-full", { "btn-active": isDefaultPage })}>
            모두
          </button>
        </form>
        <form action={async () => {
          'use server';
          redirect(`?assigneeId=${session?.accountId}`)
        }}>
          <button className={clsx("btn btn-sm rounded-full", { "btn-active": isMeAssigned })}>
            내 담당
          </button>
        </form>
        <form action={async () => {
          'use server';
          redirect(`?authorId=${session?.accountId}`)
        }}>
          <button className={clsx("btn btn-sm rounded-full", { "btn-active": isMeAuthor })}>
            내가 작성한
          </button>
        </form>
      </div>
    </div>
  )
}