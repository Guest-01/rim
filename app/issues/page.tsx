import prisma from "../lib/prisma"

export default async function List() {
  const issues = await prisma.issue.findMany({ include: { assignee: true } });
  // console.log(issues);
  return (
    <div className="card card-bordered p-4">
      <h2 className="card-title">이슈 목록</h2>
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
  )
}