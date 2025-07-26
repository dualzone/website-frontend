// src/app/dashboard/page.tsx
"use client";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/context/authcontext";
import { useMatchmaking } from "@/context/matchmakingContext";
import { useState, useEffect } from "react";

type QuickStats = {
    currentElo: number;
    currentRank: number;
    totalPlayers: number;
    todayMatches: number;
    weekWins: number;
    weekLosses: number;
    winStreak: number;
};

type RecentActivity = {
    id: string;
    type: "match" | "friend" | "rank";
    message: string;
    time: string;
    icon: string;
};

export default function DashboardPage() {
    const { user, isConnected } = useAuth();
    const { playersInQueue } = useMatchmaking();
    const [quickStats, setQuickStats] = useState<QuickStats | null>(null);
    const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Données fictives en attendant l'API
    useEffect(() => {
        if (isConnected && user) {
            setTimeout(() => {
                setQuickStats({
                    currentElo: 1547,
                    currentRank: 156,
                    totalPlayers: 2847,
                    todayMatches: 3,
                    weekWins: 8,
                    weekLosses: 4,
                    winStreak: 2
                });

                setRecentActivity([
                    {
                        id: "1",
                        type: "match",
                        message: "Victoire contre AlphaZ en 1v1",
                        time: "Il y a 2h",
                        icon: "🏆"
                    },
                    {
                        id: "2",
                        type: "rank",
                        message: "Rang amélioré : #156 → #142",
                        time: "Il y a 5h",
                        icon: "📈"
                    },
                    {
                        id: "3",
                        type: "friend",
                        message: "GhostX vous a ajouté en ami",
                        time: "Il y a 1j",
                        icon: "👥"
                    },
                    {
                        id: "4",
                        type: "match",
                        message: "Défaite contre Nexus99 en 2v2",
                        time: "Il y a 2j",
                        icon: "😔"
                    },
                    {
                        id: "5",
                        type: "match",
                        message: "Série de 3 victoires consécutives !",
                        time: "Il y a 3j",
                        icon: "🔥"
                    }
                ]);

                setIsLoading(false);
            }, 800);
        }
    }, [isConnected, user]);

    if (!isConnected || !user) {
        return <p className="text-white p-8 ml-14 mt-20">Chargement ou non connecté...</p>;
    }

    if (isLoading) {
        return (
            <div className="ml-14 mt-20 p-6 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-green-500"></div>
            </div>
        );
    }

    const winRate = quickStats ? (quickStats.weekWins / (quickStats.weekWins + quickStats.weekLosses)) * 100 : 0;

    return (
        <main className="ml-14 mt-20 p-6 space-y-8">
            {/* Header avec info utilisateur */}
            <header className="bg-gradient-to-r from-gray-800 to-gray-700 rounded-xl p-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-6">
                        <div>
                            <h1 className="text-3xl font-bold text-white">Tableau de bord</h1>
                            <p className="text-gray-300">Bon retour, {user.pseudo} !</p>
                        </div>
                    </div>
                    <div className="text-right inline-flex items-center">
                        {user.userImage ? (
                            <Image
                                src={user.userImage}
                                alt="Avatar"
                                width={75}
                                height={75}
                                className="rounded-3xl m-6 border-4 border-green-500"
                                unoptimized
                            />
                        ) : (
                            <div className="rounded-3xl m-6 w-[75px] h-[75px] bg-gray-700 border-4 border-green-500" />
                        )}
                        <div className="flex-col items-center text-white">
                            <span className="text-lg font-bold flex">{user.pseudo}</span>
                            <span className="text-sm text-gray-400">En ligne</span>
                        </div>
                    </div>
                </div>
            </header>

            {/* Statistiques rapides */}
            {quickStats && (
                <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-xl p-6 text-white">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-green-100 text-sm">ELO Actuel</p>
                                <p className="text-3xl font-bold">{quickStats.currentElo}</p>
                            </div>
                            <div className="text-4xl">⚡</div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-6 text-white">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-blue-100 text-sm">Classement</p>
                                <p className="text-3xl font-bold">#{quickStats.currentRank}</p>
                            </div>
                            <div className="text-4xl">🏆</div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl p-6 text-white">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-purple-100 text-sm">Matchs aujourd'hui</p>
                                <p className="text-3xl font-bold">{quickStats.todayMatches}</p>
                            </div>
                            <div className="text-4xl">🎮</div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-orange-600 to-orange-700 rounded-xl p-6 text-white">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-orange-100 text-sm">Série actuelle</p>
                                <p className="text-3xl font-bold">{quickStats.winStreak}</p>
                            </div>
                            <div className="text-4xl">🔥</div>
                        </div>
                    </div>
                </section>
            )}

            {/* Performance de la semaine */}
            {quickStats && (
                <section className="bg-gray-800 rounded-xl p-6">
                    <h2 className="text-xl font-semibold mb-4 text-white">Performance cette semaine</h2>
                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="text-center">
                            <div className="text-3xl font-bold text-green-400">{quickStats.weekWins}</div>
                            <div className="text-gray-400">Victoires</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-red-400">{quickStats.weekLosses}</div>
                            <div className="text-gray-400">Défaites</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-blue-400">{winRate.toFixed(1)}%</div>
                            <div className="text-gray-400">Taux de victoire</div>
                        </div>
                    </div>

                    {/* Barre de progression */}
                    <div className="mt-4">
                        <div className="w-full bg-gray-700 rounded-full h-3">
                            <div
                                className="bg-gradient-to-r from-green-500 to-blue-500 h-3 rounded-full transition-all duration-300"
                                style={{ width: `${winRate}%` }}
                            ></div>
                        </div>
                        <div className="flex justify-between text-sm text-gray-400 mt-2">
                            <span>0%</span>
                            <span>50%</span>
                            <span>100%</span>
                        </div>
                    </div>
                </section>
            )}

            {/* Actions rapides */}
            <section className="bg-gray-800 rounded-xl p-6">
                <h2 className="text-xl font-semibold mb-4 text-white">Actions rapides</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Link href="/" className="bg-green-600 hover:bg-green-700 rounded-lg p-4 text-center transition-all group">
                        <div className="text-3xl mb-2">🎯</div>
                        <div className="font-semibold text-white">Jouer</div>
                        <div className="text-green-200 text-sm">
                            {(playersInQueue[1] || 0) + (playersInQueue[2] || 0)} en ligne
                        </div>
                    </Link>

                    <Link href="/profil" className="bg-blue-600 hover:bg-blue-700 rounded-lg p-4 text-center transition-all group">
                        <div className="text-3xl mb-2">📊</div>
                        <div className="font-semibold text-white">Mon Profil</div>
                        <div className="text-blue-200 text-sm">Statistiques détaillées</div>
                    </Link>

                    <Link href="/classement" className="bg-purple-600 hover:bg-purple-700 rounded-lg p-4 text-center transition-all group">
                        <div className="text-3xl mb-2">🏆</div>
                        <div className="font-semibold text-white">Classement</div>
                        <div className="text-purple-200 text-sm">Top joueurs</div>
                    </Link>

                    <Link href="/friends" className="bg-orange-600 hover:bg-orange-700 rounded-lg p-4 text-center transition-all group">
                        <div className="text-3xl mb-2">👥</div>
                        <div className="font-semibold text-white">Amis</div>
                        <div className="text-orange-200 text-sm">Gérer mes relations</div>
                    </Link>
                </div>
            </section>

            {/* Activité récente */}
            <section className="bg-gray-800 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-white">Activité récente</h2>
                    <Link href="/profil" className="text-green-400 hover:text-green-300 text-sm transition-colors">
                        Voir tout →
                    </Link>
                </div>

                <div className="space-y-3">
                    {recentActivity.map((activity) => (
                        <div
                            key={activity.id}
                            className="flex items-center space-x-4 p-3 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-all"
                        >
                            <div className="text-2xl">{activity.icon}</div>
                            <div className="flex-1">
                                <p className="text-white">{activity.message}</p>
                                <p className="text-gray-400 text-sm">{activity.time}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* État du serveur */}
            <section className="bg-gray-800 rounded-xl p-6">
                <h2 className="text-xl font-semibold mb-4 text-white">État des serveurs</h2>
                <div className="grid md:grid-cols-3 gap-4">
                    <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-white">Serveurs EU</span>
                        <span className="text-green-400 text-sm">Opérationnel</span>
                    </div>
                    <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-white">Matchmaking</span>
                        <span className="text-green-400 text-sm">Opérationnel</span>
                    </div>
                    <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                        <span className="text-white">API Steam</span>
                        <span className="text-yellow-400 text-sm">Ralenti</span>
                    </div>
                </div>
            </section>
        </main>
    );
}