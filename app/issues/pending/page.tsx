import Link from "next/link";
import Breadcrumbs from "@/app/components/Breadcrumbs";
import prisma from "@/app/lib/prisma"
import FilterHeader from "@/app/components/FilterHeader";
import { getSession } from "@/app/lib/auth";

export default async function Issues({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
  const session = await getSession();
  const issues = await prisma.issue.findMany({
    include: { assignee: true, author: true, status: true, project: true },
    orderBy: { [searchParams.sort as string ?? "id"]: searchParams.order ?? "desc" },
    where: {
      assignee: { id: session?.accountId },
      status: { value: "대기" },
      title: { contains: searchParams.filter_by === "title" ? searchParams.filter_text as string : undefined },
      authorId: { equals: searchParams.author_id ? parseInt(searchParams.author_id as string) : undefined },
      project: { title: searchParams.filter_by === "project" ? { contains: searchParams.filter_text as string } : undefined },
    },
  });

  const presets: { href: string, title: string }[] = [];

  const selectOptions = [
    { title: "제목", value: "title" },
    { title: "프로젝트", value: "project" },
  ];

  return (
    <>
      <Breadcrumbs tree={["일감", "대기 일감"]} />
      <div className="card card-bordered pb-2">
        <FilterHeader presets={presets} selectOptions={selectOptions} />
        <table className="table table-sm table-fixed">
          <thead>
            <tr>
              <th className="w-12">#</th>
              <th>프로젝트</th>
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
                <td>{issue.project?.title}</td>
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