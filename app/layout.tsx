import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import "./globals.css";

import NavBar from "./components/NavBar";
import SideBar from "./components/SideBar";

const noto = Noto_Sans_KR({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Rim - Redmine Improved",
  description: "improved alternative of redmine",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode; }>) {
  return (
    <html lang="en">
      <body className={noto.className}>
        <NavBar />
        {/* 전체 화면에서 헤더(4rem)과 헤더의 아랫 보더(1px)를 뺀 값이 높이 */}
        <div className="flex" style={{ height: "calc(100vh - 4rem - 1px)" }}>
          <SideBar />
          <main className="p-4 pt-0 w-full">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
