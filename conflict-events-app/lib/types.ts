// Core data models for conflict events application

export interface ConflictEvent {
  id: string
  relid: string
  year: number
  active_year: boolean
  code_status: string
  type_of_violence: number
  conflict_dset_id: number
  conflict_new_id: number
  conflict_name: string
  dyad_dset_id: number
  dyad_new_id: number
  dyad_name: string
  side_a_dset_id: number
  side_a_new_id: number
  side_a: string
  side_b_dset_id: number
  side_b_new_id: number
  side_b: string
  number_of_sources: number
  source_article: string
  source_office: string
  source_date: string
  source_headline: string
  source_original: string
  where_prec: number
  where_coordinates: string
  where_description: string
  adm_1: string
  adm_2: string
  latitude: number
  longitude: number
  priogrid_gid: number
  country: string
  country_id: number
  region: string
  event_clarity: number
  date_prec: number
  date_start: string
  date_end: string
  deaths_a: number
  deaths_b: number
  deaths_civilians: number
  deaths_unknown: number
  best: number
  high: number
  low: number
  gwnoa: number
  gwnob: number
}

export interface Lookups {
  countries: string[]
  regions: string[]
  years: number[]
  sidesA: string[]
  sidesB: string[]
  violenceTypes: number[]
}

export interface TimePoint {
  period: string
  events: number
  deaths: number
  civilians: number
}

export interface RegionAgg {
  key: string
  events: number
  deaths: number
  civilians: number
}

export interface HeatCell {
  geohash6: string
  lat: number
  lng: number
  count: number
}

export interface EventFilters {
  from?: string // YYYY-MM-DD
  to?: string // YYYY-MM-DD
  countries?: string[] // CSV in API
  regions?: string[] // CSV in API
  adm1?: string[] // CSV in API
  violenceTypes?: number[] // CSV in API
  sidesA?: string[] // CSV in API
  sidesB?: string[] // CSV in API
  minDeaths?: number
  maxDeaths?: number
  hasCivilians?: boolean
  clarityMin?: number
  clarityMax?: number
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}
