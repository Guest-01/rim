import prisma from "../lib/prisma"

export default async function Accounts() {
  const accounts = await prisma.account.findMany();
  // console.log(accounts);
  return (
    <div className="card card-bordered p-4">
      <h2 className="card-title">계정 목록</h2>
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
              <th>{account.id}</th>
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
  )
}