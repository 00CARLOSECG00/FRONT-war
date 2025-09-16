"use client"

import { useEffect, useRef } from "react"
import type { ConflictEvent } from "@/lib/types"

interface EventMiniMapProps {
  event: ConflictEvent
}

export function EventMiniMap({ event }: EventMiniMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)

  useEffect(() => {
    if (!mapRef.current || !event.latitude || !event.longitude) return

    const initMap = async () => {
      try {
        // Dynamically import Leaflet to avoid SSR issues
        const L = (await import("leaflet")).default
        await import("leaflet/dist/leaflet.css")

        // Fix default markers
        delete (L.Icon.Default.prototype as any)._getIconUrl
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
          iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
          shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
        })

        // Create map
        const map = L.map(mapRef.current, {
          center: [event.latitude, event.longitude],
          zoom: 8,
          zoomControl: false,
          attributionControl: false,
          dragging: false,
          touchZoom: false,
          doubleClickZoom: false,
          scrollWheelZoom: false,
          boxZoom: false,
          keyboard: false,
        })

        // Add OpenStreetMap tiles
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          maxZoom: 18,
        }).addTo(map)

        // Get marker color based on violence type
        const getMarkerColor = (violenceType: number) => {
          switch (violenceType) {
            case 1:
              return "#ef4444" // red for state-based violence
            case 2:
              return "#f97316" // orange for non-state violence
            case 3:
              return "#eab308" // yellow for one-sided violence
            default:
              return "#6b7280" // gray for unknown
          }
        }

        const color = getMarkerColor(event.type_of_violence)
        const icon = L.divIcon({
          className: "custom-marker",
          html: `<div style="background-color: ${color}; width: 16px; height: 16px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.4);"></div>`,
          iconSize: [22, 22],
          iconAnchor: [11, 11],
        })

        // Add marker
        L.marker([event.latitude, event.longitude], { icon }).addTo(map)

        mapInstanceRef.current = map
      } catch (error) {
        console.error("Failed to initialize mini map:", error)
      }
    }

    initMap()

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [event])

  if (!event.latitude || !event.longitude) {
    return (
      <div className="h-48 bg-muted/20 flex items-center justify-center text-sm text-muted-foreground">
        No location data available
      </div>
    )
  }

  return (
    <div className="relative">
      <div ref={mapRef} className="h-48 w-full rounded-b-lg" />
      <div className="absolute bottom-2 left-2 bg-background/90 backdrop-blur-sm rounded px-2 py-1 text-xs">
        {event.latitude.toFixed(4)}, {event.longitude.toFixed(4)}
      </div>
    </div>
  )
}
