import Breadcrumbs from "../components/Breadcrumbs";
import prisma from "../lib/prisma"
import AccountRow from "./AccountRow";

export default async function Accounts() {
  const accounts = await prisma.account.findMany({ include: { role: true } });
  return (
    <>
      <Breadcrumbs tree={["관리자 설정", "계정 목록"]} />
      <div className="card card-bordered">
        <table className="table table-sm table-fixed">
          <thead>
            <tr>
              <th className="w-12">#</th>
              <th>이름</th>
              <th>이메일</th>
              <th>역할</th>
              <th>상태</th>
              <th>가입일자</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {accounts.map(account => (
              <AccountRow key={account.id} account={account} />
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}