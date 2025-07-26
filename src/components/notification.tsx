"use client"

import { NotificationType } from "@/context/notificationContext"
import React from "react"

interface NotificationProps {
  id: string
  message: string
  type: NotificationType
  onClose: (id: string) => void
}

const colors = {
  info: {
    bg: "bg-gray-800",
    text: "text-gray-300",
    ring: "ring-gray-600",
    outline: "outline outline-2 outline-gray-500/50",
    icon: (
      <svg
        className="w-5 h-5 text-gray-400"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 16v-4m0-4h.01" />
      </svg>
    ),
  },
  warning: {
    bg: "bg-yellow-100",
    text: "text-yellow-800",
    ring: "ring-yellow-300",
    outline: "outline outline-2 outline-yellow-400/50",
    icon: (
      <svg
        className="w-5 h-5 text-yellow-600"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01" />
      </svg>
    ),
  },
  error: {
    bg: "bg-red-100",
    text: "text-red-700",
    ring: "ring-red-300",
    outline: "outline outline-2 outline-red-400/50",
    icon: (
      <svg
        className="w-5 h-5 text-red-600"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
      </svg>
    ),
  },
}

export const Notification: React.FC<NotificationProps> = ({ id, message, type, onClose }) => {
  const c = colors[type] || colors.info

  return (
    <div
      onClick={() => onClose(id)}
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
      className={`flex items-start space-x-3 rounded-md border ${c.bg} ${c.text} ring-1 ring-inset ${c.ring} ${c.outline} shadow-sm cursor-pointer select-none px-4 py-2 max-w-xs w-full`}
      title="Cliquer pour fermer"
    >
      <div className="pt-0.5">{c.icon}</div>
      <p className="text-sm font-medium break-words whitespace-normal">{message}</p>
      <button
        aria-label="Fermer notification"
        onClick={(e) => {
          e.stopPropagation()
          onClose(id)
        }}
        className="ml-auto text-current hover:text-gray-400 transition shrink-0"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  )
}
