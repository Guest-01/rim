"use client"

import { Account } from "@prisma/client";
import { activate, deleteAccount } from "./actions";
import Link from "next/link";
import ConfirmDlg from "../components/ConfirmDlg";
import { useRef } from "react";

export default function AccountRow({ account }: { account: Account }) {
  const dlg = useRef<HTMLDialogElement | null>(null);

  return (
    <>
      <tr key={account.id} className="hover">
        <td>{account.id}</td>
        <td>{account.name}</td>
        <td>{account.email}</td>
        <td>{account.role ? "관리자" : "사용자"}</td>
        <td className="text-nowrap flex gap-2 items-center">
          {account.active ? "활성" : "비활성"}
          {account.active ? null : <button className="btn btn-xs btn-info text-base-100" onClick={() => activate(account.id)}>활성화</button>}
        </td>
        <td className="text-nowrap">{account.createdAt.toLocaleString("ko")}</td>
        <td className="text-nowrap flex gap-2 items-center">
          <Link href={`/accounts/${account.id}`} className="btn btn-xs">수정</Link>
          <button className="btn btn-xs btn-error text-base-100" onClick={() => dlg.current?.showModal()}>삭제</button>
        </td>
      </tr>
      <ConfirmDlg
        ref={dlg}
        title={`${account.id}번 계정 삭제`}
        content={`${account.name} 계정을 삭제하시겠습니까?`}
        onConfirm={() => deleteAccount(account.id)} isDestructive
      />
    </>
  )
}
