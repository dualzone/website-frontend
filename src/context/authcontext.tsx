// src/context/authcontext.tsx
"use client";
import { createContext, useState, useContext, useEffect, ReactNode } from "react";
import { useNotifications } from "./notificationContext";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://192.168.1.210:3333";

type User = {
    id: string;
    pseudo: string;
    steamId: number;
    userImage: string;
    created_at: string;
    updated_at: string;
};

type AuthContextType = {
    isConnected: boolean;
    setIsConnected: (value: boolean) => void;
    token: string | null;
    user: User | null;
    logout: () => void;
    isLoading: boolean;
    login: (newToken: string) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [isConnected, setIsConnectedState] = useState(false);
    const [token, setToken] = useState<string | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const storedToken = localStorage.getItem("access_token");
        if (storedToken) {
            fetch(`${API_URL}/auth`, {
                headers: {
                    Authorization: `Bearer ${storedToken}`,
                },
            })
                .then(res => res.ok ? res.json() : Promise.reject("unauthorized"))
                .then(data => {
                    console.log("[AUTH] Authentifié :", data.user);
                    setIsConnectedState(true);
                    setToken(storedToken);
                    setUser(data.user);
                    setIsLoading(false);
                })
                .catch((err) => {
                    console.log("[AUTH] Erreur auth :", err);
                    setIsConnectedState(false);
                    setToken(null);
                    setUser(null);
                    setIsLoading(false);
                    localStorage.removeItem("access_token");
                });
        } else {
            setIsLoading(false);
        }
    }, []);

    const setIsConnected = (value: boolean) => {
        setIsConnectedState(value);
    };

    const logout = () => {
        setIsConnectedState(false);
        setToken(null);
        setUser(null);
        localStorage.removeItem("access_token");

        setTimeout(() => {
            window.location.replace("/");
        }, 50);
    };

    const login = (newToken: string) => {
        setToken(newToken);
        localStorage.setItem("access_token", newToken);
        setIsConnectedState(true);
        setIsLoading(false);

        fetch(`${API_URL}/auth`, {
            headers: {
                Authorization: `Bearer ${newToken}`,
            },
        })
            .then(res => res.json())
            .then(data => {
                setUser(data.user);
            })
            .catch(err => {
                console.error("[AUTH] Erreur lors de la récupération des données utilisateur :", err);
            });

        const url = new URL(window.location.href);
        url.searchParams.delete('token');
        window.history.replaceState({}, '', url.toString());
    };

    return (
        <AuthContext.Provider value={{ isConnected, setIsConnected, token, user, logout, isLoading, login }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};