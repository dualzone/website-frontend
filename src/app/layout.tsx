import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Sidebar from "../components/sidebar";
import HeaderComp from "../components/header";
import { AuthProvider } from "@/context/authcontext"; // ou depuis le bon chemin si tu l’as déplacé

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "DualZone",
  description: "Dual Zone is a competitive based website.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased
        min-h-screen
        flex-col
        `}
      >
      <AuthProvider>
      <HeaderComp/>
      <div className="min-h-screen flex">
        <Sidebar />
          <main className="flex-1 p-6">{children}</main>
        </div>
      </AuthProvider>
      </body>
    </html>
  );
}
