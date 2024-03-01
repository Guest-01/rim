import Breadcrumbs from "../components/Breadcrumbs";
import { getSession } from "../lib/auth";
import prisma from "../lib/prisma";

export default async function Projects() {
  const session = await getSession()
  const projects = await prisma.project.findMany({
    where: { members: { some: { id: session?.accountId } } },
    include: { _count: { select: { issues: true } } }
  });

  console.log(projects)
  return (
    <>
      <Breadcrumbs tree={["프로젝트", "내 프로젝트"]} />
      <p className="text-sm mb-4 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4">
          <path fillRule="evenodd" d="M15 8A7 7 0 1 1 1 8a7 7 0 0 1 14 0ZM9 5a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM6.75 8a.75.75 0 0 0 0 1.5h.75v1.75a.75.75 0 0 0 1.5 0v-2.5A.75.75 0 0 0 8.25 8h-1.5Z" clipRule="evenodd" />
        </svg>
        아래 프로젝트에 소속되어 있습니다. 소속된 프로젝트의 하위 일감만 볼 수 있습니다.
      </p>
      <div className="grid lg:grid-cols-4 lg:gap-4">
        {projects.map(project =>
          <section key={project.id} className="card card-compact shadow">
            <div className="card-body">
              <div className="card-title">{project.title}</div>
              <p>{project.subtitle}</p>
              <div className="card-actions justify-end">
                <button className="btn btn-sm">하위 {project._count.issues}개 일감 보기</button>
              </div>
            </div>
          </section>)}
      </div>
    </>
  )
}