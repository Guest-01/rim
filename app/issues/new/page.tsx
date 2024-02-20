import prisma from "@/app/lib/prisma"
import AddForm from "./AddForm";
import Breadcrumbs from "@/app/components/Breadcrumbs";

export default async function New() {
  const accounts = await prisma.account.findMany();
  const issueStatusList = await prisma.issueStatus.findMany();
  return (
    <>
      <Breadcrumbs tree={["일감", "일감 생성"]} />
      <div className="card card-bordered p-4 pt-2">
        <AddForm accounts={accounts} issueStatusList={issueStatusList} />
      </div>
    </>
  )
}