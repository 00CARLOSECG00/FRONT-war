"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Check, ChevronDown, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface MultiSelectProps {
  options: string[] | { label: string; value: string }[]
  selected: string[]
  onChange: (selected: string[]) => void
  placeholder?: string
  disabled?: boolean
}

export function MultiSelect({
  options,
  selected,
  onChange,
  placeholder = "Select items...",
  disabled = false,
}: MultiSelectProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")

  const normalizedOptions = options.map((option) =>
    typeof option === "string" ? { label: option, value: option } : option,
  )

  const filteredOptions = normalizedOptions.filter((option) =>
    option.label.toLowerCase().includes(search.toLowerCase()),
  )

  const handleSelect = (value: string) => {
    if (selected.includes(value)) {
      onChange(selected.filter((item) => item !== value))
    } else {
      onChange([...selected, value])
    }
  }

  const handleRemove = (value: string) => {
    onChange(selected.filter((item) => item !== value))
  }

  const selectedLabels = selected.map((value) => {
    const option = normalizedOptions.find((opt) => opt.value === value)
    return option?.label || value
  })

  return (
    <div className="space-y-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between text-left font-normal bg-transparent"
            size="sm"
            disabled={disabled}
          >
            <span className="truncate">{selected.length === 0 ? placeholder : `${selected.length} selected`}</span>
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <Command>
            <CommandInput placeholder="Search..." value={search} onValueChange={setSearch} />
            <CommandList>
              <CommandEmpty>No options found.</CommandEmpty>
              <CommandGroup>
                {filteredOptions.map((option) => (
                  <CommandItem key={option.value} value={option.value} onSelect={() => handleSelect(option.value)}>
                    <Check
                      className={cn("mr-2 h-4 w-4", selected.includes(option.value) ? "opacity-100" : "opacity-0")}
                    />
                    {option.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {/* Selected items */}
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {selectedLabels.map((label, index) => (
            <Badge key={selected[index]} variant="secondary" className="text-xs gap-1">
              {label}
              <X
                className="h-3 w-3 cursor-pointer hover:text-destructive"
                onClick={() => handleRemove(selected[index])}
              />
            </Badge>
          ))}
        </div>
      )}
    </div>
  )
}
