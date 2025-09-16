"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { Loader2, AlertTriangle, MapPin, TrendingUp, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react"
import type { EventFilters, RegionAgg } from "@/lib/types"
import { getAggByRegion } from "@/lib/api"
import { formatNumber } from "@/lib/utils/numbers"

interface RegionsViewProps {
  filters: EventFilters
}

type SortField = "key" | "events" | "deaths" | "civilians"
type SortDirection = "asc" | "desc"

export function RegionsView({ filters }: RegionsViewProps) {
  const [data, setData] = useState<RegionAgg[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [sortField, setSortField] = useState<SortField>("events")
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc")
  const [viewMode, setViewMode] = useState<"table" | "chart">("table")

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        setError(null)
        const regionData = await getAggByRegion(filters)
        setData(regionData)
      } catch (err) {
        setError("Failed to load regions data")
        console.error("Error fetching regions data:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [filters])

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("desc")
    }
  }

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="h-4 w-4" />
    }
    return sortDirection === "asc" ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />
  }

  // Sort data
  const sortedData = [...data].sort((a, b) => {
    const aValue = a[sortField]
    const bValue = b[sortField]

    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortDirection === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
    }

    return sortDirection === "asc" ? (aValue as number) - (bValue as number) : (bValue as number) - (aValue as number)
  })

  // Calculate totals
  const totals = data.reduce(
    (acc, region) => ({
      events: acc.events + region.events,
      deaths: acc.deaths + region.deaths,
      civilians: acc.civilians + region.civilians,
    }),
    { events: 0, deaths: 0, civilians: 0 },
  )

  // Prepare chart data (top 10 regions by events)
  const chartData = sortedData.slice(0, 10).map((region) => ({
    ...region,
    name: region.key.length > 15 ? region.key.substring(0, 15) + "..." : region.key,
  }))

  // Colors for pie chart
  const COLORS = [
    "hsl(var(--chart-1))",
    "hsl(var(--chart-2))",
    "hsl(var(--chart-3))",
    "hsl(var(--chart-4))",
    "hsl(var(--chart-5))",
  ]

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

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading regions data...
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="h-full flex items-center justify-center">
        <Card className="p-6 max-w-md">
          <div className="text-center space-y-4">
            <div className="text-destructive">Failed to load regions</div>
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
            <div>No regional data available</div>
            <p className="text-sm text-muted-foreground">Try adjusting your filters to see regional data.</p>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col space-y-4">
      {/* Header with summary and view toggle */}
      <div className="flex items-center justify-between">
        <div className="grid grid-cols-3 gap-4">
          <Card className="p-3">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <div>
                <div className="text-lg font-bold">{data.length}</div>
                <div className="text-xs text-muted-foreground">Regions</div>
              </div>
            </div>
          </Card>

          <Card className="p-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
              <div>
                <div className="text-lg font-bold">{formatNumber(totals.events)}</div>
                <div className="text-xs text-muted-foreground">Total Events</div>
              </div>
            </div>
          </Card>

          <Card className="p-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              <div>
                <div className="text-lg font-bold">{formatNumber(totals.deaths)}</div>
                <div className="text-xs text-muted-foreground">Total Deaths</div>
              </div>
            </div>
          </Card>
        </div>

        <div className="flex gap-2">
          <Button variant={viewMode === "table" ? "default" : "outline"} size="sm" onClick={() => setViewMode("table")}>
            Table
          </Button>
          <Button variant={viewMode === "chart" ? "default" : "outline"} size="sm" onClick={() => setViewMode("chart")}>
            Chart
          </Button>
        </div>
      </div>

      {/* Content */}
      {viewMode === "table" ? (
        <Card className="flex-1">
          <CardHeader>
            <CardTitle className="text-lg">Regional Breakdown</CardTitle>
            <CardDescription>Conflict events and casualties by country/region</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-auto max-h-[400px]">
              <Table>
                <TableHeader className="sticky top-0 bg-muted/50">
                  <TableRow>
                    <TableHead>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 p-0 font-semibold"
                        onClick={() => handleSort("key")}
                      >
                        Region
                        {getSortIcon("key")}
                      </Button>
                    </TableHead>
                    <TableHead className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 p-0 font-semibold"
                        onClick={() => handleSort("events")}
                      >
                        Events
                        {getSortIcon("events")}
                      </Button>
                    </TableHead>
                    <TableHead className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 p-0 font-semibold"
                        onClick={() => handleSort("deaths")}
                      >
                        Deaths
                        {getSortIcon("deaths")}
                      </Button>
                    </TableHead>
                    <TableHead className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 p-0 font-semibold"
                        onClick={() => handleSort("civilians")}
                      >
                        Civilians
                        {getSortIcon("civilians")}
                      </Button>
                    </TableHead>
                    <TableHead className="text-right">Civilian %</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedData.map((region) => {
                    const civilianPercentage =
                      region.deaths > 0 ? Math.round((region.civilians / region.deaths) * 100) : 0

                    return (
                      <TableRow key={region.key} className="hover:bg-muted/50">
                        <TableCell className="font-medium">{region.key}</TableCell>
                        <TableCell className="text-right font-mono">{formatNumber(region.events)}</TableCell>
                        <TableCell className="text-right font-mono">{formatNumber(region.deaths)}</TableCell>
                        <TableCell className="text-right font-mono">
                          {region.civilians > 0 ? (
                            <span className="text-destructive font-medium">{formatNumber(region.civilians)}</span>
                          ) : (
                            <span className="text-muted-foreground">0</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          {civilianPercentage > 0 ? (
                            <Badge variant={civilianPercentage > 50 ? "destructive" : "secondary"} className="text-xs">
                              {civilianPercentage}%
                            </Badge>
                          ) : (
                            <span className="text-muted-foreground text-xs">0%</span>
                          )}
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="flex-1 grid grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Top Regions by Events</CardTitle>
              <CardDescription>Most active conflict regions</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis
                    dataKey="name"
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    angle={-45}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => formatNumber(value)}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="events" fill="hsl(var(--chart-1))" name="Events" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Deaths Distribution</CardTitle>
              <CardDescription>Top 5 regions by casualties</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData.slice(0, 5)}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="deaths"
                    nameKey="key"
                    label={({ key, percent }) =>
                      `${key.length > 10 ? key.substring(0, 10) + "..." : key} ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {chartData.slice(0, 5).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: any, name: any) => [formatNumber(value), "Deaths"]}
                    labelFormatter={(label: any) => `Region: ${label}`}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
