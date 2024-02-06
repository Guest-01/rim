'use client'

import { useFormState, useFormStatus } from "react-dom";
import { createIssue } from "./actions";

export default function New() {
  let [error, formAction] = useFormState(createIssue, null)

  return (
    <>
      <h2>일감 생성하기</h2>
      <form action={formAction} className="form-control">
        <label className="label label-text">제목</label>
        <input type="text" name="title" placeholder="[Project A] 초기 기획서 작성" className="input input-sm input-bordered" />
        <label className="label label-text">내용</label>
        <textarea name="content" className="textarea textarea-sm textarea-bordered" placeholder="# 대제목 ## 중제목 ### 소제목"></textarea>
        <div className="my-2 text-error">{error}</div>
        <ActionButtons />
      </form>
    </>
  )
}

function ActionButtons() {
  const { pending } = useFormStatus(); // 컴포넌트가 form 내부에 있어야 동작하는 hook. 그래서 따로 분리함.
  return (
    <div className="flex gap-2 justify-end">
      <button className="btn btn-ghost btn-sm" disabled={pending}>임시저장</button>
      <button type="submit" className="btn btn-sm btn-primary">{pending ? <span className="loading loading-xs" /> : "생성"}</button>
    </div>
  )
}