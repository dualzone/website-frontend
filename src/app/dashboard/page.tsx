// src/app/dashboard/page.ts

import Image from 'next/image';

const fakeMatchHistory = [
    { opponent: 'AlphaZ', result: 'win', score: '13-7', date: '2025-03-25' },
    { opponent: 'Nexus99', result: 'lose', score: '10-13', date: '2025-03-23' },
    { opponent: 'GhostX', result: 'win', score: '13-11', date: '2025-03-20' },
];

export default function DashboardPage() {
    return (
        <main className="ml-14 mt-20 p-6 space-y-8">
            {/* Header */}
            <header className="flex items-center justify-between">
                <div className="flex items-center space-x-4 ">
                    <h1 className="text-xl font-semibold">Tableau de bord</h1>
                </div>
                <div className="text-right inline-flex items-center">
                    <Image src="/img.png" className="rounded-3xl m-6" alt="Logo" width={75} height={75} />
                    <div className="flex-col items-center">
                        <span className="text-lg font-bold flex">xX_D4rk-_-K1ll3r_Xx</span>
                        <span className="text-lg text-gray-300 flex">Elo : 1520</span>
                    </div>
                </div>
            </header>

            {/* Match history */}
            <section>
                <h2 className="text-lg font-medium mb-4">Historique des parties</h2>
                <ul className="space-y-2">
                    {fakeMatchHistory.map((match, index) => (
                        <li
                            key={index}
                            className={`p-4 rounded-xl shadow ${
                                match.result === 'win' ? 'bg-green-900' : 'bg-red-900'
                            }`}
                        >
                            <p className="font-semibold">
                                {match.result === 'win' ? 'Victoire' : 'Défaite'} contre {match.opponent}
                            </p>
                            <p className="text-sm text-gray-300">Score : {match.score} – {match.date}</p>
                        </li>
                    ))}
                </ul>
            </section>
        </main>
    );
}