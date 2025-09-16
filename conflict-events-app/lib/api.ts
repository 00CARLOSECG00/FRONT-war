import type { ConflictEvent, Lookups, TimePoint, RegionAgg, HeatCell, EventFilters, PaginatedResponse } from "./types"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"

// Helper function to build query string from filters
function buildQueryString(filters: EventFilters, additionalParams?: Record<string, any>): string {
  const params = new URLSearchParams()

  if (filters.from) params.append("from", filters.from)
  if (filters.to) params.append("to", filters.to)
  if (filters.countries?.length) params.append("countries", filters.countries.join(","))
  if (filters.regions?.length) params.append("regions", filters.regions.join(","))
  if (filters.adm1?.length) params.append("adm1", filters.adm1.join(","))
  if (filters.violenceTypes?.length) params.append("violenceTypes", filters.violenceTypes.join(","))
  if (filters.sidesA?.length) params.append("sidesA", filters.sidesA.join(","))
  if (filters.sidesB?.length) params.append("sidesB", filters.sidesB.join(","))
  if (filters.minDeaths !== undefined) params.append("minDeaths", filters.minDeaths.toString())
  if (filters.maxDeaths !== undefined) params.append("maxDeaths", filters.maxDeaths.toString())
  if (filters.hasCivilians !== undefined) params.append("hasCivilians", filters.hasCivilians.toString())
  if (filters.clarityMin !== undefined) params.append("clarityMin", filters.clarityMin.toString())
  if (filters.clarityMax !== undefined) params.append("clarityMax", filters.clarityMax.toString())

  // Add additional parameters
  if (additionalParams) {
    Object.entries(additionalParams).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, value.toString())
      }
    })
  }

  return params.toString()
}

// API service functions
export async function getEvents(
  filters: EventFilters = {},
  page = 1,
  pageSize = 50,
): Promise<PaginatedResponse<ConflictEvent>> {
  const queryString = buildQueryString(filters, { page, pageSize })
  const response = await fetch(`${API_BASE_URL}/api/events?${queryString}`)

  if (!response.ok) {
    throw new Error(`Failed to fetch events: ${response.statusText}`)
  }

  return response.json()
}

export async function getEvent(id: string): Promise<ConflictEvent> {
  const response = await fetch(`${API_BASE_URL}/api/events/${id}`)

  if (!response.ok) {
    throw new Error(`Failed to fetch event: ${response.statusText}`)
  }

  return response.json()
}

export async function getLookups(): Promise<Lookups> {
  const response = await fetch(`${API_BASE_URL}/api/lookups`)

  if (!response.ok) {
    throw new Error(`Failed to fetch lookups: ${response.statusText}`)
  }

  return response.json()
}

export async function getSeries(filters: EventFilters = {}): Promise<TimePoint[]> {
  const queryString = buildQueryString(filters)
  const response = await fetch(`${API_BASE_URL}/api/stats/series?${queryString}`)

  if (!response.ok) {
    throw new Error(`Failed to fetch time series: ${response.statusText}`)
  }

  return response.json()
}

export async function getAggByRegion(filters: EventFilters = {}): Promise<RegionAgg[]> {
  const queryString = buildQueryString(filters)
  const response = await fetch(`${API_BASE_URL}/api/stats/by-region?${queryString}`)

  if (!response.ok) {
    throw new Error(`Failed to fetch region aggregates: ${response.statusText}`)
  }

  return response.json()
}

export async function getHeat(filters: EventFilters = {}): Promise<HeatCell[]> {
  const queryString = buildQueryString(filters)
  const response = await fetch(`${API_BASE_URL}/api/stats/heat?${queryString}`)

  if (!response.ok) {
    throw new Error(`Failed to fetch heat data: ${response.statusText}`)
  }

  return response.json()
}
