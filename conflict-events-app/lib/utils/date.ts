// Date utility functions for the conflict events application

export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  } catch {
    return dateString
  }
}

export function getDefaultDateRange(): { from: string; to: string } {
  const to = new Date()
  const from = new Date()
  from.setFullYear(from.getFullYear() - 1) // Default to last 12 months

  return {
    from: from.toISOString().split("T")[0],
    to: to.toISOString().split("T")[0],
  }
}

export function formatPeriod(period: string): string {
  // Assuming period format is YYYY-MM
  try {
    const [year, month] = period.split("-")
    const date = new Date(Number.parseInt(year), Number.parseInt(month) - 1)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
    })
  } catch {
    return period
  }
}
