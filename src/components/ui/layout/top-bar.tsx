import { MessageSquare } from 'lucide-react'

export function TopBar({ onChatToggle }: { onChatToggle: () => void }) {
  return (
    <div className="flex h-12 items-center justify-between border-b border-[#3E3E3E] bg-[#252526] px-4">
      <h1 className="text-lg font-semibold">Company Twin IDE</h1>
      <button
        onClick={onChatToggle}
        className="text-[#A0A0A0] hover:text-white"
      >
        <MessageSquare size={20} />
      </button>
    </div>
  )
}
