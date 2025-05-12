"use client";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/context/authcontext";

const HeaderComp = () => {

    const { isConnected, setIsConnected } = useAuth();

    const handleConnect = () => {
        setIsConnected(true); // simulate connection
        window.location.href = "/"; // redirection réelle
    };

    const handleDisconnect = () => {
        setIsConnected(false);
        window.location.href = "/";
    };

    return (
        <header className="w-full bg-gray-700 shadow-md justify-between items-center h-20 pt-1 fixed z-50">
            <div className="text-xl font-bold text-gray-900 mb-0 flex ml-auto mr-5">
                <div className="overflow-hidden">
                    <Link href="/" className="flex items-center">
                            <Image src="/TypoDZ.svg" alt="Logo Typographique DualZone" className="h-auto w-auto max-w-[350px] max-h-[150px]" width={350} height={150}/>
                    </Link>
                </div>
                <div className="ml-auto mt-1">
                    <div className="mt-1 text-center">
                        {isConnected ? (
                            <button
                                onClick={handleDisconnect}
                                className=" mt-2.5 justify-center items-center bg-gray-80 font-bold text-white px-4 py-1 rounded-lg bg-gray-800 hover:bg-red-900 transition inline-flex"
                            >
                                Se déconnecter
                            </button>
                        ) : (
                            <button
                                className="justify-center items-center bg-gray-80 font-bold text-white px-4 py-1 rounded-lg bg-gray-800 hover:bg-gray-900 transition inline-flex"
                                onClick={handleConnect}
                            >
                                S&#39;identifier avec
                                <Image src="/steam.svg" alt="Logo steam" className="right-2" height={75} width={75} />
                            </button>
                        )}
                    </div>
                </div>
            </div>

        </header>
    );

};

export default HeaderComp;