"use client";
import Image from "next/image";
import { useAuth } from "@/context/authcontext";

export default function DashboardPage() {
    const { user, isConnected, elo } = useAuth();

    if (!isConnected || !user) {
        return <p className="text-white p-8">Chargement ou non connecté...</p>;
    }

    // fake data pour l'historique pour l'instant
    const fakeMatchHistory = [
        { opponent: "AlphaZ", result: "win", score: "13-7", date: "2025-03-25" },
        { opponent: "Nexus99", result: "lose", score: "10-13", date: "2025-03-23" },
        { opponent: "GhostX", result: "win", score: "13-11", date: "2025-03-20" },
    ];

    return (
        <main className="ml-14 mt-20 p-6 space-y-8">
            <header className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <h1 className="text-xl font-semibold text-white">Tableau de bord</h1>
                </div>
                <div className="text-right inline-flex items-center">
                    {user.userImage ? (
                        <Image
                            src={user.userImage}
                            alt="Avatar"
                            width={75}
                            height={75}
                            className="rounded-3xl m-6"
                            unoptimized // si l'image externe pose souci
                        />
                    ) : (
                        <div className="rounded-3xl m-6 w-[75px] h-[75px] bg-gray-700" />
                    )}
                    <div className="flex-col items-center text-white">
                        <span className="text-lg font-bold flex">{user.pseudo}</span>
                        <span className="text-lg text-gray-300 flex">Elo : {user.elo ?? "?"}</span>
                    </div>
                </div>
            </header>

            <section>
                <h2 className="text-lg font-medium mb-4 text-white">Historique des parties</h2>
                <ul className="space-y-2">
                    {fakeMatchHistory.map((match, index) => (
                        <li
                            key={index}
                            className={`p-4 rounded-xl shadow ${
                                match.result === "win" ? "bg-green-900" : "bg-red-900"
                            } text-white`}
                        >
                            <p className="font-semibold">
                                {match.result === "win" ? "Victoire" : "Défaite"} contre {match.opponent}
                            </p>
                            <p className="text-sm text-gray-300">
                                Score : {match.score} – {match.date}
                            </p>
                        </li>
                    ))}
                </ul>
            </section>
        </main>
    );
}
