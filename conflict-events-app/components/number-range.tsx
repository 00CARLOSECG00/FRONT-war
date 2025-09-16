"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface NumberRangeProps {
  label: string
  min?: number
  max?: number
  onChange: (min: number | undefined, max: number | undefined) => void
  step?: number
  minValue?: number
  maxValue?: number
}

export function NumberRange({ label, min, max, onChange, step = 1, minValue = 0, maxValue = 1000 }: NumberRangeProps) {
  const [localMin, setLocalMin] = useState(min?.toString() || "")
  const [localMax, setLocalMax] = useState(max?.toString() || "")

  const handleMinChange = (value: string) => {
    setLocalMin(value)
    const numValue = value === "" ? undefined : Number(value)
    onChange(numValue, max)
  }

  const handleMaxChange = (value: string) => {
    setLocalMax(value)
    const numValue = value === "" ? undefined : Number(value)
    onChange(min, numValue)
  }

  return (
    <div className="space-y-3">
      <Label className="text-xs text-muted-foreground">{label}</Label>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <Label className="text-xs text-muted-foreground mb-1 block">Min</Label>
          <Input
            type="number"
            placeholder="Min"
            value={localMin}
            onChange={(e) => handleMinChange(e.target.value)}
            className="h-8 text-sm"
            min={minValue}
            max={maxValue}
            step={step}
          />
        </div>
        <div>
          <Label className="text-xs text-muted-foreground mb-1 block">Max</Label>
          <Input
            type="number"
            placeholder="Max"
            value={localMax}
            onChange={(e) => handleMaxChange(e.target.value)}
            className="h-8 text-sm"
            min={minValue}
            max={maxValue}
            step={step}
          />
        </div>
      </div>
    </div>
  )
}
