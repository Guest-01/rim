"use client"

import { Account, Prisma } from "@prisma/client"
import Link from "next/link";
import { useFormState, useFormStatus } from "react-dom";
import { editProject } from "./actions";
import clsx from "clsx";
import { useRef, useState } from "react";
import ConfirmDlg from "@/app/components/ConfirmDlg";

type ProjectWithOthers = Prisma.ProjectGetPayload<{ include: { issues: true, members: true } }>;

export default function ProjectEditForm({ project, accounts }: { project: ProjectWithOthers; accounts: Account[] }) {
  const [state, formAction] = useFormState(editProject, null)
  const [current, setCurrent] = useState(project.members);
  const [newCurrent, setNewCurrent] = useState<string[]>();
  const dlgRef = useRef<HTMLDialogElement>(null)

  return (
    <>
      <div role="alert" className={clsx("alert alert-success text-base-100 mx-auto my-2", { "hidden": !state || state.error })}>
        <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        <span>프로젝트 정보가 수정되었습니다</span>
      </div>
      <form action={formAction} className="form-control">
        <input type="hidden" name="id" defaultValue={project.id} />
        <label htmlFor="title" className="label">
          <span className="label-text">프로젝트명*</span>
          <input type="title" name="title" className="input input-sm input-bordered" defaultValue={project.title} />
        </label>
        <label htmlFor="subtitle" className="label">
          <span className="label-text">한줄 요약</span>
          <input type="subtitle" name="subtitle" className="input input-sm input-bordered" defaultValue={project.subtitle ?? ""} />
        </label>
        <label htmlFor="members" className="label">
          <span className="label-text self-start">멤버</span>
          <div className="flex flex-col join join-vertical">
            <select multiple className="select select-sm select-bordered w-32 join-item">
              {current.map(member =>
                <option key={member.id} value={member.id}>{member.name}</option>
              )}
            </select>
            <div className="btn btn-xs join-item" onClick={() => dlgRef.current?.showModal()}>수정</div>
          </div>
          <input type="hidden" name="members" defaultValue={current.map(member => member.id).toString()} />
        </label>
        <div className="my-2 text-center text-error">{state?.error}</div>
        <SubmitBtn />
        <Link href="/admin/projects" className="btn btn-sm my-2">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4">
            <path fillRule="evenodd" d="M12.5 9.75A2.75 2.75 0 0 0 9.75 7H4.56l2.22 2.22a.75.75 0 1 1-1.06 1.06l-3.5-3.5a.75.75 0 0 1 0-1.06l3.5-3.5a.75.75 0 0 1 1.06 1.06L4.56 5.5h5.19a4.25 4.25 0 0 1 0 8.5h-1a.75.75 0 0 1 0-1.5h1a2.75 2.75 0 0 0 2.75-2.75Z" clipRule="evenodd" />
          </svg>
          뒤로가기
        </Link>
      </form>
      <ConfirmDlg
        ref={dlgRef}
        title={`${project.title} 멤버 수정`}
        // @ts-ignore
        content={
          <label htmlFor="accounts" className="label">
            <span className="label-text self-start">새로운 멤버</span>
            <select name="accounts" multiple className="select select-sm select-bordered w-32 join-item" value={newCurrent}
              onChange={(e) => {
                const value = Array.from(e.target.selectedOptions, option => option.value);
                setNewCurrent(value);
              }}
            >
              {accounts.map(account =>
                <option key={account.id} value={account.id}>{account.name}</option>
              )}
            </select>
          </label>
        }
        onConfirm={() => {
          setCurrent(accounts.filter(account => newCurrent?.includes(account.id.toString())));
        }}
      />
    </>
  )
}

function SubmitBtn() {
  const { pending } = useFormStatus()
  return (
    <button type="submit" className="btn btn-primary btn-sm" disabled={pending}>
      {pending ? <div className="loading loading-xs"></div> : "수정"}
    </button>
  )
}