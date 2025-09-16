"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RotateCcw, Filter } from "lucide-react"
import { FiltersPanel } from "@/components/filters-panel"
import { MapView } from "@/components/map-view"
import { BigQueryDashboard } from "@/components/bigquery-dashboard"
import { EventsTable } from "@/components/events-table"
import type { EventFilters, ConflictEvent, HeatCell } from "@/lib/types"
import { getEvents, getHeat } from "@/lib/api"
import { getDefaultDateRange } from "@/lib/utils/date"

function ExplorePageContent() {
  const searchParams = useSearchParams()
  const router = useRouter()

  // Initialize filters from URL or defaults
  const [filters, setFilters] = useState<EventFilters>(() => {
    const defaultRange = getDefaultDateRange()
    return {
      from: searchParams.get("from") || defaultRange.from,
      to: searchParams.get("to") || defaultRange.to,
      countries: searchParams.get("countries")?.split(",").filter(Boolean) || [],
      regions: searchParams.get("regions")?.split(",").filter(Boolean) || [],
      adm1: searchParams.get("adm1")?.split(",").filter(Boolean) || [],
      violenceTypes: searchParams.get("violenceTypes")?.split(",").map(Number).filter(Boolean) || [],
      sidesA: searchParams.get("sidesA")?.split(",").filter(Boolean) || [],
      sidesB: searchParams.get("sidesB")?.split(",").filter(Boolean) || [],
      minDeaths: searchParams.get("minDeaths") ? Number(searchParams.get("minDeaths")) : undefined,
      maxDeaths: searchParams.get("maxDeaths") ? Number(searchParams.get("maxDeaths")) : undefined,
      hasCivilians: searchParams.get("hasCivilians") === "true" ? true : undefined,
      clarityMin: searchParams.get("clarityMin") ? Number(searchParams.get("clarityMin")) : undefined,
      clarityMax: searchParams.get("clarityMax") ? Number(searchParams.get("clarityMax")) : undefined,
    }
  })

  const [events, setEvents] = useState<ConflictEvent[]>([])
  const [heatData, setHeatData] = useState<HeatCell[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showFilters, setShowFilters] = useState(true)

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams()

    if (filters.from) params.set("from", filters.from)
    if (filters.to) params.set("to", filters.to)
    if (filters.countries?.length) params.set("countries", filters.countries.join(","))
    if (filters.regions?.length) params.set("regions", filters.regions.join(","))
    if (filters.adm1?.length) params.set("adm1", filters.adm1.join(","))
    if (filters.violenceTypes?.length) params.set("violenceTypes", filters.violenceTypes.join(","))
    if (filters.sidesA?.length) params.set("sidesA", filters.sidesA.join(","))
    if (filters.sidesB?.length) params.set("sidesB", filters.sidesB.join(","))
    if (filters.minDeaths !== undefined) params.set("minDeaths", filters.minDeaths.toString())
    if (filters.maxDeaths !== undefined) params.set("maxDeaths", filters.maxDeaths.toString())
    if (filters.hasCivilians !== undefined) params.set("hasCivilians", filters.hasCivilians.toString())
    if (filters.clarityMin !== undefined) params.set("clarityMin", filters.clarityMin.toString())
    if (filters.clarityMax !== undefined) params.set("clarityMax", filters.clarityMax.toString())

    const newUrl = `${window.location.pathname}?${params.toString()}`
    window.history.replaceState({}, "", newUrl)
  }, [filters])

  // Fetch data when filters change (with debounce)
  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      try {
        setLoading(true)
        setError(null)

        // Fetch both events and heat data
        const [eventsResponse, heatResponse] = await Promise.all([
          getEvents(filters, 1, 1000), // Get more events for map display
          getHeat(filters),
        ])

        setEvents(eventsResponse.data)
        setHeatData(heatResponse)
      } catch (err) {
        setError("Failed to load data")
        console.error("Error fetching data:", err)
      } finally {
        setLoading(false)
      }
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [filters])

  const handleFiltersChange = (newFilters: EventFilters) => {
    setFilters(newFilters)
  }

  const handleResetFilters = () => {
    const defaultRange = getDefaultDateRange()
    setFilters({
      from: defaultRange.from,
      to: defaultRange.to,
    })
  }

  const handleResetView = () => {
    // This will be handled by the MapView component
    window.dispatchEvent(new CustomEvent("resetMapView"))
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="flex items-center justify-between p-4">
          <div>
            <h1 className="text-2xl font-bold">Explore Conflict Events</h1>
            <p className="text-sm text-muted-foreground">Interactive analysis powered by BigQuery and Power BI</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)} className="gap-2">
              <Filter className="h-4 w-4" />
              {showFilters ? "Hide" : "Show"} Filters
            </Button>
            <Button variant="outline" size="sm" onClick={handleResetView} className="gap-2 bg-transparent">
              <RotateCcw className="h-4 w-4" />
              Reset View
            </Button>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-120px)]">
        {/* Filters Panel */}
        {showFilters && (
          <div className="w-80 border-r bg-card overflow-y-auto">
            <FiltersPanel
              filters={filters}
              onFiltersChange={handleFiltersChange}
              onReset={handleResetFilters}
              loading={loading}
            />
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Map Section */}
          <div className="h-1/2 relative">
            <MapView events={events} heatData={heatData} loading={loading} error={error} />
          </div>

          {/* Data Visualization Tabs */}
          <div className="h-1/2 border-t">
            <Tabs defaultValue="analytics" className="h-full flex flex-col">
              <div className="border-b bg-muted/20">
                <TabsList className="h-12 w-full justify-start rounded-none bg-transparent p-0">
                  <TabsTrigger
                    value="analytics"
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
                  >
                    Analytics Dashboard
                  </TabsTrigger>
                  <TabsTrigger
                    value="table"
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
                  >
                    Events Table
                  </TabsTrigger>
                </TabsList>
              </div>

              <div className="flex-1 overflow-hidden">
                <TabsContent value="analytics" className="h-full m-0 p-4">
                  <BigQueryDashboard filters={filters} />
                </TabsContent>

                <TabsContent value="table" className="h-full m-0 p-4">
                  <EventsTable filters={filters} />
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ExplorePage() {
  return (
    <Suspense fallback={<ExplorePageSkeleton />}>
      <ExplorePageContent />
    </Suspense>
  )
}

function ExplorePageSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-card">
        <div className="flex items-center justify-between p-4">
          <div className="space-y-2">
            <div className="h-6 bg-muted rounded w-48" />
            <div className="h-4 bg-muted rounded w-64" />
          </div>
          <div className="flex gap-2">
            <div className="h-8 bg-muted rounded w-24" />
            <div className="h-8 bg-muted rounded w-24" />
          </div>
        </div>
      </div>
      <div className="flex h-[calc(100vh-120px)]">
        <div className="w-80 border-r bg-card p-4">
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-16 bg-muted rounded" />
            ))}
          </div>
        </div>
        <div className="flex-1 bg-muted animate-pulse" />
      </div>
    </div>
  )
}
