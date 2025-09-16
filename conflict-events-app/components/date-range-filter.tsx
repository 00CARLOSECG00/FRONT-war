"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"

interface DateRangeFilterProps {
  from?: string
  to?: string
  onChange: (from: string, to: string) => void
}

export function DateRangeFilter({ from, to, onChange }: DateRangeFilterProps) {
  const [fromDate, setFromDate] = useState<Date | undefined>(from ? new Date(from) : undefined)
  const [toDate, setToDate] = useState<Date | undefined>(to ? new Date(to) : undefined)

  const handleFromChange = (date: Date | undefined) => {
    setFromDate(date)
    if (date) {
      onChange(date.toISOString().split("T")[0], to || new Date().toISOString().split("T")[0])
    }
  }

  const handleToChange = (date: Date | undefined) => {
    setToDate(date)
    if (date) {
      onChange(
        from || new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        date.toISOString().split("T")[0],
      )
    }
  }

  return (
    <div className="space-y-3">
      <div>
        <Label className="text-xs text-muted-foreground mb-1 block">From</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full justify-start text-left font-normal bg-transparent" size="sm">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {fromDate ? format(fromDate, "MMM dd, yyyy") : "Select date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar mode="single" selected={fromDate} onSelect={handleFromChange} initialFocus />
          </PopoverContent>
        </Popover>
      </div>

      <div>
        <Label className="text-xs text-muted-foreground mb-1 block">To</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full justify-start text-left font-normal bg-transparent" size="sm">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {toDate ? format(toDate, "MMM dd, yyyy") : "Select date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar mode="single" selected={toDate} onSelect={handleToChange} initialFocus />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  )
}
