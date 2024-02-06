export default async function Login() {
  const errMsg = "에러메시지"

  return (
    <section className="card card-compact max-w-sm mx-auto bg-base-200">
      <h2 className="card-title mx-auto mt-4">로그인</h2>
      <div className="card-body">
        <form action="" className="form-control">
          <label className="label label-text">아이디</label>
          <input type="text" name="username" placeholder="user1234" className="input input-sm input-bordered" />
          <label className="label label-text">비밀번호</label>
          <input type="password" name="password" placeholder="******" className="input input-sm input-bordered" />
          <div className="my-2 text-center text-error">{errMsg}</div>
          <input type="submit" className="btn btn-primary btn-sm" value="로그인" />
        </form>
      </div>
    </section>
  )
}