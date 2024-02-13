import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import "./globals.css";

import NavBar from "./components/NavBar";
import Drawer from "./components/Drawer";

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
        <Drawer>
          <main className="p-2">
            {children}
          </main>
        </Drawer>
      </body>
    </html>
  );
}
