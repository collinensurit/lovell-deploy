'use client'

import type React from 'react'
import { useState, useCallback } from 'react'
import { X, Send, Maximize2, Minimize2, CreditCard } from 'lucide-react'
import { Select } from '@/components/ui/select'

interface Message {
  role: 'user' | 'ai'
  content: string
  model?: string
  cost?: number
}

interface LLMProvider {
  id: string
  name: string
  costPerQuery: number
}

const llmProviders: LLMProvider[] = [
  { id: 'gpt4', name: 'GPT-4', costPerQuery: 3 },
  { id: 'grok', name: 'Grok', costPerQuery: 2 },
]

export function AIChat({ onClose }: { onClose: () => void }) {
  const [input, setInput] = useState('')
  const [isMaximized, setIsMaximized] = useState(false)
  const [selectedModel, setSelectedModel] = useState(llmProviders[0].id)
  const [credits, setCredits] = useState(100) // In a real app, fetch from backend
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'ai',
      content: 'Hey, your total contract is $550,984.60—want a PO?',
      model: 'gpt4',
      cost: 0,
    },
  ])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const provider = llmProviders.find((p) => p.id === selectedModel)!
    if (credits < provider.costPerQuery) {
      setMessages([
        ...messages,
        {
          role: 'ai',
          content: 'Insufficient credits. Please add more credits to continue.',
          model: selectedModel,
          cost: 0,
        },
      ])
      return
    }

    // Add user message
    const userMessage: Message = {
      role: 'user',
      content: input,
      model: selectedModel,
    }
    const newMessages = [...messages, userMessage]
    setMessages(newMessages)
    setInput('')

    try {
      // In a real app, make API call here
      const response = await mockAIResponse(input, selectedModel)
      setCredits((prev) => prev - provider.costPerQuery)

      const aiMessage: Message = {
        role: 'ai',
        content: response,
        model: selectedModel,
        cost: provider.costPerQuery,
      }
      setMessages([...newMessages, aiMessage])
    } catch (error) {
      const errorMessage: Message = {
        role: 'ai',
        content: 'Sorry, there was an error processing your request.',
        model: selectedModel,
        cost: 0,
      }
      setMessages([...newMessages, errorMessage])
    }
  }

  // Mock AI response - replace with real API call
  const mockAIResponse = async (
    input: string,
    model: string
  ): Promise<string> => {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    return `Here's a response from ${model} to: ${input}`
  }

  const handleModelChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setSelectedModel(e.target.value)
    },
    []
  )

  return (
    <div
      className={`flex flex-col border-t border-[#3E3E3E] bg-[#1E1E1E] ${
        isMaximized ? 'h-[calc(100vh-3rem)]' : 'h-80'
      }`}
    >
      <div className="flex items-center justify-between border-b border-[#3E3E3E] bg-[#252526] px-4 py-2">
        <div className="flex items-center gap-4">
          <h3 className="text-sm font-medium">AI Assistant</h3>
          <div className="flex items-center gap-2 text-xs text-[#A0A0A0]">
            <CreditCard size={14} />
            <span>{credits} credits</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center space-x-2">
            <label
              htmlFor="model"
              className="text-sm font-medium text-[var(--vscode-editor-foreground)]"
            >
              Model:
            </label>
            <Select
              id="model"
              value={selectedModel}
              onChange={handleModelChange}
              className="w-48"
            >
              {llmProviders.map((provider) => (
                <option key={provider.id} value={provider.id}>
                  {provider.name} ({provider.costPerQuery} credits)
                </option>
              ))}
            </Select>
          </div>
          <button
            onClick={() => setIsMaximized(!isMaximized)}
            className="text-[#A0A0A0] hover:text-white"
          >
            {isMaximized ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>
          <button onClick={onClose} className="text-[#A0A0A0] hover:text-white">
            <X size={16} />
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-auto p-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`mb-4 ${message.role === 'user' ? 'text-right' : ''}`}
          >
            <div
              className={`inline-block max-w-[80%] rounded-lg p-2 ${
                message.role === 'user'
                  ? 'bg-[#007ACC] text-white'
                  : 'bg-[#3E3E3E]'
              }`}
            >
              <div>{message.content}</div>
              {message.model &&
                message.cost !== undefined &&
                message.role === 'ai' && (
                  <div className="mt-1 text-xs text-[#A0A0A0]">
                    {message.model} • {message.cost} credits
                  </div>
                )}
            </div>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="border-t border-[#3E3E3E] p-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me anything..."
            className="flex-1 rounded bg-[#3E3E3E] px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-[#007ACC]"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="rounded bg-[#007ACC] px-3 py-2 text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Send size={16} />
          </button>
        </div>
      </form>
    </div>
  )
}
