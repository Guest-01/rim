import Breadcrumbs from "@/app/components/Breadcrumbs";
import prisma from "@/app/lib/prisma";
import clsx from "clsx";

export default async function Issue({ params }: { params: { id: string } }) {
  const issue = await prisma.issue.findUnique({
    where: { id: parseInt(params.id) },
    include: { author: true, assignee: true, status: true, project: true }
  });

  return (
    <>
      <Breadcrumbs tree={["일감", `#${params.id}`]} />
      <article className="card card-bordered card-compact">
        <div className="card-body">
          <div className="text-xs">프로젝트: {issue?.project?.title}</div>
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
      <div className="my-2"></div>
      <div className="card card-bordered card-compact">
        <div className="card-body">
          <span>담당자 대기</span>
          <div className="card-actions items-center">
            <button className="btn btn-sm">직접 담당</button>
            <button className="btn btn-sm">담당 신청</button>
            <button className="btn btn-sm">담당 수락</button>
            <button className="btn btn-sm">담당 거절</button>
            <div className="avatar-group -space-x-4 rtl:space-x-reverse">
              <div className="avatar placeholder">
                <div className="bg-neutral text-neutral-content rounded-full w-8">
                  <span className="text-xs">AB</span>
                </div>
              </div>
              <div className="avatar placeholder">
                <div className="bg-neutral text-neutral-content rounded-full w-8">
                  <span className="text-xs">CD</span>
                </div>
              </div>
              <div className="avatar placeholder">
                <div className="bg-neutral text-neutral-content rounded-full w-8">
                  <span className="text-xs">EF</span>
                </div>
              </div>
              <div className="avatar placeholder">
                <div className="w-8 bg-neutral text-neutral-content">
                  <span>+99</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
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