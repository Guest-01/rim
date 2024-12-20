'use client'

import { useFormState, useFormStatus } from "react-dom"
import { login } from "./actions"

export default function Login() {
  const [errMsg, formAction] = useFormState(login, null)

  return (
    <section className="card card-compact max-w-sm mx-auto bg-base-200 mt-4">
      <h2 className="card-title mx-auto mt-4">로그인</h2>
      <div className="card-body">
        <form action={formAction} className="form-control">
          <label htmlFor="email" className="label label-text">이메일</label>
          <input type="email" name="email" placeholder="id@domain.com" className="input input-sm input-bordered" required value={"test1@test.com"} />
          <label htmlFor="password" className="label label-text">비밀번호</label>
          <input type="password" pattern="(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9!@#$%^&*,.?;~]{6,16}"
            title="6~16자리의 알파벳과 숫자 조합이 필요합니다" name="password" placeholder="******" className="input input-sm input-bordered" required value={"admin123!"} />
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
      {pending ? <div className="loading loading-xs"></div> : "로그인"}
    </button>
  )
}