'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Drawer({ children }: Readonly<{ children: React.ReactNode; }>) {
  const pathname = usePathname();
  if (pathname.includes("login") || pathname.includes("signup")) {
    return children;
  }

  const menus = [
    {
      icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4">
        <path d="M5.5 3.5A1.5 1.5 0 0 1 7 2h2.879a1.5 1.5 0 0 1 1.06.44l2.122 2.12a1.5 1.5 0 0 1 .439 1.061V9.5A1.5 1.5 0 0 1 12 11V8.621a3 3 0 0 0-.879-2.121L9 4.379A3 3 0 0 0 6.879 3.5H5.5Z" />
        <path d="M4 5a1.5 1.5 0 0 0-1.5 1.5v6A1.5 1.5 0 0 0 4 14h5a1.5 1.5 0 0 0 1.5-1.5V8.621a1.5 1.5 0 0 0-.44-1.06L7.94 5.439A1.5 1.5 0 0 0 6.878 5H4Z" />
      </svg>,
      groupName: "일감",
      children: [
        { href: "/issues/new", title: "일감 생성" },
        { href: "/issues", title: "일감 목록" },
      ]
    },
    {
      icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4">
        <path fillRule="evenodd" d="M6.455 1.45A.5.5 0 0 1 6.952 1h2.096a.5.5 0 0 1 .497.45l.186 1.858a4.996 4.996 0 0 1 1.466.848l1.703-.769a.5.5 0 0 1 .639.206l1.047 1.814a.5.5 0 0 1-.14.656l-1.517 1.09a5.026 5.026 0 0 1 0 1.694l1.516 1.09a.5.5 0 0 1 .141.656l-1.047 1.814a.5.5 0 0 1-.639.206l-1.703-.768c-.433.36-.928.649-1.466.847l-.186 1.858a.5.5 0 0 1-.497.45H6.952a.5.5 0 0 1-.497-.45l-.186-1.858a4.993 4.993 0 0 1-1.466-.848l-1.703.769a.5.5 0 0 1-.639-.206l-1.047-1.814a.5.5 0 0 1 .14-.656l1.517-1.09a5.033 5.033 0 0 1 0-1.694l-1.516-1.09a.5.5 0 0 1-.141-.656L2.46 3.593a.5.5 0 0 1 .639-.206l1.703.769c.433-.36.928-.65 1.466-.848l.186-1.858Zm-.177 7.567-.022-.037a2 2 0 0 1 3.466-1.997l.022.037a2 2 0 0 1-3.466 1.997Z" clipRule="evenodd" />
      </svg>,
      groupName: "관리자 설정",
      children: [
        { href: "/accounts", title: "계정 목록" },
      ]
    },
  ]

  return (
    <div className="drawer lg:drawer-open">
      <input id="my-drawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content">
        {/* Page content here */}
        {children}
      </div>
      <div className="drawer-side">
        <label htmlFor="my-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
        <ul className="menu p-4 min-w-64 min-h-full bg-base-200 text-base-content">
          {/* Sidebar content here */}
          {menus.map(group => {
            return (
              <li key={group.groupName}>
                <details open>
                  <summary>
                    {group.icon}
                    {group.groupName}
                  </summary>
                  <ul>
                    {group.children.map(menu =>
                      <li key={menu.title}>
                        <Link href={menu.href} className={`${pathname === menu.href ? "active" : ""}`}>{menu.title}</Link>
                      </li>)}
                  </ul>
                </details>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}