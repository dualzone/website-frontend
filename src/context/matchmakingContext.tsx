// src/context/matchmakingcontext.tsx
"use client";
import { createContext, useState, useContext, useEffect, ReactNode } from "react";
import { useAuth } from "./authcontext";

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
    forceUpdateScore: () => Promise<void>;

    // États
    isLoading: boolean;
    error: string | null;
};

const MatchmakingContext = createContext<MatchmakingContextType | undefined>(undefined);

export const MatchmakingProvider = ({ children }: { children: ReactNode }) => {
    const { token } = useAuth();

    // État de la queue
    const [isInQueue, setIsInQueue] = useState(false);
    const [currentMode, setCurrentMode] = useState<number | null>(null);
    const [queueTimer, setQueueTimer] = useState(0);
    const [estimatedTime, setEstimatedTime] = useState("2m 30s");

    // Données des modes
    const [modes, setModes] = useState<Mode[]>([]);
    const [playersInQueue] = useState<{ [modeId: number]: number }>({
        1: 247, // 1v1
        2: 89   // 2v2
    });
    const [averageWaitTime] = useState<{ [modeId: number]: string }>({
        1: "1m 30s",
        2: "2m 15s"
    });

    // États généraux
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

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
            const response = await fetch("http://localhost:3333/modes/cs2", {
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
            const response = await fetch(`http://localhost:3333/match/enqueue/${modeId}`, {
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
        // TODO: Implémenter l'annulation côté API quand disponible
        setIsInQueue(false);
        setCurrentMode(null);
        setQueueTimer(0);
        console.log("Queue annulée");
    };

    // Fonctions de démo
    const forceFoundMatch = async () => {
        if (!token || !currentMode) return;

        try {
            const response = await fetch(`http://localhost:3333/demo/force_found_match/${currentMode}`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                console.log("Match forcé créé");
                // Le match est trouvé, on sort de la queue
                setIsInQueue(false);
                setCurrentMode(null);
                setQueueTimer(0);
            }
        } catch (err) {
            console.error("Erreur force match:", err);
        }
    };

    const forceResolveMatch = async () => {
        if (!token || !currentMode) return;

        try {
            const response = await fetch(`http://localhost:3333/demo/force_resolve_mm/${currentMode}`, {
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
            const response = await fetch("http://localhost:3333/demo/force_end_match", {
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
            const response = await fetch("http://localhost:3333/demo/force_warmup_start", {
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
            const response = await fetch("http://localhost:3333/demo/force_update_match_score", {
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

    const formatTime = (seconds: number) => {
        const min = Math.floor(seconds / 60);
        const sec = seconds % 60;
        return `${min}m ${sec < 10 ? "0" : ""}${sec}s`;
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