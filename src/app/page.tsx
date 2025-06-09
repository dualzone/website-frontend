"use client";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/context/authcontext";
import { useEffect, useState } from "react";
import ReactPlayer from "react-player/youtube";
import {lock} from "next/dist/client/components/react-dev-overlay/internal/components/Overlay/body-locker";



export default function Home() {
    const { isConnected, user, isLoading } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const handleConnect = () => {// simulate connection
        window.location.href = "http://localhost:3333/auth/steam/"; // redirection réelle
    };

    useEffect(() => {
        if (typeof window === "undefined") return;
        const token = searchParams.get("token");
        if (token) {
            localStorage.setItem("access_token", token);
            console.log(token);
            router.replace("/");// recharge proprement sans ?token=...
        }else{
            console.log("No token", token);
        }
    }, [searchParams])

    const handleStartMatch = (mode: "1v1" | "2v2") => {
      console.log("Mode sélectionné :", mode);
      router.push("/matchmaking");
    };

    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

        return (

            <div className="flex h-full w-full ml-6 mt-10 relative">
                <main className="flex-grow  text-white p-8 h-full">
                    <div className="p-4 text-white h-full mb-5">
                        {isConnected ? (
                            <>
                                <p className="text-lg font-bold flex z-0">
                                    ✅ Connecté ! Bienvenue {user?.pseudo ?? "joueur"} !
                                </p>
                                <div className="mt-6 flex gap-4 w-full h-[90%]">
                                    <button
                                        onClick={() => handleStartMatch("1v1")}
                                        className="relative overflow-hidden bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-2xl flex-1 group z-0"
                                    >
                                <span
                                    className="absolute inset-0 bg-cover bg-center blur-sm grayscale group-hover:blur-0 group-hover:grayscale-0 scale-110 group-hover:scale-105  brightness-75 group-hover:brightness-100 transform transition-all duration-500 z-[-10] mask-image-[radial-gradient(ellipse_at_center,_rgba(0,0,0,1)_0%,_rgba(0,0,0,0.5)_70%,_transparent_100%)]"
                                    style={{backgroundImage: "url('/1v1image.png')"}}
                                />
                                        <span
                                            className="relative z-10 group-hover:opacity-0 transition-opacity duration-300 text-6xl uppercase tracking-wide drop-shadow-[0_0_8px_rgba(0,0,0,0.25)]">
                                  Match 1v1
                                </span>
                                    </button>
                                    <button
                                        onClick={() => handleStartMatch("2v2")}
                                        className="relative overflow-hidden bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-2xl flex-1 group z-0"
                                    >
                                <span
                                    className="absolute inset-0 bg-cover bg-center blur-sm grayscale group-hover:blur-0 group-hover:grayscale-0 scale-110 group-hover:scale-105 group-hover:-translate-x-3 brightness-75 group-hover:brightness-100 transform transition-all duration-500 z-[-10] mask-image-[radial-gradient(ellipse_at_center,_rgba(0,0,0,1)_0%,_rgba(0,0,0,0.5)_70%,_transparent_100%)]"
                                    style={{backgroundImage: "url('/2v2image.png')"}}
                                />
                                        <span
                                            className="relative z-10 group-hover:opacity-0 transition-opacity duration-300 text-6xl uppercase tracking-wide drop-shadow-[0_0_8px_rgba(0,0,0,0.25)]">
                                  Match 2v2
                                </span>
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                {mounted && (
                                    <>
                                        <div
                                            className="absolute inset-0 bg-black/90 backdrop-blur-xl z-[-2] h-full w-full">
                                            <ReactPlayer
                                                url="https://www.youtube.com/watch?v=vxMEiUN-AuM"
                                                playing
                                                loop
                                                muted
                                                controls={false}
                                                width="120vw"
                                                height="120vh"
                                                style={{
                                                    position: "absolute",
                                                    top: "-10vh",
                                                    left: "-10vw",
                                                    zIndex: -2
                                                }}/>
                                        </div>
                                        <div className="absolute inset-0 bg-black/60 backdrop-blur-md z-[-1]"/>
                                    </>
                                )}
                                <div
                                    className="flex flex-col items-center justify-center h-full text-center p-10 gap-6 z-0  bg-shadow-xl bg-backdrop-blur-sm">
                                    <h1 className="text-7xl font-bold text-white backdrop-blur-sm">Bienvenue sur
                                        DualZone</h1>
                                    <p className="text-3xl text-gray-300 max-w-6xl text-balance backdrop-blur-sm">
                                        Rejoignez la plateforme compétitive ultime. Affrontez vos amis, grimpez dans le
                                        classement, et vivez l&#39;intensité de matchs 1v1 et 2v2 inspirés des plus
                                        grands jeux
                                        e-sport.
                                    </p>
                                    <ul className="text-gray-400 text-xl text-left list-disc list-inside max-w-xl backdrop-blur-sm">
                                        <li>✔️ Système d&#39;ELO transparent</li>
                                        <li>✔️ Matchmaking rapide et équilibré</li>
                                        <li>✔️ Interface e-sport claire et moderne</li>
                                        <li>✔️ Historique des matchs et progression</li>
                                    </ul>
                                    <button
                                        onClick={handleConnect}
                                        className="mt-6 text-4xl inline-block px-16 py-4 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition"
                                    >
                                        JOUER
                                    </button>
                                </div>
                            </>

                        )}
                    </div>
                </main>
            </div>
        );
}
