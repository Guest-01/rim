'use client'

import { useFormState, useFormStatus } from "react-dom"
import { signUp } from "./actions"
import { useEffect, useRef } from "react";
import clsx from "clsx";

export default function SignUp() {
  const [state, formAction] = useFormState(signUp, null);
  const form = useRef<HTMLFormElement>(null);
  const radio1 = useRef<HTMLInputElement>(null);
  const radio2 = useRef<HTMLInputElement>(null);

  // 성공한 경우에는 form을 리셋. 에러가 발생하면 입력값 유지.
  useEffect(() => {
    if (state?.error) return;
    form.current?.reset();
  }, [state])

  return (
    <>
      <div role="alert" className={clsx("alert alert-success text-base-100 mx-auto mt-2 lg:max-w-sm", { "hidden": !state || state.error })}>
        <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        <span>계정 등록 요청이 완료되었습니다</span>
      </div>
      <section className="card card-compact max-w-sm mx-auto bg-base-200 mt-4">
        <h2 className="card-title mx-auto mt-4">계정 등록</h2>
        <div className="card-body">
          <form ref={form} action={formAction} className="form-control">
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
            <div className="my-2 text-center text-error">{state?.error}</div>
            <SubmitBtn />
          </form>
        </div>
      </section>
    </>
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