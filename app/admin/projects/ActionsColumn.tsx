'use client';

import ConfirmDlg from "@/app/components/ConfirmDlg";
import { useRef } from "react";
import { deleteProject } from "./actions";
import Link from "next/link";

export default function ActionsColumn({ projectId, projectTitle }: { projectId: number; projectTitle: string; }) {
  const dlg = useRef<HTMLDialogElement | null>(null);

  return (
    <>
      <td className="space-x-2">
        <Link href={`/admin/projects/${projectId}`} className="btn btn-xs">수정</Link>
        <button className="btn btn-xs btn-error text-base-100" onClick={() => dlg.current?.showModal()}>삭제</button>
      </td>
      <ConfirmDlg
        ref={dlg}
        title={`${projectId}번 프로젝트 삭제`}
        content={`${projectTitle} 프로젝트를 삭제하시겠습니까?`}
        onConfirm={() => deleteProject(projectId)}
        isDestructive
      />
    </>
  )
}