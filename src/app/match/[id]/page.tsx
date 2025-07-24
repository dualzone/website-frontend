// src/app/match/[id]/page.tsx
"use client";
import { useAuth } from "@/context/authcontext";
import { useWebSocket } from "@/context/websocketContext";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";
import { WebSocketProvider } from "@/context/websocketContext";
import { useMatchmaking } from "@/context/matchmakingContext";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://192.168.1.210:3333";

type Team = {
    id: string;
    score: number;
    players: Array<{
        id: string;
        pseudo: string;
        userImage: string;
    }>;
};

type Match = {
    id: string;
    modeId: number;
    status: string;
    teams: Team[];
    created_at: string;
    updated_at: string;
};

export default function MatchPage() {
    const { user, token } = useAuth();
    const params = useParams();
    const router = useRouter();
    const matchId = params.id as string;

    const [match, setMatch] = useState<Match | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [currentTime, setCurrentTime] = useState(new Date());

    const {
        forceEndMatch,
        forceChoosingStart,
        forceWarmupStart,
        forcePlayingStart,

        forceUpdateScore,

        generateRandomMatch

    } = useMatchmaking();

    useEffect(() => {
        if (token && matchId) {
            fetchMatch();
        }
    }, [token, matchId]);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);



    const fetchMatch = async () => {
        console.log("Chargement du match:", matchId);
        await axios.get(`${API_URL}/match/party/${matchId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }).then((response: any) => {
            console.log("Match trouvé:", response.data.party);
            setMatch(response.data.party);

        }).catch((error) => {

            console.error("Erreur lors du chargement du match:", error);
            setMatch(null);
        }).finally(() => {
            setIsLoading(false);
        });

    };

    const getUserTeam = () => {

        if (!match || !user) return null;
        return match.teams.find(team =>
            team.players.some(player => player.id === user.id)
        );
    };

    const getOpponentTeam = () => {
        if (!match || !user) return null;
        const userTeam = getUserTeam();
        return match.teams.find(team => team.id !== userTeam?.id);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "WARMUP": return "text-yellow-400";
            case "PLAYING": return "text-green-400";
            case "ENDED": return "text-red-400";
            case "CHOOSING": return "text-purple-400";
            default: return "text-gray-400";
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case "WARMUP": return "Échauffement";
            case "PLAYING": return "En cours";
            case "ENDED": return "Terminé";
            case "WAITING": return "En attente";
            case "CHOOSING": return "Choix en cours";
            default: return status;
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full w-full bg-gray-950 text-white">
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-green-500"></div>
            </div>
        );
    }

    if (!match) {
        return (
            <div className="flex flex-col items-center justify-center h-full w-full bg-gray-950 text-white p-10 gap-8">
                <h1 className="text-4xl font-bold">Match introuvable</h1>
                <p className="text-lg text-gray-300">
                    Le match que vous cherchez n'existe pas ou a été supprimé.
                </p>
                <button
                    onClick={() => router.push("/")}
                    className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition"
                >
                    Retour à l'accueil
                </button>
            </div>
        );
    }

    const handleWsMessage = async (event: string, data: any) => {
        await fetchMatch();
    }

    const userTeam = getUserTeam();
    const opponentTeam = getOpponentTeam();

    return (
        <WebSocketProvider
            channel={"match/" + matchId}
            onMessage={handleWsMessage}
        >

            <div className="ml-14 mt-20 p-6 min-h-screen bg-gray-950 text-white">
                <div className="max-w-6xl mx-auto space-y-6">
                    {/* Header du match */}
                    <div className="bg-gray-800 rounded-xl p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl font-bold">
                                    Match {match.modeId === 0 ? "1v1" : "2v2"}
                                </h1>
                                <p className="text-gray-400">ID: {match.id}</p>
                                {matchId.startsWith('demo-match-') && (
                                    <p className="text-yellow-400 text-sm">🚧 Match de démonstration</p>
                                )}
                            </div>
                            <div className="text-right">
                                <div className={`text-xl font-semibold ${getStatusColor(match.status)}`}>
                                    {getStatusText(match.status)}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tableau de score */}
                    <div className="bg-gray-800 rounded-xl p-6">
                        <div className="grid grid-cols-3 gap-6 items-center">
                            {/* Équipe utilisateur */}
                            <div className="text-center">
                                <div className="text-6xl font-bold text-green-400 mb-2">
                                    {userTeam?.score || 0}
                                </div>
                                <div className="space-y-2">
                                    {userTeam?.players.map((player) => (
                                        <div key={player.id} className="flex items-center justify-center space-x-3">
                                            <Image
                                                src={player.userImage}
                                                alt={player.pseudo}
                                                width={40}
                                                height={40}
                                                className="rounded-full"
                                                unoptimized
                                            />
                                            <span className={`font-semibold ${player.id === user?.id ? 'text-green-400' : 'text-white'}`}>
                                                {player.pseudo}
                                                {player.id === user?.id && " (Vous)"}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* VS */}
                            <div className="text-center">
                                <div className="text-4xl font-bold text-gray-400 mb-4">VS</div>
                            </div>

                            {/* Équipe adverse */}
                            <div className="text-center">
                                <div className="text-6xl font-bold text-red-400 mb-2">
                                    {opponentTeam?.score || 0}
                                </div>
                                <div className="space-y-2">
                                    {opponentTeam?.players.map((player) => (
                                        <div key={player.id} className="flex items-center justify-center space-x-3">
                                            <Image
                                                src={player.userImage}
                                                alt={player.pseudo}
                                                width={40}
                                                height={40}
                                                className="rounded-full"
                                                unoptimized
                                            />
                                            <span className="font-semibold text-white">
                                                {player.pseudo}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Actions selon le statut */}
                    <div className="bg-gray-800 rounded-xl p-6">
                        <div className="text-center space-y-4">
                            {match.status === "CREATING" && (
                                <div>
                                    <p className="text-lg text-gray-300 mb-4">
                                        En attente du serveur...
                                    </p>
                                    <div className="animate-pulse">
                                        <div className="h-2 bg-gray-700 rounded w-full"></div>
                                    </div>
                                </div>
                            )}

                            {match.status === "WARMUP" && (
                                <div>
                                    <p className="text-lg text-yellow-400 mb-4">
                                        🔥 Phase d'échauffement
                                    </p>
                                    <p className="text-gray-300">
                                        Préparez-vous, le match va bientôt commencer !
                                    </p>
                                </div>
                            )}

                            {match.status === "CHOOSING" && (
                            <div>
                                <p className="text-lg text-purple-400 mb-4">
                                🔪 Faites votre choix
                                </p>
                                <p className="text-gray-300">
                                Phase de pick et ban pour la map, suivie d’un round au couteau pour déterminer le côté de départ.
                                </p>
                            </div>
                            )}

                            {match.status === "PLAYING" && (
                                <div>
                                    <p className="text-lg text-green-400 mb-4">
                                        ⚡ Match en cours
                                    </p>
                                    <p className="text-gray-300">
                                        Donnez le meilleur de vous-même !
                                    </p>
                                </div>
                            )}

                            {match.status === "ENDED" && (
                                <div>
                                    <p className="text-lg text-red-400 mb-4">
                                        🏁 Match terminé
                                    </p>
                                    <div className="space-y-3">
                                        <p className="text-xl font-semibold">
                                            {userTeam && opponentTeam && userTeam.score > opponentTeam.score ? (
                                                <span className="text-green-400">🏆 Victoire !</span>
                                            ) : (
                                                <span className="text-red-400">😔 Défaite</span>
                                            )}
                                        </p>
                                        <div className="flex justify-center space-x-4">
                                            <button
                                                onClick={() => router.push("/profil")}
                                                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
                                            >
                                                Voir profil
                                            </button>
                                            <button
                                                onClick={() => router.push("/")}
                                                className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition"
                                            >
                                                Nouveau match
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Outils de développement pour les matchs de démo */}

                    <div className="bg-gray-800 rounded-xl p-6 border border-yellow-500">
                        <h3 className="text-lg font-semibold text-yellow-400 text-center mb-4">
                            🚧 Outils de développement - Match de démo 🚧
                        </h3>
                        <p className="text-sm text-gray-400 text-center mb-4">
                            Testez les différentes phases du match
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                            <button
                                onClick={forceWarmupStart}
                                className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded text-sm font-medium transition"
                            >
                                🔥 Démarrer le warmup
                            </button>

                            <button
                                onClick={forceChoosingStart}
                                className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded text-sm font-medium transition"
                            >
                                ❓ Lancer le choix
                            </button>

                            <button
                                onClick={forcePlayingStart}
                                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded text-sm font-medium transition"
                            >
                                🟢 Lancer les rounds
                            </button>

                            <button
                                onClick={forceUpdateScore}
                                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-sm font-medium transition"
                            >
                                📊 Scores aléatoires
                            </button>

                            <button
                                onClick={forceEndMatch}
                                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded text-sm font-medium transition"
                            >
                                🏁 Terminer le match
                            </button>

                            <button
                                onClick={generateRandomMatch}
                                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded text-sm font-medium transition"
                            >
                                💥 Match complètement aléatoire
                            </button>

                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">


                        </div>

                        <div className="text-xs text-gray-500 mt-4 space-y-1">
                            <p><strong>Warmup :</strong> Phase d'échauffement avant le match (joeurs non ready)</p>
                            <p><strong>Choosing :</strong> Rounds au couteau pour la map et le coté de départ</p>
                            <p><strong>Playing :</strong> Match en cours</p>
                            <p><strong>Ended :</strong> Match terminé avec résultat</p>
                            <p><strong>Scores :</strong> Met à jour les scores en temps réel</p>
                            <p><strong>Random match :</strong> Génère un match et des résultats complètement aléatoires</p>
                        </div>
                    </div>

                    {/* Retour */}
                    <div className="text-center">
                        <button
                            onClick={() => router.push("/")}
                            className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition"
                        >
                            ← Retour à l'accueil
                        </button>
                    </div>
                </div>
            </div>
        </WebSocketProvider>
    );
}