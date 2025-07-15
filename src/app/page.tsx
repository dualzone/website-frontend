// src/app/page.tsx
"use client";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { Suspense } from "react";
import { useAuth } from "@/context/authcontext";
import { useEffect, useState } from "react";
import ReactPlayer from "react-player/youtube";

export default function Page() {
    const { isConnected, user, isLoading } = useAuth();
    const router = useRouter();
    const api_url = process.env.REACT_APP_API_URL;

    const [mounted, setMounted] = useState(false);
    const [matchmakingLoading, setMatchmakingLoading] = useState(false);
    const [recentMatches] = useState([
        { opponent: "AlphaZ", result: "win", mode: "1v1", time: "5 min" },
        { opponent: "Nexus99", result: "lose", mode: "2v2", time: "1h" },
        { opponent: "GhostX", result: "win", mode: "1v1", time: "3h" },
    ]);

    // Données fictives pour les stats en attendant le contexte
    const [playersInQueue] = useState({
        1: 247, // 1v1
        2: 89   // 2v2
    });
    const [averageWaitTime] = useState({
        1: "1m 30s",
        2: "2m 15s"
    });

    const handleConnect = () => {
        window.location.href = `${api_url}/auth/steam/`;
    };


    const handleStartMatch = async (mode: "1v1" | "2v2") => {
        const modeId = mode === "1v1" ? 1 : 2;
        console.log("Mode sélectionné :", mode, "ID:", modeId);

        setMatchmakingLoading(true);

        try {
            // TODO: Intégrer avec le contexte matchmaking une fois disponible
            // await enqueue(modeId);

            // Pour l'instant, simulation
            setTimeout(() => {
                setMatchmakingLoading(false);
                router.push("/matchmaking");
            }, 1000);
        } catch (error) {
            console.error("Erreur lors de la mise en queue:", error);
            setMatchmakingLoading(false);
        }
    };

    useEffect(() => {
        setMounted(true);
    }, []);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full w-full bg-gray-950 text-white">
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-green-500"></div>
            </div>
        );
    }

    return (
        <div className="flex h-full w-full ml-6 mt-10 relative">
            <main className="flex-grow text-white p-8 h-full">
                <div className="p-4 text-white h-full mb-5">
                    {isConnected ? (
                        <>
                            <div className="mb-8">
                                <p className="text-lg font-bold flex z-0 mb-2">
                                    ✅ Connecté ! Bienvenue {user?.pseudo ?? "joueur"} !
                                </p>
                                <div className="flex items-center space-x-4 text-sm text-gray-400">
                                    <span>🟢 {(playersInQueue[1] || 0) + (playersInQueue[2] || 0)} joueurs en ligne</span>
                                    <span>⚡ Serveurs opérationnels</span>
                                </div>
                            </div>

                            <div className="mt-6 flex gap-4 w-full h-[70%]">
                                {/* Bouton 1v1 */}
                                <button
                                    onClick={() => handleStartMatch("1v1")}
                                    disabled={matchmakingLoading}
                                    className="relative overflow-hidden bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white font-bold py-2 px-4 rounded-2xl flex-1 group z-0 transition-all duration-300"
                                >
                                    <span
                                        className="absolute inset-0 bg-cover bg-center blur-sm grayscale group-hover:blur-0 group-hover:grayscale-0 scale-110 group-hover:scale-105 brightness-75 group-hover:brightness-100 transform transition-all duration-500 z-[-10]"
                                        style={{backgroundImage: "url('/1v1image.png')"}}
                                    />
                                    <div className="relative z-10 h-full flex flex-col justify-between p-6">
                                        <div className="text-left">
                                            <h3 className="text-6xl uppercase tracking-wide drop-shadow-[0_0_8px_rgba(0,0,0,0.8)] group-hover:opacity-80 transition-opacity">
                                                Match 1v1
                                            </h3>
                                            <div className="mt-4 space-y-2 text-xl group-hover:opacity-90 transition-opacity">
                                                <p className="text-green-200 font-semibold">
                                                    👥 {playersInQueue[1] || 247} joueurs en queue
                                                </p>
                                                <p className="text-blue-200">
                                                    ⏱️ Temps moyen: {averageWaitTime[1] || "1m 30s"}
                                                </p>
                                            </div>
                                        </div>

                                        {matchmakingLoading ? (
                                            <div className="flex justify-center">
                                                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
                                            </div>
                                        ) : (
                                            <div className="text-right">
                                                <span className="text-2xl font-bold bg-black/50 px-4 py-2 rounded-lg">
                                                    JOUER →
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </button>

                                {/* Bouton 2v2 */}
                                <button
                                    onClick={() => handleStartMatch("2v2")}
                                    disabled={matchmakingLoading}
                                    className="relative overflow-hidden bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white font-bold py-2 px-4 rounded-2xl flex-1 group z-0 transition-all duration-300"
                                >
                                    <span
                                        className="absolute inset-0 bg-cover bg-center blur-sm grayscale group-hover:blur-0 group-hover:grayscale-0 scale-110 group-hover:scale-105 group-hover:-translate-x-3 brightness-75 group-hover:brightness-100 transform transition-all duration-500 z-[-10]"
                                        style={{backgroundImage: "url('/2v2image.png')"}}
                                    />
                                    <div className="relative z-10 h-full flex flex-col justify-between p-6">
                                        <div className="text-left">
                                            <h3 className="text-6xl uppercase tracking-wide drop-shadow-[0_0_8px_rgba(0,0,0,0.8)] group-hover:opacity-80 transition-opacity">
                                                Match 2v2
                                            </h3>
                                            <div className="mt-4 space-y-2 text-xl group-hover:opacity-90 transition-opacity">
                                                <p className="text-green-200 font-semibold">
                                                    👥 {playersInQueue[2] || 89} joueurs en queue
                                                </p>
                                                <p className="text-blue-200">
                                                    ⏱️ Temps moyen: {averageWaitTime[2] || "2m 15s"}
                                                </p>
                                            </div>
                                        </div>

                                        {matchmakingLoading ? (
                                            <div className="flex justify-center">
                                                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
                                            </div>
                                        ) : (
                                            <div className="text-right">
                                                <span className="text-2xl font-bold bg-black/50 px-4 py-2 rounded-lg">
                                                    JOUER →
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </button>
                            </div>

                            {/* Section matches récents */}
                            <div className="mt-6 bg-gray-800/50 rounded-lg p-4">
                                <h3 className="text-lg font-semibold mb-3 text-gray-200">Activité récente</h3>
                                <div className="flex space-x-4 overflow-x-auto">
                                    {recentMatches.map((match, index) => (
                                        <div
                                            key={index}
                                            className={`flex-shrink-0 p-3 rounded-lg text-sm ${
                                                match.result === "win"
                                                    ? "bg-green-900/50 border-l-4 border-green-500"
                                                    : "bg-red-900/50 border-l-4 border-red-500"
                                            }`}
                                        >
                                            <p className="font-medium">
                                                {match.result === "win" ? "🏆" : "😔"} vs {match.opponent}
                                            </p>
                                            <p className="text-gray-400">
                                                {match.mode} • il y a {match.time}
                                            </p>
                                        </div>
                                    ))}
                                    <div className="flex-shrink-0 flex items-center">
                                        <button
                                            onClick={() => router.push("/profil")}
                                            className="text-gray-400 hover:text-white transition-colors px-4 py-2 border border-gray-600 rounded-lg text-sm"
                                        >
                                            Voir tout →
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            {mounted && (
                                <>
                                    <div className="absolute inset-0 bg-black/90 backdrop-blur-xl z-[-2] h-full w-full">
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
                                            }}
                                        />
                                    </div>
                                    <div className="absolute inset-0 bg-black/60 backdrop-blur-md z-[-1]"/>
                                </>
                            )}
                            <div className="flex flex-col items-center justify-center h-full text-center p-10 gap-6 z-0">
                                <h1 className="text-7xl font-bold text-white backdrop-blur-sm">Bienvenue sur DualZone</h1>
                                <p className="text-3xl text-gray-300 max-w-6xl text-balance backdrop-blur-sm">
                                    Rejoignez la plateforme compétitive ultime. Affrontez vos amis, grimpez dans le
                                    classement, et vivez l'intensité de matchs 1v1 et 2v2 inspirés des plus grands jeux
                                    e-sport.
                                </p>
                                <ul className="text-gray-400 text-xl text-left list-disc list-inside max-w-xl backdrop-blur-sm">
                                    <li>✔️ Système d'ELO transparent</li>
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