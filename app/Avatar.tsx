import { Account } from "@prisma/client"
import { deleteSession } from "./lib/auth";
import { redirect } from "next/navigation";

export default function Avatar({ account }: { account: Account }) {
  return (
    <div className="dropdown dropdown-end">
      <div tabIndex={0} role="button" className="btn btn-circle avatar">
        {account.name.substring(0, 2)}
      </div>
      <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-200 rounded-box w-52">
        {/* <li>
          <a className="justify-between">
            Profile
            <span className="badge">New</span>
          </a>
        </li>
        <li><a>Settings</a></li> */}
        <form action={async () => {
          "use server";
          await deleteSession();
          redirect("/login");
        }}>
          <li>
            <button type="submit">로그아웃</button>
          </li>
        </form>
      </ul>
    </div>
  )
}