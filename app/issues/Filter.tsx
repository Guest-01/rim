import { redirect } from "next/navigation";
import { getSession } from "../lib/auth";
import clsx from "clsx";

export default async function Filter({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
  const session = await getSession();
  const isDefaultPage = Object.keys(searchParams).length === 0;
  const isMeAssigned = session && searchParams.assigneeId === session?.accountId.toString();
  const isMeAuthor = session && searchParams.authorId === session?.accountId.toString();

  return (
    <div className="card card-bordered p-4 flex-row justify-between">
      <div className="flex gap-2 items-center">
        <div className="label label-text">필터</div>
        <form>
          <button className={clsx("btn btn-sm rounded-full", { "btn-secondary": isDefaultPage })}>
            모두
          </button>
        </form>
        <form>
          <button name="assigneeId" value={session?.accountId} className={clsx("btn btn-sm rounded-full", { "btn-secondary": isMeAssigned })}>
            내 담당
          </button>
        </form>
        <form>
          <button name="authorId" value={session?.accountId} className={clsx("btn btn-sm rounded-full", { "btn-secondary": isMeAuthor })}>
            내가 작성한
          </button>
        </form>
      </div>
      <div className="flex gap-2 items-center">
        <form className="flex gap-2 items-center" action={async (formData: FormData) => {
          "use server";
          redirect(`?${formData.get("filter_by")!.toString()}=${encodeURIComponent(formData.get("filter_text")!.toString())}`);
        }}>
          <select name="filter_by" className="select select-bordered select-sm w-full" defaultValue={Object.keys(searchParams)[0] ?? "title"}>
            <option value="title">제목</option>
            <option value="assignee">담당자</option>
            <option value="author">작성자</option>
          </select>
          <input type="text" name="filter_text" className="input input-sm input-bordered" placeholder="검색" defaultValue={searchParams.title || searchParams.assignee || searchParams.author || ""} />
        </form>
      </div>
    </div>
  )
}