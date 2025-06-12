// /src/context/authcontext.tsx
"use client";
import { createContext, useState,useContext, useEffect, ReactNode } from "react";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3333";

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
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [isConnected, setIsConnectedState] = useState(false);
    const [token, setToken] = useState<string | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    console.log("[Home.tsx]", { isConnected, user, isLoading });

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
                    setIsLoading(false); // ✅ Ajouté ici !
                })
                .catch((err) => {
                    console.log("[AUTH] Erreur auth :", err);
                    setIsConnectedState(false);
                    setToken(null);
                    setUser(null);
                    setIsLoading(false); // ✅ Aussi dans le catch
                    // Optionnel: ne pas appeler logout() ici pour éviter les boucles
                    localStorage.removeItem("access_token");
                });
        } else {
            setIsLoading(false); // ✅ Aussi quand il n'y a pas de token
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

        // attendre un cycle complet pour s'assurer que localStorage est bien vidé
        setTimeout(() => {
            window.location.replace("/"); // force une vraie navigation sans recharger React state
        }, 50);
    };

    return (
        <AuthContext.Provider value={{ isConnected, setIsConnected, token, user, logout, isLoading }}>
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