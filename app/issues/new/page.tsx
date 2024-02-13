'use client'

import { useFormState, useFormStatus } from "react-dom";
import { createIssue } from "./actions";

export default function New() {
  let [errMsg, formAction] = useFormState(createIssue, null)

  return (
    <>
      <h2>일감 생성하기</h2>
      <form action={formAction} className="form-control">
        <label htmlFor="title" className="label label-text">제목</label>
        <input type="text" name="title" placeholder="[Project A] 초기 기획서 작성" className="input input-sm input-bordered" />
        <label htmlFor="assignee" className="label label-text">담당자</label>
        <select className="select select-bordered select-sm w-full">
          <option selected>사용자1</option>
          <option>사용자2</option>
          <option>사용자3</option>
        </select>
        <label htmlFor="content" className="label label-text">내용</label>
        <textarea name="content" className="textarea textarea-sm textarea-bordered" placeholder="# 대제목 ## 중제목 ### 소제목"></textarea>
        <div className="my-2 text-error">{errMsg}</div>
        <ActionButtons />
      </form>
    </>
  )
}

function ActionButtons() {
  const { pending } = useFormStatus(); // 컴포넌트가 form 내부에 있어야 동작하는 hook. 그래서 따로 분리함.
  return (
    <div className="flex gap-2">
      {/* form 태그 안에 button이 있으면 자동으로 submit해버림 따라서 다른 버튼은 div로 변경 */}
      <div className="btn btn-ghost btn-sm" onClick={() => { }}>임시저장</div>
      <button type="submit" className="btn btn-sm btn-primary">{pending ? <span className="loading loading-xs" /> : "생성"}</button>
    </div>
  )
}