"use client";
import { Prisma } from "@prisma/client";
import Link from "next/link";
import { useFormState, useFormStatus } from "react-dom"
import { editAccount } from "./actions";
import clsx from "clsx";

type AccountWithRole = Prisma.AccountGetPayload<{ include: { role: true } }>;

export default function AccountEditForm({ account }: { account: AccountWithRole }) {
  const [state, formAction] = useFormState(editAccount, null)

  return (
    <>
      <div role="alert" className={clsx("alert alert-success text-base-100 mx-auto my-2", { "hidden": !state || state.error })}>
        <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        <span>계정 정보가 수정되었습니다</span>
      </div>
      <form action={formAction} className="form-control">
        <input type="hidden" name="id" defaultValue={account.id} />
        <label htmlFor="email" className="label">
          <span className="label-text">이메일</span>
          <input type="email" name="email" className="input input-sm input-bordered" disabled defaultValue={account.email} />
        </label>
        <label htmlFor="username" className="label">
          <span className="label-text">이름</span>
          <input type="text" name="username" className="input input-sm input-bordered" defaultValue={account.name} />
        </label>
        <label className="label">
          <span className="label-text">비밀번호</span>
          <div className="btn btn-sm" onClick={() => { }}>초기화</div>
        </label>
        <label htmlFor="role" className="label">
          <span className="label-text">역할</span>
          <div className="flex gap-4">
            <label className="label cursor-pointer gap-2">
              <input type="radio" name="role" className="radio radio-sm" value="관리자" defaultChecked={account.role.value === "관리자"} />
              <span className="label-text">관리자</span>
            </label>
            <label className="label cursor-pointer gap-2">
              <input type="radio" name="role" className="radio radio-sm" value="사용자" defaultChecked={account.role.value === "사용자"} />
              <span className="label-text">사용자</span>
            </label>
          </div>
        </label>
        <label className="label cursor-pointer">
          <span className="label-text">활성 상태</span>
          <input type="checkbox" name="active" className="toggle toggle-sm" defaultChecked={account.active} />
        </label>
        <label htmlFor="description" className="label">
          <span className="label-text">메모</span>
          <input type="text" name="description" className="input input-sm input-bordered" defaultValue={account.description ?? undefined} />
        </label>
        <div className="my-2 text-center text-error">{state?.error}</div>
        <SubmitBtn />
        <Link href="/accounts" className="btn btn-sm my-2">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4">
            <path fillRule="evenodd" d="M12.5 9.75A2.75 2.75 0 0 0 9.75 7H4.56l2.22 2.22a.75.75 0 1 1-1.06 1.06l-3.5-3.5a.75.75 0 0 1 0-1.06l3.5-3.5a.75.75 0 0 1 1.06 1.06L4.56 5.5h5.19a4.25 4.25 0 0 1 0 8.5h-1a.75.75 0 0 1 0-1.5h1a2.75 2.75 0 0 0 2.75-2.75Z" clipRule="evenodd" />
          </svg>
          뒤로가기
        </Link>
      </form>
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