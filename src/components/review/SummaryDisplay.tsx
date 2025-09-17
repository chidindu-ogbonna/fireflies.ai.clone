"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Loader2, Sparkles } from "lucide-react"

interface SummaryDisplayProps {
  meetingId: string
  summary?: string | null
  actionItems?: string | null
  onSummaryGenerated?: (summary: string, actionItems: string) => void
}

export function SummaryDisplay({
  meetingId,
  summary,
  actionItems,
  onSummaryGenerated
}: SummaryDisplayProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [currentSummary, setCurrentSummary] = useState(summary)
  const [currentActionItems, setCurrentActionItems] = useState(actionItems)

  const generateSummary = async () => {
    setIsGenerating(true)

    try {
      const response = await fetch(`/api/meetings/${meetingId}/summary`, {
        method: "POST",
      })

      if (response.ok) {
        const data = await response.json()
        setCurrentSummary(data.summary)
        setCurrentActionItems(data.actionItems)

        if (onSummaryGenerated) {
          onSummaryGenerated(data.summary, data.actionItems)
        }
      } else {
        console.error("Failed to generate summary")
      }
    } catch (error) {
      console.error("Error generating summary:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  if (!currentSummary && !currentActionItems) {
    return (
      <div className="bg-white rounded-lg border p-6">
        <div className="text-center">
          <Sparkles className="h-12 w-12 text-blue-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">AI Summary</h3>
          <p className="text-gray-600 mb-4">
            Generate an AI-powered summary and action items from this meeting
          </p>
          <Button
            onClick={generateSummary}
            disabled={isGenerating}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Generate Summary
              </>
            )}
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {currentSummary && (
        <div className="bg-white rounded-lg border p-6">
          <h3 className="text-lg font-semibold mb-4">Meeting Summary</h3>
          <div className="prose max-w-none">
            <div className="text-sm leading-relaxed text-gray-700 whitespace-pre-wrap">
              {currentSummary}
            </div>
          </div>
        </div>
      )}

      {currentActionItems && (
        <div className="bg-white rounded-lg border p-6">
          <h3 className="text-lg font-semibold mb-4">Action Items</h3>
          <div className="prose max-w-none">
            <div className="text-sm leading-relaxed text-gray-700 whitespace-pre-wrap">
              {currentActionItems}
            </div>
          </div>
        </div>
      )}

      {(currentSummary || currentActionItems) && (
        <div className="text-center">
          <Button
            onClick={generateSummary}
            disabled={isGenerating}
            variant="outline"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Regenerating...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Regenerate Summary
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  )
}
