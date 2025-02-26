'use client'

import React, { useState } from 'react'

export interface ChatProps {
  className?: string
}

export function Chat({ className = '' }: ChatProps) {
  const [messages, setMessages] = useState<
    Array<{ id: string; text: string; sender: 'user' | 'assistant' }>
  >([])
  const [input, setInput] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const newMessage = {
      id: Date.now().toString(),
      text: input,
      sender: 'user' as const,
    }

    setMessages((prev) => [...prev, newMessage])
    setInput('')
  }

  return (
    <div className={`flex h-full flex-col ${className}`}>
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`mb-4 flex ${
              message.sender === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`rounded-lg px-4 py-2 ${
                message.sender === 'user'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-white'
              }`}
            >
              {message.text}
            </div>
          </div>
        ))}
      </div>
      <form
        onSubmit={handleSubmit}
        className="border-t border-gray-200 p-4 dark:border-gray-800"
      >
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          />
          <button
            type="submit"
            className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  )
}
