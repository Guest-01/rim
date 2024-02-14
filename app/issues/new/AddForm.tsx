'use client'

import { useFormState, useFormStatus } from "react-dom";
import { createIssue } from "./actions";
import { Account } from "@prisma/client";

export default function AddForm({ accounts }: { accounts: Account[] }) {
  let [errMsg, formAction] = useFormState(createIssue, null)

  return (
    <form action={formAction} className="form-control">
      <label htmlFor="title" className="label label-text">제목</label>
      <input type="text" name="title" placeholder="[Project A] 초기 기획서 작성" className="input input-sm input-bordered" />
      <label htmlFor="assignee" className="label label-text">담당자</label>
      <select name="assignee" className="select select-bordered select-sm w-full" defaultValue="null">
        <option value="null">(미정)</option>
        {accounts.map(account => (
          <option key={account.id} value={account.id}>{account.name}</option>
        ))}
      </select>
      <label htmlFor="content" className="label label-text">내용</label>
      <textarea name="content" className="textarea textarea-sm textarea-bordered" placeholder="# 대제목 ## 중제목 ### 소제목"></textarea>
      <div className="my-2 text-error">{errMsg}</div>
      <ActionButtons />
    </form>
  )
}

function ActionButtons() {
  const { pending } = useFormStatus(); // 컴포넌트가 form 내부에 있어야 동작하는 hook. 그래서 따로 분리함.
  return (
    <div className="flex gap-2">
      {/* form 태그 안에 button이 있으면 자동으로 submit해버림 따라서 다른 버튼은 div로 변경 */}
      {/* <div className="btn btn-ghost btn-sm" onClick={() => { }}>임시저장</div> */}
      <button type="submit" className="btn btn-sm btn-primary">{pending ? <span className="loading loading-xs" /> : "생성"}</button>
    </div>
  )
}