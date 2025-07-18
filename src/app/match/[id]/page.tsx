// src/app/match/[id]/page.tsx
"use client";
import { useAuth } from "@/context/authcontext";
import { useWebSocket } from "@/context/websocketContext";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";

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
    const { lastMessage } = useWebSocket();
    const params = useParams();
    const router = useRouter();
    const matchId = params.id as string;

    const [match, setMatch] = useState<Match | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [currentTime, setCurrentTime] = useState(new Date());

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

    useEffect(() => {
        if (lastMessage) {
            // Écouter les mises à jour du match via WebSocket
            if (lastMessage.type === "match_update" && lastMessage.matchId === matchId) {
                setMatch(lastMessage.match);
            }
        }
    }, [lastMessage, matchId]);

    const fetchMatch = async () => {
        try {
            // Si c'est un match de démo, créer un match fictif
            if (matchId.startsWith('demo-match-')) {
                console.log("Match de démo détecté, création d'un match fictif");
                createDemoMatch();
                return;
            }

            // Sinon, essayer de récupérer depuis l'API
            const response = await fetch(`${API_URL}/parties/1`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const data = await response.json();

                // ✅ Vérification que data.data existe et est un tableau
                if (data?.data && Array.isArray(data.data)) {
                    const currentMatch = data.data.find((m: Match) => m.id === matchId);
                    setMatch(currentMatch || null);
                } else {
                    console.log("Aucune donnée de match trouvée dans l'API");
                    setMatch(null);
                }
            }
        } catch (error) {
            console.error("Erreur lors du chargement du match:", error);
            setMatch(null);
        } finally {
            setIsLoading(false);
        }
    };

    // ✅ Fonction pour créer un match de démo
    const createDemoMatch = () => {
        const demoMatch: Match = {
            id: matchId,
            modeId: 1, // 1v1 par défaut
            status: "WAITING",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            teams: [
                {
                    id: "team-1",
                    score: 0,
                    players: [
                        {
                            id: user?.id || "user-1",
                            pseudo: user?.pseudo || "Vous",
                            userImage: user?.userImage || "/default-avatar.png"
                        }
                    ]
                },
                {
                    id: "team-2",
                    score: 0,
                    players: [
                        {
                            id: "opponent-1",
                            pseudo: "Adversaire Bot",
                            userImage: "/default-avatar.png"
                        }
                    ]
                }
            ]
        };

        setMatch(demoMatch);
        setIsLoading(false);
    };

    const getMatchDuration = () => {
        if (!match) return "0:00";
        const start = new Date(match.created_at);
        const diff = Math.floor((currentTime.getTime() - start.getTime()) / 1000);
        const minutes = Math.floor(diff / 60);
        const seconds = diff % 60;
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
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
            default: return "text-gray-400";
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case "WARMUP": return "Échauffement";
            case "PLAYING": return "En cours";
            case "ENDED": return "Terminé";
            case "WAITING": return "En attente";
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

    const userTeam = getUserTeam();
    const opponentTeam = getOpponentTeam();

    return (
        <div className="ml-14 mt-20 p-6 min-h-screen bg-gray-950 text-white">
            <div className="max-w-6xl mx-auto space-y-6">
                {/* Header du match */}
                <div className="bg-gray-800 rounded-xl p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold">
                                Match {match.modeId === 1 ? "1v1" : "2v2"}
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
                            <div className="text-gray-400">
                                Durée: {getMatchDuration()}
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
                            <div className="text-sm text-gray-500">
                                {new Date(match.created_at).toLocaleTimeString('fr-FR')}
                            </div>
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
                        {match.status === "WAITING" && (
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
                {matchId.startsWith('demo-match-') && (
                    <div className="bg-gray-800 rounded-xl p-6 border border-yellow-500">
                        <h3 className="text-lg font-semibold text-yellow-400 text-center mb-4">
                            🚧 Outils de développement - Match de démo 🚧
                        </h3>
                        <p className="text-sm text-gray-400 text-center mb-4">
                            Testez les différentes phases du match
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                            <button
                                onClick={() => {
                                    setMatch(prev => prev ? {...prev, status: "WARMUP"} : null);
                                }}
                                className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded text-sm font-medium transition"
                            >
                                🔥 Passer en Warmup
                            </button>

                            <button
                                onClick={() => {
                                    setMatch(prev => prev ? {...prev, status: "PLAYING"} : null);
                                }}
                                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded text-sm font-medium transition"
                            >
                                ⚡ Démarrer le match
                            </button>

                            <button
                                onClick={() => {
                                    setMatch(prev => {
                                        if (!prev) return null;
                                        const newMatch = {...prev, status: "ENDED"};
                                        // Mettre à jour les scores aléatoirement
                                        const userScore = Math.floor(Math.random() * 13) + 1;
                                        const opponentScore = Math.floor(Math.random() * 13) + 1;
                                        newMatch.teams[0].score = userScore;
                                        newMatch.teams[1].score = opponentScore;
                                        return newMatch;
                                    });
                                }}
                                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded text-sm font-medium transition"
                            >
                                🏁 Terminer le match
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <button
                                onClick={() => {
                                    setMatch(prev => {
                                        if (!prev) return null;
                                        const newMatch = {...prev};
                                        // Score aléatoire pour l'équipe du joueur
                                        newMatch.teams[0].score = Math.floor(Math.random() * 16);
                                        newMatch.teams[1].score = Math.floor(Math.random() * 16);
                                        return newMatch;
                                    });
                                }}
                                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-sm font-medium transition"
                            >
                                📊 Scores aléatoires
                            </button>

                            <button
                                onClick={() => {
                                    setMatch(prev => prev ? {...prev, status: "WAITING"} : null);
                                }}
                                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded text-sm font-medium transition"
                            >
                                ⏸️ Remettre en attente
                            </button>
                        </div>

                        <div className="text-xs text-gray-500 mt-4 space-y-1">
                            <p><strong>Warmup :</strong> Phase d'échauffement avant le match</p>
                            <p><strong>Playing :</strong> Match en cours</p>
                            <p><strong>Ended :</strong> Match terminé avec résultat</p>
                            <p><strong>Scores :</strong> Met à jour les scores en temps réel</p>
                        </div>
                    </div>
                )}

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
    );
}