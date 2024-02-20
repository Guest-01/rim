'use client'

import { useFormState, useFormStatus } from "react-dom"
import { signUp } from "./actions"
import { useRef } from "react";

export default function SignUp() {
  const [errMsg, formAction] = useFormState(signUp, null)
  const radio1 = useRef<HTMLInputElement>(null);
  const radio2 = useRef<HTMLInputElement>(null);

  return (
    <section className="card card-compact max-w-sm mx-auto bg-base-200 mt-4">
      <h2 className="card-title mx-auto mt-4">계정 등록</h2>
      <div className="card-body">
        <form action={formAction} className="form-control">
          <div className="flex gap-8 justify-center">
            <label htmlFor="role" className="label gap-2 hover:cursor-pointer" onClick={() => radio1.current!.checked = true}>
              <input ref={radio1} type="radio" name="role" className="radio radio-sm radio-primary" value="관리자" />
              <span className="label-text">관리자</span>
            </label>
            <label htmlFor="role" className="label gap-2 hover:cursor-pointer" onClick={() => radio2.current!.checked = true}>
              <input ref={radio2} type="radio" name="role" className="radio radio-sm radio-primary" value="사용자" defaultChecked />
              <span className="label-text">사용자</span>
            </label>
          </div>
          <label htmlFor="email" className="label label-text">이메일</label>
          <input type="email" name="email" placeholder="id@domain.com" className="input input-sm input-bordered" required />
          <label htmlFor="username" className="label label-text">이름</label>
          <input type="text" name="username" placeholder="홍길동" className="input input-sm input-bordered" required />
          <label htmlFor="password" className="label label-text">비밀번호</label>
          <input type="password" pattern="(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9!@#$%^&*,.?;~]{6,16}"
            title="6~16자리의 알파벳과 숫자 조합이 필요합니다" name="password" placeholder="******" className="input input-sm input-bordered" required />
          <label htmlFor="passwordConfirm" className="label label-text">비밀번호 확인</label>
          <input type="password" name="passwordConfirm" placeholder="******" className="input input-sm input-bordered" required />
          <div className="my-2 text-center text-error">{errMsg}</div>
          <SubmitBtn />
        </form>
      </div>
    </section>
  )
}

function SubmitBtn() {
  const { pending } = useFormStatus()
  return (
    <button type="submit" className="btn btn-primary btn-sm" disabled={pending}>
      {pending ? <div className="loading loading-xs"></div> : "등록 요청"}
    </button>
  )
}