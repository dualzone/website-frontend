// src/app/classement/page.tsx
"use client";
import Image from "next/image";
import { useAuth } from "@/context/authcontext";
import { useState, useEffect } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://192.168.1.210:3333";

type RankedPlayer = {
    user: {
        id: string;
        pseudo: string;
        userImage: string;
    };
    elo: number;
    rank: number;
};

type UserRank = {
    elo: number;
    rank: number;
    total: number;
};

export default function ClassementPage() {
    const { user, isConnected, token } = useAuth();
    const [leaderboard, setLeaderboard] = useState<RankedPlayer[]>([]);
    const [userRank, setUserRank] = useState<UserRank | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        if (isConnected && token) {
            fetchLeaderboard();
            fetchUserRank();
        }
    }, [isConnected, token]);

    const fetchLeaderboard = async () => {
        try {
            const response = await fetch(`${API_URL}/ranks/1`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                setLeaderboard(data.data);
            }
        } catch (error) {
            console.error("Erreur lors du chargement du classement:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchUserRank = async () => {
        try {
            const response = await fetch(`${API_URL}/rank/1`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                setUserRank(data);
            }
        } catch (error) {
            console.error("Erreur lors du chargement du rang utilisateur:", error);
        }
    };

    const filteredLeaderboard = leaderboard.filter(player =>
        player.user.pseudo.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getRankColor = (rank: number) => {
        if (rank === 1) return "text-yellow-400";
        if (rank === 2) return "text-gray-300";
        if (rank === 3) return "text-orange-400";
        if (rank <= 10) return "text-blue-400";
        return "text-white";
    };

    const getRankIcon = (rank: number) => {
        if (rank === 1) return "👑";
        if (rank === 2) return "🥈";
        if (rank === 3) return "🥉";
        if (rank <= 10) return "⭐";
        return "🎯";
    };

    const getEloColor = (elo: number) => {
        if (elo >= 2000) return "text-purple-400";
        if (elo >= 1800) return "text-blue-400";
        if (elo >= 1500) return "text-green-400";
        if (elo >= 1200) return "text-yellow-400";
        return "text-gray-400";
    };

    if (!isConnected) {
        return (
            <div className="ml-14 mt-20 p-6 text-white">
                <div className="text-center py-12">
                    <h1 className="text-3xl font-bold mb-4">Classement DualZone</h1>
                    <p className="text-gray-400 mb-6">Connectez-vous pour voir votre position dans le classement</p>
                    <button
                        onClick={() => window.location.href = `${API_URL}/auth/steam/`}
                        className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition"
                    >
                        Se connecter
                    </button>
                </div>
            </div>
        );
    }

    return (
        <main className="ml-14 mt-20 p-6 space-y-6 text-white">
            <header className="text-center space-y-4">
                <h1 className="text-4xl font-bold">🏆 Classement DualZone</h1>
                <p className="text-gray-400">Les meilleurs joueurs de la plateforme</p>
            </header>

            {/* Ma position */}
            {userRank && (
                <div className="bg-gradient-to-r from-green-800/50 to-blue-800/50 rounded-xl p-6 border border-green-500/30">
                    <h2 className="text-xl font-semibold mb-4 text-center">📍 Ma Position</h2>
                    <div className="flex items-center justify-center space-x-8">
                        <div className="text-center">
                            <div className="text-3xl font-bold text-green-400">#{userRank.rank}</div>
                            <div className="text-gray-300">Rang</div>
                        </div>
                        <div className="text-center">
                            <div className={`text-3xl font-bold ${getEloColor(userRank.elo)}`}>{userRank.elo}</div>
                            <div className="text-gray-300">ELO</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-blue-400">{userRank.total}</div>
                            <div className="text-gray-300">Joueurs total</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-purple-400">
                                {((userRank.total - userRank.rank) / userRank.total * 100).toFixed(1)}%
                            </div>
                            <div className="text-gray-300">Percentile</div>
                        </div>
                    </div>
                </div>
            )}

            {/* Recherche */}
            <div className="flex justify-end">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Rechercher un joueur..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
                    />
                    <div className="absolute right-3 top-2.5 text-gray-400">
                        🔍
                    </div>
                </div>
            </div>

            {/* Leaderboard */}
            <div className="bg-gray-800 rounded-xl overflow-hidden">
                <div className="p-4 bg-gray-700 border-b border-gray-600">
                    <h2 className="text-xl font-semibold">Top Joueurs</h2>
                </div>

                {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-4 border-b-4 border-green-500"></div>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-700">
                        {filteredLeaderboard.map((player, index) => (
                            <div
                                key={player.user.id}
                                className={`p-4 hover:bg-gray-700/50 transition-all ${
                                    player.user.id === user?.id ? "bg-green-900/20 border-l-4 border-green-500" : ""
                                }`}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-4">
                                        <div className="text-center min-w-[60px]">
                                            <div className={`text-2xl ${getRankColor(player.rank)}`}>
                                                {getRankIcon(player.rank)}
                                            </div>
                                            <div className={`font-bold ${getRankColor(player.rank)}`}>
                                                #{player.rank}
                                            </div>
                                        </div>

                                        <div className="flex items-center space-x-3">
                                            <Image
                                                src={player.user.userImage}
                                                alt={`Avatar de ${player.user.pseudo}`}
                                                width={50}
                                                height={50}
                                                className="rounded-full border-2 border-gray-600"
                                                unoptimized
                                            />
                                            <div>
                                                <p className="font-semibold text-lg">
                                                    {player.user.pseudo}
                                                    {player.user.id === user?.id && (
                                                        <span className="ml-2 text-green-400 text-sm">(Vous)</span>
                                                    )}
                                                </p>
                                                {player.rank <= 3 && (
                                                    <p className="text-sm text-gray-400">Champion</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="text-right">
                                        <div className={`text-2xl font-bold ${getEloColor(player.elo)}`}>
                                            {player.elo}
                                        </div>
                                        <div className="text-gray-400 text-sm">ELO</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Légende des rangs */}
            <div className="bg-gray-800 rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-3">🎖️ Système de rangs</h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-sm">
                    <div className="text-center">
                        <div className="text-gray-400 text-xl">🥉</div>
                        <div className="text-gray-400">Bronze</div>
                        <div className="text-xs text-gray-500">1000-1199</div>
                    </div>
                    <div className="text-center">
                        <div className="text-yellow-400 text-xl">🥈</div>
                        <div className="text-yellow-400">Argent</div>
                        <div className="text-xs text-gray-500">1200-1499</div>
                    </div>
                    <div className="text-center">
                        <div className="text-green-400 text-xl">🥇</div>
                        <div className="text-green-400">Or</div>
                        <div className="text-xs text-gray-500">1500-1799</div>
                    </div>
                    <div className="text-center">
                        <div className="text-blue-400 text-xl">💎</div>
                        <div className="text-blue-400">Diamant</div>
                        <div className="text-xs text-gray-500">1800-1999</div>
                    </div>
                    <div className="text-center">
                        <div className="text-purple-400 text-xl">👑</div>
                        <div className="text-purple-400">Maître</div>
                        <div className="text-xs text-gray-500">2000+</div>
                    </div>
                </div>
            </div>
        </main>
    );
}