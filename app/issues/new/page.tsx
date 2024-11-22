import prisma from "@/app/lib/prisma"
import AddForm from "./AddForm";
import Breadcrumbs from "@/app/components/Breadcrumbs";

export default async function New({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
  const accounts = await prisma.account.findMany();
  const issueStatusList = await prisma.issueStatus.findMany();
  const projects = await prisma.project.findMany();
  return (
    <>
      <Breadcrumbs tree={["일감", "일감 생성"]} />
      <div className="card card-bordered border-base-300 shadow p-4 pt-2">
        <AddForm
          projects={projects}
          selectedProjectId={searchParams.project_id as string | undefined}
          accounts={accounts}
          issueStatusList={issueStatusList}
        />
      </div>
    </>
  )
}