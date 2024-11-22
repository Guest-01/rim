import Breadcrumbs from "@/app/components/Breadcrumbs";
import ProjectEditForm from "./ProjectEditForm";
import prisma from "@/app/lib/prisma";

export default async function ProjectEdit({ params }: { params: { id: string } }) {
  const project = await prisma.project.findUniqueOrThrow({ where: { id: parseInt(params.id) }, include: { members: true, issues: true } });
  const accounts = await prisma.account.findMany();

  return (
    <>
      <Breadcrumbs tree={["관리자 설정", "프로젝트 관리", `${params.id}번 프로젝트`]} />
      <div className="card card-bordered border-base-300 shadow max-w-md px-4 py-2">
        <ProjectEditForm project={project} accounts={accounts} />
      </div>
    </>
  )
}