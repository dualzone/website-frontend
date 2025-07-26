// src/app/layout.tsx
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Sidebar from "../components/sidebar";
import HeaderComp from "../components/header";
import { AuthProvider } from "@/context/authcontext";
import { MatchmakingProvider } from "@/context/matchmakingContext";
import { NotificationProvider } from "@/context/notificationContext";
import { NotificationsDisplay } from "@/components/notificationsDisplay";


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
                className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex-col`}
            >
                <AuthProvider>
                    <MatchmakingProvider>
                        <NotificationProvider>
                            <HeaderComp />
                            <div className="min-h-screen flex">
                                <Sidebar />
                                <main className="flex-1 overflow-hidden">{children}</main>
                            </div>
                            <div className="fixed bottom-6 right-6 z-50 pointer-events-none">
                                {/* pointer-events-none désactive interactions hors enfants */}
                                <div className="flex flex-col gap-4 pointer-events-auto max-w-sm w-full">
                                    <NotificationsDisplay />
                                </div>
                            </div>
                        </NotificationProvider>

                    </MatchmakingProvider>
                </AuthProvider>
            </body>
        </html>
    );
}