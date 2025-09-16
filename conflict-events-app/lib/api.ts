import type { ConflictEvent, Lookups, TimePoint, RegionAgg, HeatCell, EventFilters, PaginatedResponse } from "./types"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"

// Demo data for when API is not available
const DEMO_TIME_SERIES: TimePoint[] = [
  { period: "2024-01", events: 45, deaths: 234, civilians: 67 },
  { period: "2024-02", events: 52, deaths: 289, civilians: 89 },
  { period: "2024-03", events: 38, deaths: 198, civilians: 45 },
  { period: "2024-04", events: 61, deaths: 345, civilians: 123 },
  { period: "2024-05", events: 47, deaths: 267, civilians: 78 },
  { period: "2024-06", events: 55, deaths: 312, civilians: 94 },
  { period: "2024-07", events: 42, deaths: 223, civilians: 56 },
  { period: "2024-08", events: 58, deaths: 334, civilians: 112 },
  { period: "2024-09", events: 49, deaths: 278, civilians: 83 },
  { period: "2024-10", events: 53, deaths: 298, civilians: 91 },
  { period: "2024-11", events: 46, deaths: 245, civilians: 69 },
  { period: "2024-12", events: 51, deaths: 287, civilians: 87 },
]

const DEMO_EVENTS: ConflictEvent[] = [
  {
    id: "demo-1",
    conflict_name: "Demo Conflict A",
    date_start: "2024-12-01",
    date_end: "2024-12-01",
    country: "Demo Country",
    adm_1: "Demo Region",
    latitude: 40.7128,
    longitude: -74.006,
    type_of_violence: 1,
    side_a: "Government Forces",
    side_b: "Armed Group Alpha",
    best: 15,
    low: 10,
    high: 20,
    deaths_civilians: 3,
    gwnoa: 1,
    gwnob: 2,
    clarity_of_location: 1,
  },
  {
    id: "demo-2",
    conflict_name: "Demo Conflict B",
    date_start: "2024-12-02",
    date_end: "2024-12-02",
    country: "Demo Country",
    adm_1: "Demo Region",
    latitude: 51.5074,
    longitude: -0.1278,
    type_of_violence: 2,
    side_a: "Militia Group Beta",
    side_b: "Local Forces",
    best: 8,
    low: 5,
    high: 12,
    deaths_civilians: 2,
    gwnoa: 3,
    gwnob: 4,
    clarity_of_location: 2,
  },
]

const DEMO_HEAT_DATA: HeatCell[] = [
  { lat: 40.7128, lng: -74.006, count: 15 },
  { lat: 51.5074, lng: -0.1278, count: 8 },
  { lat: 48.8566, lng: 2.3522, count: 12 },
  { lat: 35.6762, lng: 139.6503, count: 6 },
  { lat: -33.8688, lng: 151.2093, count: 9 },
]

const DEMO_REGION_AGG: RegionAgg[] = [
  { region: "Demo Region A", events: 45, deaths: 234, civilians: 67 },
  { region: "Demo Region B", events: 38, deaths: 198, civilians: 45 },
  { region: "Demo Region C", events: 52, deaths: 289, civilians: 89 },
]

const DEMO_LOOKUPS: Lookups = {
  countries: ["Demo Country A", "Demo Country B", "Demo Country C"],
  regions: ["Demo Region A", "Demo Region B", "Demo Region C"],
  adm1: ["Demo Admin 1", "Demo Admin 2", "Demo Admin 3"],
  violenceTypes: [
    { id: 1, name: "State-based violence" },
    { id: 2, name: "Non-state violence" },
    { id: 3, name: "One-sided violence" },
  ],
  sidesA: ["Government Forces", "Militia Group Alpha", "Armed Group Beta"],
  sidesB: ["Armed Group Alpha", "Local Forces", "Rebel Group Gamma"],
}

// Helper function to check if API is available
async function isApiAvailable(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/health`, {
      method: "HEAD",
      signal: AbortSignal.timeout(5000), // 5 second timeout
    })
    return response.ok
  } catch {
    return false
  }
}

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

// API service functions with fallback to demo data
export async function getEvents(
  filters: EventFilters = {},
  page = 1,
  pageSize = 50,
): Promise<PaginatedResponse<ConflictEvent>> {
  try {
    const queryString = buildQueryString(filters, { page, pageSize })
    const response = await fetch(`${API_BASE_URL}/api/events?${queryString}`, {
      signal: AbortSignal.timeout(10000), // 10 second timeout
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch events: ${response.statusText}`)
    }

    return response.json()
  } catch (error) {
    console.warn("API not available, using demo data:", error)
    // Return demo data with pagination structure
    return {
      data: DEMO_EVENTS,
      total: DEMO_EVENTS.length,
      page,
      pageSize,
      totalPages: 1,
    }
  }
}

export async function getEvent(id: string): Promise<ConflictEvent> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/events/${id}`, {
      signal: AbortSignal.timeout(10000),
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch event: ${response.statusText}`)
    }

    return response.json()
  } catch (error) {
    console.warn("API not available, using demo data:", error)
    // Return first demo event or create one with the requested ID
    return DEMO_EVENTS[0] || { ...DEMO_EVENTS[0], id }
  }
}

export async function getLookups(): Promise<Lookups> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/lookups`, {
      signal: AbortSignal.timeout(10000),
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch lookups: ${response.statusText}`)
    }

    return response.json()
  } catch (error) {
    console.warn("API not available, using demo data:", error)
    return DEMO_LOOKUPS
  }
}

export async function getSeries(filters: EventFilters = {}): Promise<TimePoint[]> {
  try {
    const queryString = buildQueryString(filters)
    const response = await fetch(`${API_BASE_URL}/api/stats/series?${queryString}`, {
      signal: AbortSignal.timeout(10000),
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch time series: ${response.statusText}`)
    }

    return response.json()
  } catch (error) {
    console.warn("API not available, using demo data:", error)
    return DEMO_TIME_SERIES
  }
}

export async function getAggByRegion(filters: EventFilters = {}): Promise<RegionAgg[]> {
  try {
    const queryString = buildQueryString(filters)
    const response = await fetch(`${API_BASE_URL}/api/stats/by-region?${queryString}`, {
      signal: AbortSignal.timeout(10000),
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch region aggregates: ${response.statusText}`)
    }

    return response.json()
  } catch (error) {
    console.warn("API not available, using demo data:", error)
    return DEMO_REGION_AGG
  }
}

export async function getHeat(filters: EventFilters = {}): Promise<HeatCell[]> {
  try {
    const queryString = buildQueryString(filters)
    const response = await fetch(`${API_BASE_URL}/api/stats/heat?${queryString}`, {
      signal: AbortSignal.timeout(10000),
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch heat data: ${response.statusText}`)
    }

    return response.json()
  } catch (error) {
    console.warn("API not available, using demo data:", error)
    return DEMO_HEAT_DATA
  }
}
