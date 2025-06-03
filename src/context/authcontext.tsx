"use client";
import { createContext, useState,useContext, useEffect, ReactNode } from "react";

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
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [isConnected, setIsConnectedState] = useState(false);
    const [token, setToken] = useState<string | null>(null);
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const storedToken = localStorage.getItem("access_token");
        if (storedToken) {
            fetch("http://localhost:3333/auth", {
                headers: {
                    Authorization: `Bearer ${storedToken}`,
                },
            })
                .then(res => res.ok ? res.json() : Promise.reject("unauthorized"))
                .then(data => {
                    setIsConnectedState(true);
                    setToken(storedToken);
                    setUser(data.user);
                })
                .catch(() => logout());
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
        <AuthContext.Provider value={{ isConnected, setIsConnected, token, user, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context; };