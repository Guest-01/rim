"use client"

import { Account } from "@prisma/client";
import { activate, deleteAccount } from "./actions";
import Link from "next/link";

export default function AccountRow({ account }: { account: Account }) {
  return (
    <tr key={account.id} className="hover">
      <td>{account.id}</td>
      <td>{account.name}</td>
      <td>{account.email}</td>
      <td>{account.role ? "관리자" : "사용자"}</td>
      <td className="w-fit text-nowrap flex gap-2 items-center">
        {account.active ? "활성" : "비활성"}
        {account.active ? null : <button className="btn btn-xs" onClick={() => activate(account.id)}>활성화</button>}
      </td>
      <td>{account.createdAt.toLocaleString("ko")}</td>
      <td className="w-fit text-nowrap flex gap-2 items-center">
        <Link href={`/accounts/${account.id}`} className="btn btn-xs">수정</Link>
        <button className="btn btn-xs btn-error" onClick={() => deleteAccount(account.id)}>삭제</button>
      </td>
    </tr>
  )
}
