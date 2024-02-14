import Breadcrumbs from "../components/Breadcrumbs";
import prisma from "../lib/prisma"

export default async function Accounts() {
  const accounts = await prisma.account.findMany();
  return (
    <>
      <Breadcrumbs tree={["관리자 설정", "계정 목록"]} />
      <div className="card card-bordered">
        <table className="table table-sm">
          <thead>
            <tr>
              <th className="w-12">#</th>
              <th>이름</th>
              <th>이메일</th>
              <th>역할</th>
              <th>상태</th>
              <th>가입일자</th>
            </tr>
          </thead>
          <tbody>
            {accounts.map(account => (
              <tr key={account.id} className="hover">
                <td>{account.id}</td>
                <td>{account.name}</td>
                <td>{account.email}</td>
                <td>{account.role ? "관리자" : "사용자"}</td>
                <td>{account.active ? "활성" : "비활성"}</td>
                <td>{account.createdAt.toLocaleString("ko")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}