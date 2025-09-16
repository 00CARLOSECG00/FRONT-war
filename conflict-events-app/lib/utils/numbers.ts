// Number utility functions for safe parsing and formatting

export function safeParseFloat(value: any, fallback = 0): number {
  const parsed = Number.parseFloat(value)
  return isNaN(parsed) ? fallback : parsed
}

export function safeParseInt(value: any, fallback = 0): number {
  const parsed = Number.parseInt(value)
  return isNaN(parsed) ? fallback : parsed
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat("en-US").format(num)
}

export function formatDeaths(deaths: number): string {
  if (deaths === 0) return "No casualties"
  if (deaths === 1) return "1 casualty"
  return `${formatNumber(deaths)} casualties`
}
