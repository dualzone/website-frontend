// src/context/matchmakingContext.tsx
"use client";
import { createContext, useState, useContext, useEffect, ReactNode } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "./authcontext";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://192.168.1.210:3333";

type Mode = {
    id: number;
    name: string;
};

type MatchmakingContextType = {
    // État de la queue
    isInQueue: boolean;
    currentMode: number | null;
    queueTimer: number;
    estimatedTime: string;

    // Données des modes
    modes: Mode[];
    playersInQueue: { [modeId: number]: number };
    averageWaitTime: { [modeId: number]: string };

    // Actions principales
    enqueue: (modeId: number) => Promise<void>;
    cancelQueue: () => void;

    // Actions de démo
    forceFoundMatch: () => Promise<void>;
    forceResolveMatch: () => Promise<void>;

    forceEndMatch: () => Promise<void>;
    forceWarmupStart: () => Promise<void>;
    forceChoosingStart: () => Promise<void>;
    forcePlayingStart: () => Promise<void>;

    forceUpdateScore: () => Promise<void>;

    generateRandomMatch: () => Promise<void>;

    // États
    isLoading: boolean;
    error: string | null;
};

const MatchmakingContext = createContext<MatchmakingContextType | undefined>(undefined);

export const MatchmakingProvider = ({ children }: { children: ReactNode }) => {
    const { token } = useAuth();

    const router = useRouter();

    // État de la queue
    const [isInQueue, setIsInQueue] = useState(false);
    const [currentMode, setCurrentMode] = useState<number | null>(null);
    const [queueTimer, setQueueTimer] = useState(0);
    const [estimatedTime, setEstimatedTime] = useState("2m 30s");

    // Données des modes
    const [modes, setModes] = useState<Mode[]>([]);
    const [playersInQueue] = useState<{ [modeId: number]: number }>({
        1: 247,
        2: 89
    });
    const [averageWaitTime] = useState<{ [modeId: number]: string }>({
        1: "1m 30s",
        2: "2m 15s"
    });

    // États généraux
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Vérifier si l'utilisateur est déjà en queue au démarrage
    useEffect(() => {
        if(!token) return
        const checkMatchStatus = async () => {
            try {
                const response = await axios.get(
                    `${process.env.NEXT_PUBLIC_API_URL}/match/status`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );
                if(response.data.message === "User is in queue") {
                    setIsInQueue(true);
                    setCurrentMode(1)
                    router.push("/matchmaking");
                }else if(response.data.message === "User is in match") {
                    router.push(`/match/${response.data.party.id}`);
                } else {
                    console.error("Unexpected response:", response.data);
                }


            } catch (error) {
                console.error('Failed to fetch match status:', error);
            }
        };

        checkMatchStatus();
    }, [token])

    // Timer pour la queue
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isInQueue) {
            interval = setInterval(() => {
                setQueueTimer(prev => prev + 1);
            }, 1000);
        } else {
            setQueueTimer(0);
        }
        return () => clearInterval(interval);
    }, [isInQueue]);

    // Charger les modes au démarrage
    useEffect(() => {
        if (token) {
            fetchModes();
        }
    }, [token]);

    const fetchModes = async () => {
        try {
            const response = await fetch(`${API_URL}/modes/cs2`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.ok) {
                const modesData = await response.json();
                setModes(modesData);
            }
        } catch (err) {
            console.error("Erreur lors du chargement des modes:", err);
        }
    };

    const enqueue = async (modeId: number) => {
        if (!token) return;

        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch(`${API_URL}/match/enqueue/${modeId}`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                setIsInQueue(true);
                setCurrentMode(modeId);
                setEstimatedTime(averageWaitTime[modeId] || "2m 30s");
                console.log(`En queue pour le mode ${modeId}`);
            } else {
                throw new Error("Impossible de rejoindre la queue");
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "Erreur inconnue");
            console.error("Erreur enqueue:", err);
        } finally {
            setIsLoading(false);
        }
    };

    const cancelQueue = () => {
        setIsInQueue(false);
        setCurrentMode(null);
        setQueueTimer(0);
        console.log("Queue annulée");
    };

    // Fonctions de démo
    const forceFoundMatch = async () => {
        if (!token || !currentMode) return;

        try {
            const response = await fetch(`${API_URL}/demo/matchmaking/randomplayer/${currentMode}`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                console.log("Match forcé créé");

                // ✅ Générer un ID de match fictif et rediriger
                const fakeMatchId = `demo-match-${Date.now()}`;

                // Nettoyer l'état de la queue
                setIsInQueue(false);
                setCurrentMode(null);
                setQueueTimer(0);

                // ✅ Redirection vers la page de match
                window.location.href = `/match/${fakeMatchId}`;
            }
        } catch (err) {
            console.error("Erreur force match:", err);
        }
    };

    const forceResolveMatch = async () => {
        if (!token || !currentMode) return;

        try {
            const response = await fetch(`${API_URL}/demo/matchmaking/resolveduo/${currentMode}`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                console.log("Matchmaking forcé résolu");
            }
        } catch (err) {
            console.error("Erreur force resolve:", err);
        }
    };

    const forceEndMatch = async () => {
        if (!token) return;

        try {
            const response = await fetch(`${API_URL}/demo/force/status/end`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                console.log("Match forcé terminé");
            }
        } catch (err) {
            console.error("Erreur force end match:", err);
        }
    };

    const forceWarmupStart = async () => {
        if (!token) return;

        try {
            const response = await fetch(`${API_URL}/demo/force/status/warmup`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                console.log("Warmup forcé démarré");
            }
        } catch (err) {
            console.error("Erreur force warmup:", err);
        }
    };

    const forceChoosingStart = async () => {
        if (!token) return;

        try {
            const response = await fetch(`${API_URL}/demo/force/status/choose`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                console.log("Warmup forcé démarré");
            }
        } catch (err) {
            console.error("Erreur force warmup:", err);
        }
    };

    const forcePlayingStart = async () => {
        if (!token) return;

        try {
            const response = await fetch(`${API_URL}/demo/force/status/play`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                console.log("Warmup forcé démarré");
            }
        } catch (err) {
            console.error("Erreur force warmup:", err);
        }
    };

    const forceUpdateScore = async () => {
        if (!token) return;

        try {
            const response = await fetch(`${API_URL}/demo/force/score`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                console.log("Score forcé mis à jour");
            }
        } catch (err) {
            console.error("Erreur force update score:", err);
        }
    };

    const generateRandomMatch = async () => {
        if (!token) return;

        try {
            const response = await fetch(`${API_URL}/demo/random_result`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                console.log("Warmup forcé démarré");
            }
        } catch (err) {
            console.error("Erreur force warmup:", err);
        }
    };


    return (
        <MatchmakingContext.Provider value={{
            // État de la queue
            isInQueue,
            currentMode,
            queueTimer,
            estimatedTime,

            // Données des modes
            modes,
            playersInQueue,
            averageWaitTime,

            // Actions principales
            enqueue,
            cancelQueue,

            // Actions de démo
            forceFoundMatch,
            forceResolveMatch,
            forceEndMatch,
            forceWarmupStart,
            forceUpdateScore,
            forceChoosingStart,
            forcePlayingStart,
            generateRandomMatch,


            // États
            isLoading,
            error,
        }}>
            {children}
        </MatchmakingContext.Provider>
    );
};

export const useMatchmaking = () => {
    const context = useContext(MatchmakingContext);
    if (!context) {
        throw new Error("useMatchmaking must be used within a MatchmakingProvider");
    }
    return context;
};