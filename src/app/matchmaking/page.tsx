// src/app/matchmaking/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useMatchmaking } from "@/context/matchmakingContext";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/authcontext";
import { WebSocketProvider } from "@/context/websocketContext";
import axios from 'axios';

export default function MatchmakingPage() {
    const { user, token } = useAuth();
    const router = useRouter();
    const [group, setGroup] = useState<string | null>(null);
    const {
        isInQueue,
        currentMode,
        queueTimer,
        estimatedTime,
        cancelQueue,
        modes,
        // Fonctions de démo
        forceFoundMatch,
        forceResolveMatch,
    } = useMatchmaking();

    useEffect(() => {
        const fetchGroup = async () => {
            if (!token) return;
            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/user/groups`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setGroup(response.data[0].id);
            } catch (error) {
                console.error("Erreur lors de la récupération du groupe :", error);
                setGroup(null);
            }
        };

        fetchGroup();
    }, [token]);

    const handleWsMessage = (event: any, data : any) => {
        if(event === "matchFounded") {
            router.push(`/match/${data.matchId}`);
        }

    }

    const [showDemo, setShowDemo] = useState(false);

    const formatTime = (seconds: number) => {
        const min = Math.floor(seconds / 60);
        const sec = seconds % 60;
        return `${min}m ${sec < 10 ? "0" : ""}${sec}s`;
    };

    const getCurrentModeName = () => {
        // ✅ Vérification que modes est un tableau avant d'utiliser find
        if (!Array.isArray(modes) || !currentMode) {
            return currentMode === 1 ? "1v1" : currentMode === 2 ? "2v2" : "Mode inconnu";
        }

        const mode = modes.find(m => m.id === currentMode);
        return mode ? mode.name : (currentMode === 1 ? "1v1" : currentMode === 2 ? "2v2" : "Mode inconnu");
    };

    if (!isInQueue) {
        return (
            <div className="flex flex-col items-center justify-center h-full w-full bg-gray-950 text-white p-10 gap-8">
                <h1 className="text-4xl font-bold">Aucune recherche en cours</h1>
                <p className="text-lg text-gray-300">
                    Retournez à l'accueil pour lancer une recherche de partie
                </p>
                <button
                    onClick={() => window.history.back()}
                    className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition"
                >
                    Retour à l'accueil
                </button>
            </div>
        );
    }

    return (
        <WebSocketProvider 
            channel={"group/" + group +  "/match"}
            onMessage={handleWsMessage}
        >
            <div className="flex flex-col items-center justify-center h-full w-full bg-gray-950 text-white p-10 gap-8">
                {/* Header principal */}
                <div className="text-center space-y-4">
                    <h1 className="text-4xl font-bold">Recherche de partie...</h1>
                    <p className="text-xl text-green-400">
                        Mode : <span className="font-semibold">{getCurrentModeName()}</span>
                    </p>
                </div>

                {/* Spinner et timer */}
                <div className="flex flex-col items-center space-y-6">
                    <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-green-500"></div>

                    <div className="text-center space-y-2">
                        <p className="text-2xl font-mono text-white">
                            Temps écoulé : <span className="text-green-400">{formatTime(queueTimer)}</span>
                        </p>
                        <p className="text-lg text-gray-400">
                            Estimation : <span className="text-yellow-400">{estimatedTime}</span>
                        </p>
                    </div>
                </div>

                {/* Informations utilisateur */}
                <div className="bg-gray-800 rounded-lg p-6 text-center space-y-2">
                    <p className="text-gray-300">Joueur en attente :</p>
                    <p className="text-xl font-semibold text-white">{user?.pseudo}</p>
                </div>

                {/* Bouton d'annulation */}
                <button
                    onClick={cancelQueue}
                    className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition transform hover:scale-105"
                >
                    Annuler la recherche
                </button>

                {/* Section démo */}
                <div className="mt-8 space-y-4">
                    <button
                        onClick={() => setShowDemo(!showDemo)}
                        className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded text-sm font-medium transition"
                    >
                        {showDemo ? "Masquer" : "Afficher"} les outils de développement
                    </button>

                    {showDemo && (
                        <div className="bg-gray-800 rounded-lg p-6 space-y-4 border border-yellow-500">
                            <h3 className="text-lg font-semibold text-yellow-400 text-center">
                                🚧 Outils de développement 🚧
                            </h3>
                            <p className="text-sm text-gray-400 text-center">
                                Ces boutons permettent de tester le système sans attendre
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <button
                                    onClick={forceFoundMatch}
                                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm font-medium transition"
                                >
                                    🎯 Forcer match trouvé
                                </button>

                                <button
                                    onClick={forceResolveMatch}
                                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded text-sm font-medium transition"
                                >
                                    ⚡ Résoudre matchmaking
                                </button>

                            </div>

                            <div className="text-xs text-gray-500 space-y-1">
                                <p><strong>Force match trouvé :</strong> Simule la découverte d'un match (Fake player)</p>
                                <p><strong>Résoudre MM :</strong> Force l'appariement des joueurs en queue</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Indicateur de statut */}
                <div className="absolute top-4 right-4 flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm text-gray-400">En ligne</span>
                </div>
            </div>
        </WebSocketProvider>
    );
}