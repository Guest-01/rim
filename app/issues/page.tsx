import Breadcrumbs from "../components/Breadcrumbs";
import prisma from "../lib/prisma"
import Filter from "./Filter";

export default async function Issues({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
  const issues = await prisma.issue.findMany({
    include: { assignee: true },
    orderBy: { [searchParams.sort as string ?? "id"]: searchParams.order ?? "desc" }
  });

  return (
    <>
      <Breadcrumbs tree={["일감", "일감 목록"]} />
      <Filter searchParams={searchParams} />
      <div className="card card-bordered mt-4">
        <table className="table table-sm">
          <thead>
            <tr>
              <th className="w-12">#</th>
              <th>제목</th>
              <th className="w-24">담당자</th>
              <th className="w-44">생성일자</th>
              <th className="w-44">수정일자</th>
            </tr>
          </thead>
          <tbody>
            {issues.map(issue => (
              <tr key={issue.id} className="hover">
                <td>{issue.id}</td>
                <td>{issue.title}</td>
                <td className="text-nowrap">{issue.assignee?.name}</td>
                <td>{issue.createdAt.toLocaleString("ko")}</td>
                <td>{issue.updatedAt.toLocaleString("ko")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}