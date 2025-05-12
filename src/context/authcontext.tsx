"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type AuthContextType = {
    isConnected: boolean;
    setIsConnected: (value: boolean) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [isConnected, setIsConnectedState] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem("isConnected");
        if (saved === "true") setIsConnectedState(true);
    }, []);

    const setIsConnected = (value: boolean) => {
        localStorage.setItem("isConnected", String(value));
        setIsConnectedState(value);
    };


    return (
        <AuthContext.Provider value={{ isConnected, setIsConnected }}>
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