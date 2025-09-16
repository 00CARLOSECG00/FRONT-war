"use client"

import { useEffect, useRef, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, RefreshCw, Maximize2 } from "lucide-react"

interface PowerBIDashboardProps {
  reportId: string
  title: string
  description?: string
  height?: number
  filters?: Record<string, any>
}

export function PowerBIDashboard({ reportId, title, description, height = 600, filters = {} }: PowerBIDashboardProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)

  // Power BI embed URL construction
  const embedUrl = `https://app.powerbi.com/reportEmbed?reportId=${reportId}&autoAuth=true&ctid=${process.env.NEXT_PUBLIC_POWERBI_TENANT_ID}`

  useEffect(() => {
    const iframe = iframeRef.current
    if (!iframe) return

    const handleLoad = () => {
      setLoading(false)
      setError(null)
    }

    const handleError = () => {
      setLoading(false)
      setError("Failed to load Power BI dashboard")
    }

    iframe.addEventListener("load", handleLoad)
    iframe.addEventListener("error", handleError)

    return () => {
      iframe.removeEventListener("load", handleLoad)
      iframe.removeEventListener("error", handleError)
    }
  }, [])

  const handleRefresh = () => {
    if (iframeRef.current) {
      setLoading(true)
      setError(null)
      iframeRef.current.src = embedUrl
    }
  }

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  if (error) {
    return (
      <Card className="p-6">
        <div className="text-center space-y-4">
          <div className="text-destructive font-medium">Error loading dashboard</div>
          <p className="text-sm text-muted-foreground">{error}</p>
          <Button onClick={handleRefresh} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </div>
      </Card>
    )
  }

  return (
    <Card className={`${isFullscreen ? "fixed inset-4 z-50" : ""}`}>
      <div className="p-4 border-b flex items-center justify-between">
        <div>
          <h3 className="font-semibold">{title}</h3>
          {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={handleRefresh} variant="ghost" size="sm" disabled={loading}>
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
          <Button onClick={toggleFullscreen} variant="ghost" size="sm">
            <Maximize2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="relative" style={{ height: `${height}px` }}>
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-muted/20">
            <div className="flex items-center gap-2 text-sm">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading dashboard...
            </div>
          </div>
        )}

        <iframe ref={iframeRef} src={embedUrl} className="w-full h-full border-0" allowFullScreen title={title} />
      </div>
    </Card>
  )
}
