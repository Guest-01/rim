import prisma from "@/app/lib/prisma"
import AddForm from "./AddForm";

export default async function New() {
  const accounts = await prisma.account.findMany();
  return (
    <>
    <h2>일감 생성</h2>
    <AddForm accounts={accounts} />
    </>
  )
}