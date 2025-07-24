// src/app/profil/page.tsx
"use client";
import Image from "next/image";
import { useAuth } from "@/context/authcontext";
import { useState, useEffect } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://192.168.1.210:3333";

type Match = {
    id: string;
    modeId: number;
    status: string;
    updatedAt: string;
    teams: Array<{
        id: string;
        score: number;
        players: Array<{
            id: string;
            pseudo: string;
            userImage: string;
        }>;
    }>;
};

type UserStats = {
    totalMatches: number;
    currentElo: number;
    rank: number;
    total: number;
};

export default function ProfilPage() {
    const { user, isConnected, token } = useAuth();
    const [activeTab, setActiveTab] = useState<"stats" | "history">("stats");
    const [matchHistory, setMatchHistory] = useState<Match[]>([]);
    const [userStats, setUserStats] = useState<UserStats | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (isConnected && token) {
            fetchMatchHistory();
            fetchUserStats();
        }
    }, [isConnected, token]);

    const fetchUserStats = async () => {
        try {
            const response = await fetch(`${API_URL}/rank/1`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                setUserStats({
                    totalMatches: Array.isArray(matchHistory) ? matchHistory.length : 0, // ✅ Vérification
                    currentElo: data.elo,
                    rank: data.rank,
                    total: data.total
                });
            }
        } catch (error) {
            console.error("Erreur lors du chargement des stats:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const getMatchResult = (match: Match) => {
        if (!user) return null;

        const userTeam = match.teams?.find(team =>
            team.players?.some(player => player.id === user.id)
        );

        if (!userTeam) return null;

        const opponentTeam = match.teams?.find(team => team.id !== userTeam.id);

        if (!opponentTeam) return null;

        const isWin = userTeam.score > opponentTeam.score;
        const opponent = opponentTeam.players?.[0]?.pseudo || "Adversaire";

        return {
            result: isWin ? "win" : "lose",
            score: `${userTeam.score}-${opponentTeam.score}`,
            opponent,
            mode: match.modeId === 1 ? "1v1" : "2v2",
            date: match.updatedAt
        };
    };

    const fetchMatchHistory = async () => {
        try {
            const response = await fetch(`${API_URL}/parties/1`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                console.log("Historique des matchs:", data);
                // ✅ Vérification que data.data existe et est un tableau
                if (data?.parties.data && Array.isArray(data.parties.data)) {
                    setMatchHistory(data.parties.data);
                } else {
                    setMatchHistory([]); // Fallback sur tableau vide
                }
            }
        } catch (error) {
            console.error("Erreur lors du chargement de l'historique:", error);
            setMatchHistory([]); // ✅ En cas d'erreur, tableau vide
        }
    };

    if (!isConnected || !user) {
        return (
            <div className="ml-14 mt-20 p-6 text-white">
                <p>Veuillez vous connecter pour accéder à votre profil.</p>
            </div>
        );
    }

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

            {/* Contenu des onglets */}
            {activeTab === "stats" && userStats && (
                <section className="space-y-6">
                    {/* Statistiques principales */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div className="bg-gray-800 rounded-lg p-4 text-center">
                            <div className="text-3xl font-bold text-green-400">{userStats.total}</div>
                            <div className="text-gray-400 text-sm">Matchs joués</div>
                        </div>
                        <div className="bg-gray-800 rounded-lg p-4 text-center">
                            <div className="text-3xl font-bold text-blue-400">#{userStats.rank}</div>
                            <div className="text-gray-400 text-sm">Classement</div>
                        </div>
                    </div>

                    {/* Progression ELO */}
                    <div className="bg-gray-800 rounded-lg p-6">
                        <h3 className="text-xl font-semibold mb-4">Progression ELO</h3>
                        <div className="flex items-center justify-center">
                            <div>
                                <div className="text-2xl font-bold text-green-400">{userStats.currentElo}</div>
                                <div className="text-gray-400">ELO actuel</div>
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
                        {/* ✅ Vérification que matchHistory est un tableau */}
                        {Array.isArray(matchHistory) && matchHistory.length > 0 ? (
                            matchHistory.map((match) => {
                                const matchResult = getMatchResult(match);
                                if (!matchResult) return null;

                                return (
                                    <div
                                        key={match.id}
                                        className={`p-4 rounded-xl shadow-lg border-l-4 ${
                                            matchResult.result === "win"
                                                ? "bg-green-900/30 border-green-500"
                                                : "bg-red-900/30 border-red-500"
                                        } text-white hover:bg-opacity-50 transition-all`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-4">
                                                <div className={`text-2xl ${matchResult.result === "win" ? "text-green-400" : "text-red-400"}`}>
                                                    {matchResult.result === "win" ? "🏆" : "😔"}
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-lg">
                                                        {matchResult.result === "win" ? "Victoire" : "Défaite"} contre {matchResult.opponent}
                                                    </p>
                                                    <div className="flex items-center space-x-4 text-sm text-gray-300">
                                                        <span>Score : {matchResult.score}</span>
                                                        <span>•</span>
                                                        <span>Mode : {matchResult.mode}</span>
                                                        <span>•</span>
                                                        <span>Statut : {match.status}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-gray-400 text-sm">
                                                    {new Date(matchResult.date).toLocaleDateString('fr-FR')}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="text-center py-12 text-gray-400">
                                <p className="text-xl">Aucun match trouvé</p>
                                <p className="text-sm">Jouez votre premier match pour voir l'historique !</p>
                            </div>
                        )}
                    </div>

                    {/* ✅ Vérification avant d'afficher le bouton */}
                    {Array.isArray(matchHistory) && matchHistory.length > 0 && (
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