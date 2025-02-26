'use client'

import * as React from 'react'
import { cn } from '@/lib/utils/cn'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'

interface AIToolsPanelProps {
  className?: string
  selectedTool?: string
  onSelectTool?: (tool: string) => void
}

export const AIToolsPanel = React.forwardRef<HTMLDivElement, AIToolsPanelProps>(
  ({ className, selectedTool, onSelectTool }, ref) => {
    const [isRunning, setIsRunning] = React.useState(false)
    const [progress, setProgress] = React.useState(0)

    const tools = React.useMemo(
      () => [
        {
          id: 'chat',
          name: 'AI Chat',
          description: 'Chat with an AI assistant',
          icon: '💬',
        },
        {
          id: 'code',
          name: 'Code Analysis',
          description: 'Analyze and explain code',
          icon: '🔍',
        },
        {
          id: 'generate',
          name: 'Code Generation',
          description: 'Generate code from description',
          icon: '✨',
        },
      ],
      []
    )

    React.useEffect(() => {
      let timer: NodeJS.Timeout | undefined

      if (isRunning) {
        timer = setInterval(() => {
          setProgress((prev) => {
            if (prev >= 100) {
              setIsRunning(false)
              clearInterval(timer)
              return 100
            }
            return prev + 10
          })
        }, 500)
      }

      return () => {
        if (timer) {
          clearInterval(timer)
        }
      }
    }, [isRunning])

    const handleToolSelect = React.useCallback(
      (toolId: string) => {
        onSelectTool?.(toolId)
        setIsRunning(true)
        setProgress(0)
      },
      [onSelectTool]
    )

    return (
      <div ref={ref} className={cn('flex flex-col space-y-4 p-4', className)}>
        <div className="flex flex-col space-y-2">
          {tools.map((tool) => (
            <Button
              key={tool.id}
              variant={selectedTool === tool.id ? 'default' : 'outline'}
              className="justify-start"
              onClick={() => handleToolSelect(tool.id)}
            >
              <span className="mr-2">{tool.icon}</span>
              <div className="flex flex-col items-start">
                <span className="font-medium">{tool.name}</span>
                <span className="text-sm text-muted-foreground">
                  {tool.description}
                </span>
              </div>
            </Button>
          ))}
        </div>
        {isRunning && (
          <div className="space-y-2">
            <Progress value={progress} max={100} />
            <p className="text-sm text-muted-foreground">
              Processing... {progress}%
            </p>
          </div>
        )}
      </div>
    )
  }
)

AIToolsPanel.displayName = 'AIToolsPanel'
