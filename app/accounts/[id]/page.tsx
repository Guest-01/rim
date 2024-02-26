import Breadcrumbs from "@/app/components/Breadcrumbs"
import AccountEditForm from "./AccountEditForm"
import prisma from "@/app/lib/prisma"

export default async function AccountDetail({ params }: { params: { id: string } }) {
  const account = await prisma.account.findUniqueOrThrow({ where: { id: parseInt(params.id) }, include: { role: true } });
  return (
    <>
      <Breadcrumbs tree={["관리자 설정", "계정 목록", `${params.id}번 계정`]} />
      <div className="card card-bordered lg:max-w-sm px-4 py-2 mx-auto">
        <AccountEditForm account={account} />
      </div>
    </>
  )
}