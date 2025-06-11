// src/app/classement/page.tsx
"use client";
import Image from "next/image";
import { useAuth } from "@/context/authcontext";
import { useState, useEffect } from "react";
import { generateAvatar, getFakeUsersWithAvatars } from "@/utils/avatarHelper";

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
    const [selectedGame, setSelectedGame] = useState(1); // 1 pour CS2 par défaut
    const [leaderboard, setLeaderboard] = useState<RankedPlayer[]>([]);
    const [userRank, setUserRank] = useState<UserRank | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    // Données fictives avec avatars générés
    useEffect(() => {
        if (isConnected) {
            setIsLoading(true);
            // Simulation de chargement
            setTimeout(() => {
                // Génération de données fictives pour le leaderboard avec avatars
                const fakeLeaderboard: RankedPlayer[] = [
                    {
                        user: { id: "1", pseudo: "SkillMaster_Pro", userImage: generateAvatar("SkillMaster_Pro", "professional") },
                        elo: 2156,
                        rank: 1
                    },
                    {
                        user: { id: "2", pseudo: "AlphaStrike", userImage: generateAvatar("AlphaStrike", "gaming") },
                        elo: 2089,
                        rank: 2
                    },
                    {
                        user: { id: "3", pseudo: "NeonGamer", userImage: generateAvatar("NeonGamer", "fun") },
                        elo: 2034,
                        rank: 3
                    },
                    {
                        user: { id: "4", pseudo: "CyberNinja", userImage: generateAvatar("CyberNinja", "gaming") },
                        elo: 1987,
                        rank: 4
                    },
                    {
                        user: { id: "5", pseudo: "QuantumPlay", userImage: generateAvatar("QuantumPlay", "professional") },
                        elo: 1923,
                        rank: 5
                    },
                    {
                        user: { id: "6", pseudo: "VoidWalker", userImage: generateAvatar("VoidWalker", "gaming") },
                        elo: 1876,
                        rank: 6
                    },
                    {
                        user: { id: "7", pseudo: "FlashBang", userImage: generateAvatar("FlashBang", "fun") },
                        elo: 1834,
                        rank: 7
                    },
                    {
                        user: { id: "8", pseudo: "StormBreaker", userImage: generateAvatar("StormBreaker", "gaming") },
                        elo: 1789,
                        rank: 8
                    },
                    {
                        user: { id: "9", pseudo: "PhoenixRise", userImage: generateAvatar("PhoenixRise", "professional") },
                        elo: 1756,
                        rank: 9
                    },
                    {
                        user: { id: "10", pseudo: "ShadowStrike", userImage: generateAvatar("ShadowStrike", "gaming") },
                        elo: 1723,
                        rank: 10
                    },
                    // Ajouter le joueur actuel avec son vrai avatar ou généré
                    {
                        user: {
                            id: user?.id || "user",
                            pseudo: user?.pseudo || "Vous",
                            userImage: user?.userImage || generateAvatar(user?.pseudo || "Player", "gaming")
                        },
                        elo: 1547,
                        rank: 156
                    }
                ];

                setLeaderboard(fakeLeaderboard);
                setUserRank({
                    elo: 1547,
                    rank: 156,
                    total: 2847
                });
                setIsLoading(false);
            }, 1000);
        }
    }, [isConnected, selectedGame, user]);

    const filteredLeaderboard = leaderboard.filter(player =>
        player.user.pseudo.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getRankColor = (rank: number) => {
        if (rank === 1) return "text-yellow-400"; // Or
        if (rank === 2) return "text-gray-300"; // Argent
        if (rank === 3) return "text-orange-400"; // Bronze
        if (rank <= 10) return "text-blue-400"; // Top 10
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
        if (elo >= 2000) return "text-purple-400"; // Maître
        if (elo >= 1800) return "text-blue-400"; // Diamant
        if (elo >= 1500) return "text-green-400"; // Or
        if (elo >= 1200) return "text-yellow-400"; // Argent
        return "text-gray-400"; // Bronze
    };

    if (!isConnected) {
        return (
            <div className="ml-14 mt-20 p-6 text-white">
                <div className="text-center py-12">
                    <h1 className="text-3xl font-bold mb-4">Classement DualZone</h1>
                    <p className="text-gray-400 mb-6">Connectez-vous pour voir votre position dans le classement</p>
                    <button
                        onClick={() => window.location.href = "http://localhost:3333/auth/steam/"}
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
            {/* Header */}
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

            {/* Filtres et Recherche */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="flex space-x-2">
                    <button
                        onClick={() => setSelectedGame(1)}
                        className={`px-4 py-2 rounded-lg font-medium transition-all ${
                            selectedGame === 1
                                ? "bg-green-600 text-white"
                                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                        }`}
                    >
                        🎯 CS2 - Tous modes
                    </button>
                    {/* Futur: ajouter d'autres jeux */}
                </div>

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
                                        {/* Rang */}
                                        <div className="text-center min-w-[60px]">
                                            <div className={`text-2xl ${getRankColor(player.rank)}`}>
                                                {getRankIcon(player.rank)}
                                            </div>
                                            <div className={`font-bold ${getRankColor(player.rank)}`}>
                                                #{player.rank}
                                            </div>
                                        </div>

                                        {/* Avatar et nom */}
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

                                    {/* ELO */}
                                    <div className="text-right">
                                        <div className={`text-2xl font-bold ${getEloColor(player.elo)}`}>
                                            {player.elo}
                                        </div>
                                        <div className="text-gray-400 text-sm">ELO</div>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {filteredLeaderboard.length === 0 && (
                            <div className="text-center py-12 text-gray-400">
                                <p className="text-xl">Aucun joueur trouvé</p>
                                <p className="text-sm">Essayez un autre terme de recherche</p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Pagination */}
            {!isLoading && filteredLeaderboard.length > 0 && (
                <div className="flex justify-center space-x-2">
                    <button className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-all disabled:opacity-50" disabled>
                        ← Précédent
                    </button>
                    <button className="px-4 py-2 bg-green-600 text-white rounded-lg">
                        1
                    </button>
                    <button className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-all">
                        2
                    </button>
                    <button className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-all">
                        3
                    </button>
                    <button className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-all">
                        Suivant →
                    </button>
                </div>
            )}

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