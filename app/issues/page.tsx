import Link from "next/link";
import Breadcrumbs from "../components/Breadcrumbs";
import prisma from "../lib/prisma"
import FilterHeader from "../components/FilterHeader";

export default async function Issues({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
  const issues = await prisma.issue.findMany({
    include: { assignee: true, author: true, status: true },
    orderBy: { [searchParams.sort as string ?? "id"]: searchParams.order ?? "desc" },
    where: {
      issueStatusId: { equals: searchParams.status ? parseInt(searchParams.status as string) : undefined },
      title: { contains: searchParams.filter_by === "title" ? searchParams.filter_text as string : undefined },
      assignee: { name: searchParams.filter_by === "assignee" ? { contains: searchParams.filter_text as string } : undefined },
      assigneeId: searchParams.assignee_id === "null" ? null : undefined,
      authorId: { equals: searchParams.author_id ? parseInt(searchParams.author_id as string) : undefined },
    },
  });

  console.log(issues);


  const status = await prisma.issueStatus.findMany();
  const presets = [
    { href: `?assignee_id=null`, title: "담당 미정" },
    ...status.map(st => ({ href: `?status=${st.id}`, title: st.value })),
  ]

  const selectOptions = [
    { title: "제목", value: "title" },
    { title: "담당자", value: "assignee" },
  ]

  return (
    <>
      <Breadcrumbs tree={["일감", "모든 일감"]} />
      <div className="card card-bordered pb-2">
        <FilterHeader presets={presets} selectOptions={selectOptions} />
        <table className="table table-sm table-fixed">
          <thead>
            <tr>
              <th className="w-12">#</th>
              <th>제목</th>
              <th>상태</th>
              <th>담당자</th>
              <th>생성일자</th>
            </tr>
          </thead>
          <tbody>
            {issues.map(issue => (
              <tr key={issue.id} className="hover">
                <td>{issue.id}</td>
                <td>
                  <Link href={`/issues/${issue.id}`} className="link-hover hover:cursor-pointer">
                    {issue.title}
                  </Link>
                </td>
                <td className="text-nowrap">{issue.status.value}</td>
                <td className="text-nowrap">{issue.assignee?.name}</td>
                <td>{issue.createdAt.toLocaleString("ko")}</td>
              </tr>
            ))}
            {issues.length === 0 && <tr><td colSpan={6} align="center" className="text-neutral-400">No Data</td></tr>}
          </tbody>
        </table>
      </div>
    </>
  )
}