import Breadcrumbs from "../components/Breadcrumbs";
import FilterHeader from "../components/FilterHeader";
import prisma from "../lib/prisma"
import AccountRow from "./AccountRow";

export default async function Accounts({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
  const accounts = await prisma.account.findMany({ include: { role: true } });
  console.log(searchParams);

  const presets = [
    { href: "?role=0", title: "관리자" },
    { href: "?role=1", title: "사용자" },
    { href: "?active=true", title: "활성" },
    { href: "?active=false", title: "비활성" },
  ]

  const selectOptions = [
    { title: "이메일", value: "email" },
    { title: "이름", value: "name" },
  ]

  return (
    <>
      <Breadcrumbs tree={["관리자 설정", "계정 목록"]} />
      <div className="card card-bordered">
        <FilterHeader presets={presets} selectOptions={selectOptions} />
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