"use client"

import { Subscription, Transmit } from '@adonisjs/transmit-client'
import React, { createContext, useContext, useEffect, useRef, useState } from 'react'
import { useAuth } from './authcontext'

export enum NotificationType {
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error',
}

interface Notification {
  id: string
  message: string
  type: NotificationType
}

interface NotificationContextType {
  isConnected: boolean
  error: Error | null
  notifications: Notification[]
  addNotification: (notif: Omit<Notification, 'id'>) => void
  clearNotifications: () => void
}

interface NotificationProviderProps {
  children: React.ReactNode
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const { token, user } = useAuth()
  const transmitRef = useRef<Transmit | null>(null)
  const subscriptionRef = useRef<Subscription | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [notifications, setNotifications] = useState<Notification[]>([])

  // Pour générer un id unique
  const generateId = () => Math.random().toString(36).substring(2, 10) + Date.now()

  // Ajout d'une notif avec suppression automatique au bout de 10s
  const addNotification = (notif: Omit<Notification, 'id'>) => {
    const id = generateId()
    setNotifications((prev) => [...prev, { id, ...notif }])

    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id))
    }, 5000) // 5 secondes
  }

  useEffect(() => {
    const initializeTransmit = async () => {
        if(!user) return;
        try {
          const wsUrl = process.env.NEXT_PUBLIC_API_URL || window.location.origin
  
          const transmit = new Transmit({
            baseUrl: wsUrl,
            beforeSubscribe(request) {
              if (request.headers instanceof Headers) {
                request.headers.set('Authorization', `Bearer ${token}`)
              } else {
                request.headers = {
                  ...request.headers,
                  Authorization: `Bearer ${token}`,
                }
              }
            },
          })
  
          transmitRef.current = transmit
          const subscription = transmit.subscription(`users/${user.id}/notify`)
          await subscription.create()
          subscriptionRef.current = subscription
  
          subscription.onMessage((data: any) => {
            addNotification({
              message: data.message,
              type: data.type || NotificationType.INFO,
            })
          })
  
        } catch (err) {
          setError(err instanceof Error ? err : new Error('Failed to initialize notification websocket'))
          setIsConnected(false)
        }
      }

    if (!token || !user) {
      // Pas de token : on ne connecte pas au websocket, mais on garde le système de notification local fonctionnel
      setIsConnected(false)
      setError(null)
      return
    }else {
        initializeTransmit()
    }

    

    

    return () => {
      if (transmitRef.current) {
        transmitRef.current.close()
      }
      setIsConnected(false)
      setNotifications([])
    }
  }, [token, user])

  const clearNotifications = () => {
    setNotifications([])
  }

  return (
    <NotificationContext.Provider value={{ isConnected, error, notifications, addNotification, clearNotifications }}>
      {children}
    </NotificationContext.Provider>
  )
}

export const useNotifications = (): NotificationContextType => {
  const context = useContext(NotificationContext)
  if (!context) throw new Error('useNotifications must be used within a NotificationProvider')
  return context
}
