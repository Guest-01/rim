import Breadcrumbs from "@/app/components/Breadcrumbs";
import prisma from "@/app/lib/prisma";
import clsx from "clsx";
import AssignCard from "./AssignCard";
import { getSession } from "@/app/lib/auth";

export default async function Issue({ params }: { params: { id: string } }) {
  const issue = await prisma.issue.findUniqueOrThrow({
    where: { id: parseInt(params.id) },
    include: { author: true, assignee: true, status: true, project: true, candidates: true }
  });

  const session = await getSession();

  return (
    <>
      <Breadcrumbs tree={["일감", `#${params.id}`]} />
      <article className="card card-bordered card-compact">
        <div className="card-body">
          <div className="text-xs">상위 프로젝트: {issue?.project?.title}</div>
          <h2 className="card-title">
            <div className={clsx("badge", {
              "badge-neutral": issue?.status.value === "신규",
              "badge-primary": issue?.status.value === "진행중",
              "badge-outline": issue?.status.value === "완료",
            })}>
              {issue?.status.value}
            </div>
            {issue?.title}
          </h2>
          <div className="flex gap-4 lg:gap-32">
            <ul>
              <li>작성자: {issue?.author?.name}</li>
              <li>담당자: {issue?.assignee?.name}</li>
            </ul>
            <ul>
              <li>작성일: {issue?.createdAt.toLocaleString("ko")}</li>
              <li>수정일: {issue?.updatedAt.toLocaleString("ko")}</li>
            </ul>
          </div>
          <div className="divider">이하 내용</div>
          <p>
            {issue?.content}
          </p>
        </div>
      </article>
      {session &&
        <>
          <div className="my-2"></div>
          <AssignCard issue={issue} session={session} />
        </>
      }
      <div className="my-2"></div>
      <div className="card card-bordered card-compact">
        <div className="card-body">
          <form action="" className="form-control">
            <textarea name="comment" className="textarea textarea-sm textarea-bordered" placeholder="댓글 입력" />
            <button type="submit" className="btn btn-sm mt-2">댓글 등록</button>
          </form>
        </div>
      </div>
    </>
  )
}