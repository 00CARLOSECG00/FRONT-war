"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, TrendingUp, Users, AlertTriangle } from "lucide-react"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import type { EventFilters, TimePoint } from "@/lib/types"
import { getSeries } from "@/lib/api"
import { formatPeriod } from "@/lib/utils/date"
import { formatNumber } from "@/lib/utils/numbers"

interface TimelineChartProps {
  filters: EventFilters
}

export function TimelineChart({ filters }: TimelineChartProps) {
  const [data, setData] = useState<TimePoint[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        setError(null)
        const seriesData = await getSeries(filters)
        setData(seriesData)
      } catch (err) {
        setError("Failed to load timeline data")
        console.error("Error fetching timeline data:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [filters])

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading timeline data...
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="h-full flex items-center justify-center">
        <Card className="p-6 max-w-md">
          <div className="text-center space-y-4">
            <div className="text-destructive">Failed to load timeline</div>
            <p className="text-sm text-muted-foreground">{error}</p>
          </div>
        </Card>
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <Card className="p-6 max-w-md">
          <div className="text-center space-y-4">
            <AlertTriangle className="h-8 w-8 text-muted-foreground mx-auto" />
            <div>No timeline data available</div>
            <p className="text-sm text-muted-foreground">Try adjusting your filters to see timeline data.</p>
          </div>
        </Card>
      </div>
    )
  }

  // Calculate totals for summary cards
  const totals = data.reduce(
    (acc, point) => ({
      events: acc.events + point.events,
      deaths: acc.deaths + point.deaths,
      civilians: acc.civilians + point.civilians,
    }),
    { events: 0, deaths: 0, civilians: 0 },
  )

  // Format data for chart
  const chartData = data.map((point) => ({
    ...point,
    period: formatPeriod(point.period),
    formattedPeriod: point.period,
  }))

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-lg">
          <p className="font-medium mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {formatNumber(entry.value)}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <div className="h-full flex flex-col space-y-4">
      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Events</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(totals.events)}</div>
            <p className="text-xs text-muted-foreground">Across {data.length} time periods</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Deaths</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(totals.deaths)}</div>
            <p className="text-xs text-muted-foreground">All reported casualties</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Civilian Deaths</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(totals.civilians)}</div>
            <p className="text-xs text-muted-foreground">
              {totals.deaths > 0 ? `${Math.round((totals.civilians / totals.deaths) * 100)}% of total` : "No data"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Timeline Chart */}
      <Card className="flex-1">
        <CardHeader>
          <CardTitle className="text-lg">Conflict Events Timeline</CardTitle>
          <CardDescription>Monthly breakdown of events, total deaths, and civilian casualties</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorEvents" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0.1} />
                </linearGradient>
                <linearGradient id="colorDeaths" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0.1} />
                </linearGradient>
                <linearGradient id="colorCivilians" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--destructive))" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="hsl(var(--destructive))" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis
                dataKey="period"
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => formatNumber(value)}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Area
                type="monotone"
                dataKey="events"
                stroke="hsl(var(--chart-1))"
                fillOpacity={1}
                fill="url(#colorEvents)"
                name="Events"
              />
              <Area
                type="monotone"
                dataKey="deaths"
                stroke="hsl(var(--chart-2))"
                fillOpacity={1}
                fill="url(#colorDeaths)"
                name="Total Deaths"
              />
              <Area
                type="monotone"
                dataKey="civilians"
                stroke="hsl(var(--destructive))"
                fillOpacity={1}
                fill="url(#colorCivilians)"
                name="Civilian Deaths"
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
