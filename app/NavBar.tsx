import Link from "next/link";

export default function NavBar() {
  const isAuthenticated = false;

  return (
    <header className="navbar border-b justify-between">
      {/* Title */}
      <div>
        <Link href="/" className="btn btn-ghost">
          <span className="text-xl">Rim</span>
        </Link>
        <span className="mx-2 text-sm text-gray-600">
          <strong>R</strong>edmin <strong>Im</strong>proved
        </span>
      </div>
      {/* Main Actions */}
      <ul className="menu menu-sm menu-horizontal bg-base-200 rounded-box">
        <li><Link href="/issues/new">일감 생성</Link></li>
        <li><Link href="/issues">일감 목록</Link></li>
      </ul>
      {/* Search and Profiles */}
      <div className="gap-4 mr-2">
        <input type="text" placeholder="검색" className="input input-sm input-bordered w-24 md:w-auto" />
        {isAuthenticated ?
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-circle avatar">
              admin
            </div>
            <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-200 rounded-box w-52">
              <li>
                <a className="justify-between">
                  Profile
                  <span className="badge">New</span>
                </a>
              </li>
              <li><a>Settings</a></li>
              <li><a>Logout</a></li>
            </ul>
          </div>
          : <Link href="/login" className="btn btn-sm">로그인</Link>
        }
      </div>
    </header>
  )
}