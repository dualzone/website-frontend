import { Subscription, Transmit } from '@adonisjs/transmit-client'
import React, { createContext, useContext, useEffect, useRef } from 'react'
import { useAuth } from "./authcontext";

interface WebSocketContextType {
    isConnected: boolean
    error: Error | null
}

interface WebSocketProviderProps {
    channel: string
    onMessage: (event: string, data: any) => void
    children: React.ReactNode
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined)

export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({
    channel,
    onMessage,
    children,
}) => {
    const { user, token } = useAuth();
    const transmitRef = useRef<Transmit | null>(null)
    const subscriptionRef = useRef<Subscription | null>(null)
    const [isConnected, setIsConnected] = React.useState(false)
    const [error, setError] = React.useState<Error | null>(null)

    useEffect(() => {
        const initializeTransmit = async () => {
            try {
                console.log('Initializing WebSocket connection...')

                const wsUrl = process.env.NEXT_PUBLIC_API_URL;
                // Create new Transmit instance
                const transmit: Transmit = new Transmit({
                    baseUrl: wsUrl || window.location.origin,
                    beforeSubscribe(request: any) {
                        if (request.headers instanceof Headers) {
                            request.headers.set('Authorization', `Bearer ${token}`)
                        } else {
                            request.headers = {
                                ...request.headers,
                                Authorization: `Bearer ${token}`,
                            }
                        }

                    },
                    onSubscription(_channel: string) {
                        console.log(`Subscribed to channel: ${channel}`);
                    }

                })
                transmitRef.current = transmit

                console.log('Try to subscribe to the channel', channel)

                const subscription = transmit.subscription(channel)
                await subscription.create()

                subscriptionRef.current = subscription

                subscription.onMessage((data: any) => {
                    console.log(data)
                    onMessage(data.event, data.data)
                })


            } catch (err) {
                setError(err instanceof Error ? err : new Error('Failed to initialize WebSocket'))
                setIsConnected(false)
                console.error('WebSocket initialization error:', err)
            }
        }

        initializeTransmit()

        // Cleanup on unmount
        return () => {
            if (transmitRef.current) {
                transmitRef.current.close()
            }
        }
    }, [channel])



    const value = {
        isConnected,
        error
    }

    return (
        <WebSocketContext.Provider value={value}>
            {children}
        </WebSocketContext.Provider>
    )
}

export const useWebSocket = () => {
    const context = useContext(WebSocketContext)
    if (!context) {
        throw new Error('useWebSocket must be used within a WebSocketProvider')
    }
    return context
}