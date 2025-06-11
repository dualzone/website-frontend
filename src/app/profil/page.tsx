// src/app/profil/page.tsx
"use client";
import Image from "next/image";
import { useAuth } from "@/context/authcontext";
import { useState, useEffect } from "react";

type Match = {
    id: string;
    opponent: string;
    result: "win" | "lose";
    score: string;
    date: string;
    mode: string;
    duration: string;
};

type UserStats = {
    totalMatches: number;
    wins: number;
    losses: number;
    winRate: number;
    currentElo: number;
    bestElo: number;
    rank: number;
    totalPlayers: number;
};

export default function ProfilPage() {
    const { user, isConnected, token } = useAuth();
    const [activeTab, setActiveTab] = useState<"stats" | "history">("stats");
    const [matchHistory, setMatchHistory] = useState<Match[]>([]);
    const [userStats, setUserStats] = useState<UserStats | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedMode, setSelectedMode] = useState<"all" | "1v1" | "2v2">("all");

    // Données fictives en attendant l'API
    useEffect(() => {
        if (isConnected && user) {
            // Simulation de chargement des données
            setTimeout(() => {
                setMatchHistory([
                    {
                        id: "1",
                        opponent: "AlphaZ",
                        result: "win",
                        score: "13-7",
                        date: "2025-03-25",
                        mode: "1v1",
                        duration: "24m 30s"
                    },
                    {
                        id: "2",
                        opponent: "Nexus99",
                        result: "lose",
                        score: "10-13",
                        date: "2025-03-23",
                        mode: "2v2",
                        duration: "31m 15s"
                    },
                    {
                        id: "3",
                        opponent: "GhostX",
                        result: "win",
                        score: "13-11",
                        date: "2025-03-20",
                        mode: "1v1",
                        duration: "28m 45s"
                    },
                    {
                        id: "4",
                        opponent: "ProPlayer",
                        result: "lose",
                        score: "8-13",
                        date: "2025-03-18",
                        mode: "1v1",
                        duration: "22m 10s"
                    },
                    {
                        id: "5",
                        opponent: "SkillMaster",
                        result: "win",
                        score: "13-9",
                        date: "2025-03-15",
                        mode: "2v2",
                        duration: "26m 55s"
                    },
                ]);

                setUserStats({
                    totalMatches: 47,
                    wins: 28,
                    losses: 19,
                    winRate: 59.6,
                    currentElo: 1547,
                    bestElo: 1623,
                    rank: 156,
                    totalPlayers: 2847
                });

                setIsLoading(false);
            }, 800);
        }
    }, [isConnected, user]);

    if (!isConnected || !user) {
        return (
            <div className="ml-14 mt-20 p-6 text-white">
                <p>Veuillez vous connecter pour accéder à votre profil.</p>
            </div>
        );
    }

    const filteredMatches = matchHistory.filter(match => {
        if (selectedMode === "all") return true;
        return match.mode === selectedMode;
    });

    const getFilteredStats = () => {
        const filtered = filteredMatches;
        const wins = filtered.filter(m => m.result === "win").length;
        const total = filtered.length;
        return {
            total,
            wins,
            losses: total - wins,
            winRate: total > 0 ? (wins / total) * 100 : 0
        };
    };

    const filteredStats = getFilteredStats();

    if (isLoading) {
        return (
            <div className="ml-14 mt-20 p-6 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-green-500"></div>
            </div>
        );
    }

    return (
        <main className="ml-14 mt-20 p-6 space-y-8 text-white">
            {/* Header du profil */}
            <header className="bg-gray-800 rounded-xl p-6">
                <div className="flex items-center space-x-6">
                    {user.userImage ? (
                        <Image
                            src={user.userImage}
                            alt="Avatar"
                            width={100}
                            height={100}
                            className="rounded-2xl border-4 border-green-500"
                            unoptimized
                        />
                    ) : (
                        <div className="rounded-2xl w-[100px] h-[100px] bg-gray-700 border-4 border-green-500" />
                    )}

                    <div className="flex-1">
                        <h1 className="text-3xl font-bold text-white">{user.pseudo}</h1>
                        <p className="text-gray-400">Membre depuis {new Date(user.created_at).toLocaleDateString('fr-FR')}</p>
                        <div className="mt-2 flex items-center space-x-4">
                            <span className="px-3 py-1 bg-green-600 rounded-full text-sm font-medium">
                                ELO: {userStats?.currentElo}
                            </span>
                            <span className="px-3 py-1 bg-blue-600 rounded-full text-sm font-medium">
                                Rang #{userStats?.rank}
                            </span>
                            <span className="text-gray-400 text-sm">
                                Steam ID: {user.steamId}
                            </span>
                        </div>
                    </div>
                </div>
            </header>

            {/* Navigation des onglets */}
            <div className="flex space-x-1 bg-gray-800 rounded-lg p-1">
                <button
                    onClick={() => setActiveTab("stats")}
                    className={`flex-1 py-3 px-6 rounded-md font-medium transition-all ${
                        activeTab === "stats"
                            ? "bg-green-600 text-white"
                            : "text-gray-400 hover:text-white hover:bg-gray-700"
                    }`}
                >
                    📊 Statistiques
                </button>
                <button
                    onClick={() => setActiveTab("history")}
                    className={`flex-1 py-3 px-6 rounded-md font-medium transition-all ${
                        activeTab === "history"
                            ? "bg-green-600 text-white"
                            : "text-gray-400 hover:text-white hover:bg-gray-700"
                    }`}
                >
                    📜 Historique des matchs
                </button>
            </div>

            {/* Filtres de mode */}
            <div className="flex space-x-2">
                <button
                    onClick={() => setSelectedMode("all")}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                        selectedMode === "all"
                            ? "bg-green-600 text-white"
                            : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                    }`}
                >
                    Tous les modes
                </button>
                <button
                    onClick={() => setSelectedMode("1v1")}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                        selectedMode === "1v1"
                            ? "bg-green-600 text-white"
                            : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                    }`}
                >
                    1v1 uniquement
                </button>
                <button
                    onClick={() => setSelectedMode("2v2")}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                        selectedMode === "2v2"
                            ? "bg-green-600 text-white"
                            : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                    }`}
                >
                    2v2 uniquement
                </button>
            </div>

            {/* Contenu des onglets */}
            {activeTab === "stats" && userStats && (
                <section className="space-y-6">
                    {/* Statistiques principales */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-gray-800 rounded-lg p-4 text-center">
                            <div className="text-3xl font-bold text-green-400">{filteredStats.total}</div>
                            <div className="text-gray-400 text-sm">Matchs joués</div>
                        </div>
                        <div className="bg-gray-800 rounded-lg p-4 text-center">
                            <div className="text-3xl font-bold text-blue-400">{filteredStats.wins}</div>
                            <div className="text-gray-400 text-sm">Victoires</div>
                        </div>
                        <div className="bg-gray-800 rounded-lg p-4 text-center">
                            <div className="text-3xl font-bold text-red-400">{filteredStats.losses}</div>
                            <div className="text-gray-400 text-sm">Défaites</div>
                        </div>
                        <div className="bg-gray-800 rounded-lg p-4 text-center">
                            <div className="text-3xl font-bold text-yellow-400">{filteredStats.winRate.toFixed(1)}%</div>
                            <div className="text-gray-400 text-sm">Taux de victoire</div>
                        </div>
                    </div>

                    {/* Progression ELO */}
                    <div className="bg-gray-800 rounded-lg p-6">
                        <h3 className="text-xl font-semibold mb-4">Progression ELO</h3>
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-2xl font-bold text-green-400">{userStats.currentElo}</div>
                                <div className="text-gray-400">ELO actuel</div>
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-blue-400">{userStats.bestElo}</div>
                                <div className="text-gray-400">Meilleur ELO</div>
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-purple-400">#{userStats.rank}</div>
                                <div className="text-gray-400">Classement</div>
                            </div>
                        </div>

                        {/* Barre de progression */}
                        <div className="mt-4">
                            <div className="flex justify-between text-sm text-gray-400 mb-2">
                                <span>Bronze (1000)</span>
                                <span>Argent (1500)</span>
                                <span>Or (2000)</span>
                            </div>
                            <div className="w-full bg-gray-700 rounded-full h-3">
                                <div
                                    className="bg-gradient-to-r from-green-500 to-blue-500 h-3 rounded-full transition-all duration-300"
                                    style={{ width: `${Math.min((userStats.currentElo - 1000) / 1000 * 100, 100)}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {activeTab === "history" && (
                <section>
                    <div className="space-y-3">
                        {filteredMatches.length > 0 ? (
                            filteredMatches.map((match) => (
                                <div
                                    key={match.id}
                                    className={`p-4 rounded-xl shadow-lg border-l-4 ${
                                        match.result === "win"
                                            ? "bg-green-900/30 border-green-500"
                                            : "bg-red-900/30 border-red-500"
                                    } text-white hover:bg-opacity-50 transition-all`}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-4">
                                            <div className={`text-2xl ${match.result === "win" ? "text-green-400" : "text-red-400"}`}>
                                                {match.result === "win" ? "🏆" : "😔"}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-lg">
                                                    {match.result === "win" ? "Victoire" : "Défaite"} contre {match.opponent}
                                                </p>
                                                <div className="flex items-center space-x-4 text-sm text-gray-300">
                                                    <span>Score : {match.score}</span>
                                                    <span>•</span>
                                                    <span>Mode : {match.mode}</span>
                                                    <span>•</span>
                                                    <span>Durée : {match.duration}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-gray-400 text-sm">
                                                {new Date(match.date).toLocaleDateString('fr-FR')}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-12 text-gray-400">
                                <p className="text-xl">Aucun match trouvé pour ce mode</p>
                                <p className="text-sm">Changez de filtre ou jouez votre premier match !</p>
                            </div>
                        )}
                    </div>

                    {filteredMatches.length > 0 && (
                        <div className="mt-6 text-center">
                            <button className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-all">
                                Charger plus de matchs
                            </button>
                        </div>
                    )}
                </section>
            )}
        </main>
    );
}
