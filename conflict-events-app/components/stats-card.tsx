"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, Users, Globe, AlertCircle } from "lucide-react"
import { getSeries } from "@/lib/api"
import { formatNumber } from "@/lib/utils/numbers"

export function StatsCard() {
  const [stats, setStats] = useState<{
    totalEvents: number
    totalDeaths: number
    totalCivilians: number
  } | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchStats() {
      try {
        setLoading(true)
        setError(null)

        // Check if API URL is configured
        if (!process.env.NEXT_PUBLIC_API_URL) {
          throw new Error("API URL not configured")
        }

        // Get last 30 days data
        const thirtyDaysAgo = new Date()
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

        const filters = {
          from: thirtyDaysAgo.toISOString().split("T")[0],
          to: new Date().toISOString().split("T")[0],
        }

        const seriesData = await getSeries(filters)

        // Aggregate the data
        const totals = seriesData.reduce(
          (acc, point) => ({
            totalEvents: acc.totalEvents + point.events,
            totalDeaths: acc.totalDeaths + point.deaths,
            totalCivilians: acc.totalCivilians + point.civilians,
          }),
          { totalEvents: 0, totalDeaths: 0, totalCivilians: 0 },
        )

        setStats(totals)
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to load statistics"
        setError(errorMessage)
        console.error("Error fetching stats:", err)

        if (errorMessage.includes("API URL not configured") || errorMessage.includes("Failed to fetch")) {
          setStats({
            totalEvents: 1247,
            totalDeaths: 8934,
            totalCivilians: 2156,
          })
        }
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (loading) {
    return <StatsCardSkeleton />
  }

  const isDemo = error && (error.includes("API URL not configured") || error.includes("Failed to fetch"))

  if (error && !isDemo) {
    return (
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="border-destructive/50 col-span-full">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-4 w-4" />
              <p className="text-sm">Unable to load statistics: {error}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!stats) {
    return <StatsCardSkeleton />
  }

  return (
    <div className="space-y-4">
      {isDemo && (
        <Card className="border-yellow-500/50 bg-yellow-50/50 dark:bg-yellow-950/20">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 text-yellow-700 dark:text-yellow-400">
              <AlertCircle className="h-4 w-4" />
              <p className="text-sm">
                Showing demo data. Configure{" "}
                <code className="bg-yellow-100 dark:bg-yellow-900 px-1 rounded">NEXT_PUBLIC_API_URL</code> in Project
                Settings to load real data.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Events (30 days)</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(stats.totalEvents)}</div>
            <p className="text-xs text-muted-foreground">Recorded conflict events</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Casualties</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(stats.totalDeaths)}</div>
            <p className="text-xs text-muted-foreground">All reported casualties</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Civilian Casualties</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(stats.totalCivilians)}</div>
            <p className="text-xs text-muted-foreground">Civilian casualties reported</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function StatsCardSkeleton() {
  return (
    <div className="grid md:grid-cols-3 gap-6">
      {[1, 2, 3].map((i) => (
        <Card key={i} className="animate-pulse">
          <CardHeader className="pb-3">
            <div className="h-4 bg-muted rounded w-3/4" />
          </CardHeader>
          <CardContent>
            <div className="h-8 bg-muted rounded w-1/2 mb-2" />
            <div className="h-3 bg-muted rounded w-full" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
