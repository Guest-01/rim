import Breadcrumbs from "@/app/components/Breadcrumbs";
import prisma from "@/app/lib/prisma";

export default async function Issue({ params }: { params: { id: string } }) {
  const issue = await prisma.issue.findUnique({ where: { id: parseInt(params.id) }, include: { author: true, assignee: true } });

  return (
    <>
      <Breadcrumbs tree={["일감", "일감 목록", `#${params.id}`]} />
      <article className="card card-bordered card-compact">
        <h2 className="card-title px-4 mt-2">
          <div className="badge badge-primary">진행중</div>
          {issue?.title}
        </h2>
        <div className="card-body">
          <div className="flex gap-4 lg:gap-44">
            <ul>
              <li>작성자: 홍길동1</li>
              <li>담당자: 홍길동2</li>
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
    </>
  )
}