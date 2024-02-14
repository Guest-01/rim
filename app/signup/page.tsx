'use client'

import { useFormState, useFormStatus } from "react-dom"
import { signUp } from "./actions"

export default function SignUp() {
  const [errMsg, formAction] = useFormState(signUp, null)

  return (
    <section className="card card-compact max-w-sm mx-auto bg-base-200 mt-4">
      <h2 className="card-title mx-auto mt-4">회원가입</h2>
      <div className="card-body">
        <form action={formAction} className="form-control">
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
      {pending ? <div className="loading loading-xs"></div> : "가입 요청"}
    </button>
  )
}