"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { RotateCcw, Calendar, MapPin, Users, Target } from "lucide-react"
import { DateRangeFilter } from "@/components/date-range-filter"
import { MultiSelect } from "@/components/multi-select"
import { NumberRange } from "@/components/number-range"
import type { EventFilters, Lookups } from "@/lib/types"
import { getLookups } from "@/lib/api"

interface FiltersPanelProps {
  filters: EventFilters
  onFiltersChange: (filters: EventFilters) => void
  onReset: () => void
  loading?: boolean
}

export function FiltersPanel({ filters, onFiltersChange, onReset, loading }: FiltersPanelProps) {
  const [lookups, setLookups] = useState<Lookups | null>(null)
  const [lookupsLoading, setLookupsLoading] = useState(true)

  useEffect(() => {
    async function fetchLookups() {
      try {
        const data = await getLookups()
        setLookups(data)
      } catch (error) {
        console.error("Failed to fetch lookups:", error)
      } finally {
        setLookupsLoading(false)
      }
    }

    fetchLookups()
  }, [])

  const handleFilterChange = (key: keyof EventFilters, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    })
  }

  const handleDateRangeChange = (from: string, to: string) => {
    onFiltersChange({
      ...filters,
      from,
      to,
    })
  }

  const handleDeathsRangeChange = (min: number | undefined, max: number | undefined) => {
    onFiltersChange({
      ...filters,
      minDeaths: min,
      maxDeaths: max,
    })
  }

  const handleClarityRangeChange = (min: number | undefined, max: number | undefined) => {
    onFiltersChange({
      ...filters,
      clarityMin: min,
      clarityMax: max,
    })
  }

  if (lookupsLoading) {
    return (
      <div className="p-4 space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="pb-3">
              <div className="h-4 bg-muted rounded w-3/4" />
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-muted rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Filters</h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={onReset}
          className="gap-2 text-muted-foreground hover:text-foreground"
        >
          <RotateCcw className="h-3 w-3" />
          Reset
        </Button>
      </div>

      {/* Date Range */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Date Range
          </CardTitle>
        </CardHeader>
        <CardContent>
          <DateRangeFilter from={filters.from} to={filters.to} onChange={handleDateRangeChange} />
        </CardContent>
      </Card>

      {/* Geographic Filters */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Geographic
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-xs text-muted-foreground mb-2 block">Countries</Label>
            <MultiSelect
              options={lookups?.countries || []}
              selected={filters.countries || []}
              onChange={(value) => handleFilterChange("countries", value)}
              placeholder="Select countries..."
            />
          </div>

          <div>
            <Label className="text-xs text-muted-foreground mb-2 block">Regions</Label>
            <MultiSelect
              options={lookups?.regions || []}
              selected={filters.regions || []}
              onChange={(value) => handleFilterChange("regions", value)}
              placeholder="Select regions..."
            />
          </div>

          <div>
            <Label className="text-xs text-muted-foreground mb-2 block">Administrative Level 1</Label>
            <MultiSelect
              options={[]} // This would be populated based on selected countries
              selected={filters.adm1 || []}
              onChange={(value) => handleFilterChange("adm1", value)}
              placeholder="Select ADM1..."
              disabled={!filters.countries?.length}
            />
          </div>
        </CardContent>
      </Card>

      {/* Conflict Type */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Target className="h-4 w-4" />
            Violence Type
          </CardTitle>
        </CardHeader>
        <CardContent>
          <MultiSelect
            options={
              lookups?.violenceTypes?.map((type) => ({
                label: `Type ${type}`,
                value: type.toString(),
              })) || []
            }
            selected={filters.violenceTypes?.map(String) || []}
            onChange={(value) => handleFilterChange("violenceTypes", value.map(Number))}
            placeholder="Select violence types..."
          />
        </CardContent>
      </Card>

      {/* Actors */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Users className="h-4 w-4" />
            Conflict Actors
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-xs text-muted-foreground mb-2 block">Side A</Label>
            <MultiSelect
              options={lookups?.sidesA || []}
              selected={filters.sidesA || []}
              onChange={(value) => handleFilterChange("sidesA", value)}
              placeholder="Select Side A actors..."
            />
          </div>

          <div>
            <Label className="text-xs text-muted-foreground mb-2 block">Side B</Label>
            <MultiSelect
              options={lookups?.sidesB || []}
              selected={filters.sidesB || []}
              onChange={(value) => handleFilterChange("sidesB", value)}
              placeholder="Select Side B actors..."
            />
          </div>
        </CardContent>
      </Card>

      {/* Casualties */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Casualties</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <NumberRange
            label="Deaths Range"
            min={filters.minDeaths}
            max={filters.maxDeaths}
            onChange={handleDeathsRangeChange}
            step={1}
            minValue={0}
            maxValue={10000}
          />

          <div className="flex items-center justify-between">
            <Label htmlFor="civilians-toggle" className="text-sm">
              Only events with civilian casualties
            </Label>
            <Switch
              id="civilians-toggle"
              checked={filters.hasCivilians || false}
              onCheckedChange={(checked) => handleFilterChange("hasCivilians", checked || undefined)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Event Clarity */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Event Clarity</CardTitle>
        </CardHeader>
        <CardContent>
          <NumberRange
            label="Clarity Range"
            min={filters.clarityMin}
            max={filters.clarityMax}
            onChange={handleClarityRangeChange}
            step={1}
            minValue={1}
            maxValue={3}
          />
        </CardContent>
      </Card>

      {loading && (
        <div className="text-center py-4">
          <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
            <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            Loading data...
          </div>
        </div>
      )}
    </div>
  )
}
