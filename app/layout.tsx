import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import "./globals.css";

import NavBar from "./NavBar";

const noto = Noto_Sans_KR({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Rim - Redmine Improved",
  description: "improved alternative of redmine",
};

export default function RootLayout({ children, }: Readonly<{ children: React.ReactNode; }>) {
  return (
    <html lang="en">
      <body className={noto.className}>
        <NavBar />
        <main className="container mx-auto py-2">
          {children}
        </main>
      </body>
    </html>
  );
}
