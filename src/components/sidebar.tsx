// src/components/sidebar.tsx
"use client";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/context/authcontext";
import { useState, useEffect } from "react";

export default function Sidebar() {
    const { isConnected } = useAuth();
    const [friendsOnline, setFriendsOnline] = useState(3);
    const [isInQueue, setIsInQueue] = useState(false);

    // Simuler la mise à jour du nombre d'amis connectés
    useEffect(() => {
        if (isConnected) {
            const interval = setInterval(() => {
                setFriendsOnline(Math.floor(Math.random() * 8) + 1);
            }, 30000);

            return () => clearInterval(interval);
        }
    }, [isConnected]);

    return (
        <aside className="group w-16 hover:w-64 bg-gray-700 border-r border-gray-800 transition-all duration-300 overflow-hidden min-h-screen fixed top-0 pt-20 h-screen z-10">
            <nav className="flex flex-col h-full group transition-all">

                {/* Jouer */}
                <Link href="/" className="flex items-center pb-3 pt-3 hover:bg-gray-600 rounded mt-1.5 mb-1.5 relative">
                    <span className="h-5 w-5 min-h-[25px] min-w-[25px] ml-4">
                        <Image
                            className="justify-center"
                            src="/DualZone-Play.svg"
                            alt="Play"
                            width={25}
                            height={25}
                        />
                    </span>
                    <span className="text-gray-700 group-hover:text-white group-hover:inline-block transition duration-200 ml-4">
                        Jouer
                    </span>
                    {isInQueue && (
                        <div className="absolute right-2 w-3 h-3 bg-green-500 rounded-full animate-pulse group-hover:mr-4"></div>
                    )}
                </Link>

                {/* Dashboard */}
                <Link href={isConnected ? "/dashboard" : "/"} className="flex items-center pb-3 pt-3 hover:bg-gray-600 rounded mt-1.5 mb-1.5">
                    <span className="h-5 w-5 min-h-[25px] min-w-[25px] ml-4">
                        <Image
                            className="justify-center"
                            src="/Classement-DualZone.svg"
                            alt="Dashboard"
                            width={25}
                            height={25}
                        />
                    </span>
                    <span className="group-hover:inline-block text-gray-700 group-hover:text-white transition duration-200 ml-4">
                        Dashboard
                    </span>
                </Link>

                {/* Profil */}
                <Link href={isConnected ? "/profil" : "/"} className="flex items-center pb-3 pt-3 hover:bg-gray-600 rounded mt-1.5 mb-1.5">
                    <span className="h-5 w-5 min-h-[25px] min-w-[25px] ml-4">
                        <Image
                            className="justify-center"
                            src="/User Rank.svg"
                            alt="Profil"
                            width={25}
                            height={25}
                        />
                    </span>
                    <span className="ml-4 group-hover:inline-block text-gray-700 group-hover:text-white transition duration-200">
                        Profil
                    </span>
                </Link>

                {/* Classement */}
                <Link href={isConnected ? "/classement" : "/"} className="flex items-center pb-3 pt-3 hover:bg-gray-600 rounded mt-1.5 mb-1.5">
                    <span className="h-5 w-5 min-h-[25px] min-w-[25px] ml-4">
                        <Image
                            className="justify-center"
                            src="/Classement-DualZone.svg"
                            alt="Classement"
                            width={25}
                            height={25}
                        />
                    </span>
                    <span className="ml-4 group-hover:inline-block text-gray-700 group-hover:text-white transition duration-200">
                        Classement
                    </span>
                </Link>

                {/* Spacer */}
                <div className="flex-1"></div>

                {/* Section Amis */}
                {isConnected && (
                    <div className="mb-4">
                        <div className="mx-4 my-3 border-t border-gray-600 group-hover:border-gray-500 transition-colors"></div>

                        <Link href="/friends" className="flex items-center hover:bg-gray-600 pb-3 pt-3 rounded mx-1.5">
                            <span className="h-5 w-5 min-h-[25px] ml-4 relative">
                                <Image
                                    className="justify-center min-h-[25px] min-w-[25px] h-5 w-5"
                                    src="/Friends.png"
                                    alt="Friends"
                                    width={25}
                                    height={25}
                                />
                                {friendsOnline > 0 && (
                                    <div className="absolute -top-1 -right-1 bg-green-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center font-bold">
                                        {friendsOnline}
                                    </div>
                                )}
                            </span>
                            <span className="ml-4 group-hover:inline-block text-gray-700 group-hover:text-white transition duration-200 whitespace-nowrap">
                                Amis connectés: {friendsOnline}
                            </span>
                        </Link>

                        {isInQueue && (
                            <div className="mx-1.5 mt-2">
                                <div className="flex items-center hover:bg-gray-600 pb-2 pt-2 rounded px-3">
                                    <span className="h-4 w-4 min-h-[16px] min-w-[16px] ml-1">
                                        <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
                                    </span>
                                    <span className="ml-4 group-hover:inline-block text-green-400 group-hover:text-green-300 transition duration-200 whitespace-nowrap text-sm">
                                        En recherche...
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </nav>
        </aside>
    );
}