// src/context/websocketContext.tsx
"use client";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useAuth } from "./authcontext";

type WebSocketContextType = {
    isConnected: boolean;
    lastMessage: any;
    sendMessage: (message: any) => void;
};

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

export const WebSocketProvider = ({ children }: { children: ReactNode }) => {
    const { user, token } = useAuth();
    const [socket, setSocket] = useState<WebSocket | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [lastMessage, setLastMessage] = useState<any>(null);

    useEffect(() => {
        if (user && token) {
            // Utiliser l'URL de l'API mais avec le protocole WebSocket
            const wsUrl = process.env.NEXT_PUBLIC_API_URL?.replace('http', 'ws') || 'ws://192.168.1.210:3333';
            const ws = new WebSocket(`${wsUrl}/ws`);

            ws.onopen = () => {
                console.log("WebSocket connecté");
                setIsConnected(true);
                // Authentification WebSocket
                ws.send(JSON.stringify({
                    type: "auth",
                    token: token
                }));
            };

            ws.onmessage = (event) => {
                const data = JSON.parse(event.data);
                setLastMessage(data);
                console.log("Message WebSocket reçu:", data);
            };

            ws.onclose = () => {
                console.log("WebSocket déconnecté");
                setIsConnected(false);
            };

            setSocket(ws);

            return () => {
                ws.close();
            };
        }
    }, [user, token]);

    const sendMessage = (message: any) => {
        if (socket && isConnected) {
            socket.send(JSON.stringify(message));
        }
    };

    return (
        <WebSocketContext.Provider value={{ isConnected, lastMessage, sendMessage }}>
            {children}
        </WebSocketContext.Provider>
    );
};

export const useWebSocket = () => {
    const context = useContext(WebSocketContext);
    if (!context) {
        throw new Error("useWebSocket must be used within a WebSocketProvider");
    }
    return context;
};