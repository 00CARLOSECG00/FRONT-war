"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Search,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ExternalLink,
  Loader2,
  AlertTriangle,
} from "lucide-react"
import type { EventFilters, ConflictEvent, PaginatedResponse } from "@/lib/types"
import { getEvents } from "@/lib/api"
import { formatDate } from "@/lib/utils/date"
import { formatNumber } from "@/lib/utils/numbers"
import Link from "next/link"

interface EventsTableProps {
  filters: EventFilters
}

type SortField = "date_start" | "country" | "adm_1" | "type_of_violence" | "best" | "deaths_civilians"
type SortDirection = "asc" | "desc"

export function EventsTable({ filters }: EventsTableProps) {
  const [data, setData] = useState<PaginatedResponse<ConflictEvent> | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [pageSize] = useState(25)
  const [sortField, setSortField] = useState<SortField>("date_start")
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc")
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        setError(null)

        // Add search and sort to filters
        const searchFilters = { ...filters }
        if (searchTerm) {
          // This would need to be implemented in the API
          // For now, we'll filter client-side after fetching
        }

        const response = await getEvents(searchFilters, page, pageSize)

        // Client-side search filtering (ideally this would be server-side)
        if (searchTerm) {
          const filteredData = response.data.filter(
            (event) =>
              event.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
              event.adm_1.toLowerCase().includes(searchTerm.toLowerCase()) ||
              event.side_a.toLowerCase().includes(searchTerm.toLowerCase()) ||
              event.side_b.toLowerCase().includes(searchTerm.toLowerCase()) ||
              event.conflict_name.toLowerCase().includes(searchTerm.toLowerCase()),
          )

          setData({
            ...response,
            data: filteredData,
            total: filteredData.length,
          })
        } else {
          setData(response)
        }
      } catch (err) {
        setError("Failed to load events data")
        console.error("Error fetching events data:", err)
      } finally {
        setLoading(false)
      }
    }

    const timeoutId = setTimeout(fetchData, 300) // Debounce
    return () => clearTimeout(timeoutId)
  }, [filters, page, pageSize, sortField, sortDirection, searchTerm])

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("desc")
    }
    setPage(1) // Reset to first page when sorting
  }

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="h-4 w-4" />
    }
    return sortDirection === "asc" ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />
  }

  const getViolenceTypeLabel = (type: number) => {
    switch (type) {
      case 1:
        return "State-based"
      case 2:
        return "Non-state"
      case 3:
        return "One-sided"
      default:
        return `Type ${type}`
    }
  }

  const getViolenceTypeBadge = (type: number) => {
    switch (type) {
      case 1:
        return "destructive"
      case 2:
        return "secondary"
      case 3:
        return "outline"
      default:
        return "outline"
    }
  }

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading events data...
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="h-full flex items-center justify-center">
        <Card className="p-6 max-w-md">
          <div className="text-center space-y-4">
            <div className="text-destructive">Failed to load events</div>
            <p className="text-sm text-muted-foreground">{error}</p>
          </div>
        </Card>
      </div>
    )
  }

  if (!data || data.data.length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <Card className="p-6 max-w-md">
          <div className="text-center space-y-4">
            <AlertTriangle className="h-8 w-8 text-muted-foreground mx-auto" />
            <div>No events found</div>
            <p className="text-sm text-muted-foreground">Try adjusting your filters to see events data.</p>
          </div>
        </Card>
      </div>
    )
  }

  const totalPages = Math.ceil(data.total / pageSize)

  return (
    <div className="h-full flex flex-col space-y-4">
      {/* Header with search */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Conflict Events</h3>
          <p className="text-sm text-muted-foreground">{formatNumber(data.total)} events found</p>
        </div>

        <div className="relative w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search events..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      {/* Table */}
      <Card className="flex-1">
        <CardContent className="p-0">
          <div className="overflow-auto max-h-[400px]">
            <Table>
              <TableHeader className="sticky top-0 bg-muted/50">
                <TableRow>
                  <TableHead className="w-[100px]">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 p-0 font-semibold"
                      onClick={() => handleSort("date_start")}
                    >
                      Date
                      {getSortIcon("date_start")}
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 p-0 font-semibold"
                      onClick={() => handleSort("country")}
                    >
                      Location
                      {getSortIcon("country")}
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 p-0 font-semibold"
                      onClick={() => handleSort("type_of_violence")}
                    >
                      Type
                      {getSortIcon("type_of_violence")}
                    </Button>
                  </TableHead>
                  <TableHead>Actors</TableHead>
                  <TableHead className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 p-0 font-semibold"
                      onClick={() => handleSort("best")}
                    >
                      Deaths
                      {getSortIcon("best")}
                    </Button>
                  </TableHead>
                  <TableHead className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 p-0 font-semibold"
                      onClick={() => handleSort("deaths_civilians")}
                    >
                      Civilians
                      {getSortIcon("deaths_civilians")}
                    </Button>
                  </TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.data.map((event) => (
                  <TableRow key={event.id} className="hover:bg-muted/50">
                    <TableCell className="font-mono text-xs">{formatDate(event.date_start)}</TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium">{event.country}</div>
                        <div className="text-xs text-muted-foreground">{event.adm_1}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getViolenceTypeBadge(event.type_of_violence) as any}>
                        {getViolenceTypeLabel(event.type_of_violence)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1 max-w-[200px]">
                        <div className="text-sm truncate" title={event.side_a}>
                          {event.side_a}
                        </div>
                        <div className="text-xs text-muted-foreground">vs</div>
                        <div className="text-sm truncate" title={event.side_b}>
                          {event.side_b}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-mono">{formatNumber(event.best)}</TableCell>
                    <TableCell className="text-right font-mono">
                      {event.deaths_civilians > 0 ? (
                        <span className="text-destructive font-medium">{formatNumber(event.deaths_civilians)}</span>
                      ) : (
                        <span className="text-muted-foreground">0</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Link href={`/event/${event.id}`}>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <ExternalLink className="h-3 w-3" />
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Showing {(page - 1) * pageSize + 1} to {Math.min(page * pageSize, data.total)} of {formatNumber(data.total)}{" "}
          events
        </div>

        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={() => setPage(1)} disabled={page === 1}>
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={() => setPage(page - 1)} disabled={page === 1}>
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <div className="flex items-center space-x-1">
            <span className="text-sm">Page</span>
            <span className="text-sm font-medium">{page}</span>
            <span className="text-sm">of</span>
            <span className="text-sm font-medium">{totalPages}</span>
          </div>

          <Button variant="outline" size="sm" onClick={() => setPage(page + 1)} disabled={page === totalPages}>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={() => setPage(totalPages)} disabled={page === totalPages}>
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
