import Breadcrumbs from "@/app/components/Breadcrumbs";
import FilterHeader from "@/app/components/FilterHeader";
import prisma from "@/app/lib/prisma"
import ActionsColumn from "./ActionsColumn";

export default async function ProjectsAdmin() {
  const projects = await prisma.project.findMany({ include: { _count: { select: { members: true, issues: true } } } });

  const presets: { href: string; title: string; } | never[] = [
    // { href: "?", title: "a" },
    // { href: "?", title: "b" },
    // { href: "?", title: "c" },
  ]

  const selectOptions = [
    { title: "프로젝트명", value: "title" },
    { title: "한줄요약", value: "subtitle" },
  ]

  return (
    <>
      <Breadcrumbs tree={["관리자 설정", "프로젝트 관리"]} />
      <div className="card card-bordered pb-2">
        <FilterHeader presets={presets} selectOptions={selectOptions} />
        <table className="table table-sm table-fixed">
          <thead>
            <tr>
              <th className="w-12">#</th>
              <th>프로젝트명</th>
              <th>한줄 요약</th>
              <th>멤버수</th>
              <th>하위 일감 수</th>
              <th>생성 일자</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {projects.map(project => <tr key={project.id}>
              <td>{project.id}</td>
              <td>{project.title}</td>
              <td>{project.subtitle}</td>
              <td>{project._count.members}명</td>
              <td>{project._count.issues}개</td>
              <td>{project.createdAt.toLocaleString("ko")}</td>
              <ActionsColumn projectId={project.id} projectTitle={project.title} />
            </tr>)}
            {projects.length === 0 && <tr><td colSpan={7} align="center" className="text-neutral-400">No Data</td></tr>}
          </tbody>
        </table>
      </div>
    </>
  )
}