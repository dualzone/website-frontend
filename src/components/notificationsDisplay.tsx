"use client"

import { useNotifications } from '@/context/notificationContext'
import React from 'react'
import { Notification } from './notification'


export const NotificationsDisplay = () => {
  const { notifications, clearNotifications } = useNotifications()

  return (
    <div className="fixed bottom-6 right-6 flex flex-col gap-2 max-w-xs w-full z-[9999] pointer-events-auto">
      {notifications.map(({ id, message, type }) => (
        <Notification
          key={id}
          id={id}
          message={message}
          type={type}
          onClose={(id) => {
            clearNotifications() // ou supprimer individuellement via un addDelete function dans ton contexte
          }}
        />
      ))}
    </div>
  )
}
