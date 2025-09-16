"use client"

import { useEffect, useRef, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Layers, RotateCcw, Loader2 } from "lucide-react"
import type { ConflictEvent, HeatCell } from "@/lib/types"
import { formatDate, formatDeaths } from "@/lib/utils/numbers"

interface MapViewProps {
  events: ConflictEvent[]
  heatData: HeatCell[]
  loading?: boolean
  error?: string | null
}

export function MapView({ events, heatData, loading, error }: MapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const markersLayerRef = useRef<any>(null)
  const heatLayerRef = useRef<any>(null)
  const [showHeatLayer, setShowHeatLayer] = useState(false)
  const [mapLoaded, setMapLoaded] = useState(false)

  // Initialize map
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return

    const initMap = async () => {
      try {
        // Dynamically import Leaflet to avoid SSR issues
        const L = (await import("leaflet")).default
        await import("leaflet/dist/leaflet.css")

        // Import clustering plugin
        const MarkerClusterGroup = (await import("leaflet.markercluster")).default
        await import("leaflet.markercluster/dist/MarkerCluster.css")
        await import("leaflet.markercluster/dist/MarkerCluster.Default.css")

        // Fix default markers
        delete (L.Icon.Default.prototype as any)._getIconUrl
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
          iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
          shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
        })

        // Create map
        const map = L.map(mapRef.current, {
          center: [20, 0],
          zoom: 2,
          zoomControl: true,
          attributionControl: true,
        })

        // Add OpenStreetMap tiles
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 18,
        }).addTo(map)

        // Create marker cluster group
        const markers = new MarkerClusterGroup({
          chunkedLoading: true,
          maxClusterRadius: 50,
          iconCreateFunction: (cluster: any) => {
            const count = cluster.getChildCount()
            let className = "marker-cluster-small"
            if (count > 100) className = "marker-cluster-large"
            else if (count > 10) className = "marker-cluster-medium"

            return L.divIcon({
              html: `<div><span>${count}</span></div>`,
              className: `marker-cluster ${className}`,
              iconSize: L.point(40, 40),
            })
          },
        })

        map.addLayer(markers)

        mapInstanceRef.current = map
        markersLayerRef.current = markers
        setMapLoaded(true)

        // Listen for reset view events
        const handleResetView = () => {
          if (events.length > 0) {
            const validEvents = events.filter((event) => event.latitude && event.longitude)
            if (validEvents.length > 0) {
              const bounds = L.latLngBounds(
                validEvents.map((event) => [event.latitude, event.longitude] as [number, number]),
              )
              map.fitBounds(bounds, { padding: [20, 20] })
            }
          } else {
            map.setView([20, 0], 2)
          }
        }

        window.addEventListener("resetMapView", handleResetView)

        return () => {
          window.removeEventListener("resetMapView", handleResetView)
          map.remove()
        }
      } catch (error) {
        console.error("Failed to initialize map:", error)
      }
    }

    initMap()

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
        markersLayerRef.current = null
        heatLayerRef.current = null
      }
    }
  }, [])

  // Update markers when events change
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current || !mapLoaded) return

    const updateMarkers = async () => {
      const L = (await import("leaflet")).default

      // Clear existing markers
      markersLayerRef.current.clearLayers()

      // Add new markers
      const validEvents = events.filter((event) => event.latitude && event.longitude)

      validEvents.forEach((event) => {
        // Create custom icon based on violence type
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
          html: `<div style="background-color: ${color}; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
          iconSize: [16, 16],
          iconAnchor: [8, 8],
        })

        const marker = L.marker([event.latitude, event.longitude], { icon })

        // Create popup content
        const popupContent = `
          <div class="p-3 min-w-[280px]">
            <div class="flex items-start justify-between mb-2">
              <h3 class="font-semibold text-sm">${event.country}, ${event.adm_1}</h3>
              <span class="text-xs text-gray-500">${formatDate(event.date_start)}</span>
            </div>
            
            <div class="space-y-2 text-xs">
              <div class="flex justify-between">
                <span class="text-gray-600">Conflict:</span>
                <span class="font-medium">${event.conflict_name}</span>
              </div>
              
              <div class="flex justify-between">
                <span class="text-gray-600">Actors:</span>
                <span class="font-medium">${event.side_a} vs ${event.side_b}</span>
              </div>
              
              <div class="flex justify-between">
                <span class="text-gray-600">Casualties:</span>
                <span class="font-medium">${formatDeaths(event.best)}</span>
              </div>
              
              ${
                event.deaths_civilians > 0
                  ? `<div class="flex justify-between">
                      <span class="text-gray-600">Civilians:</span>
                      <span class="font-medium text-red-600">${formatDeaths(event.deaths_civilians)}</span>
                    </div>`
                  : ""
              }
            </div>
            
            <div class="mt-3 pt-2 border-t">
              <Link href={\`/event/${event.id}\`} className="text-blue-600 hover:text-blue-800 text-xs font-medium">
                View Details →
              </Link>
            </div>
          </div>
        `

        marker.bindPopup(popupContent, {
          maxWidth: 300,
          className: "custom-popup",
        })

        markersLayerRef.current.addLayer(marker)
      })

      // Fit bounds to markers if we have events
      if (validEvents.length > 0) {
        const bounds = L.latLngBounds(validEvents.map((event) => [event.latitude, event.longitude] as [number, number]))
        mapInstanceRef.current.fitBounds(bounds, { padding: [20, 20] })
      }
    }

    updateMarkers()
  }, [events, mapLoaded])

  // Update heat layer when heat data changes
  useEffect(() => {
    if (!mapInstanceRef.current || !mapLoaded) return

    const updateHeatLayer = async () => {
      try {
        const L = (await import("leaflet")).default
        const HeatmapOverlay = (await import("leaflet-heatmap")).default

        // Remove existing heat layer
        if (heatLayerRef.current) {
          mapInstanceRef.current.removeLayer(heatLayerRef.current)
          heatLayerRef.current = null
        }

        if (showHeatLayer && heatData.length > 0) {
          // Create heat layer
          const heatmapLayer = new HeatmapOverlay({
            radius: 20,
            maxOpacity: 0.8,
            scaleRadius: true,
            useLocalExtrema: false,
            latField: "lat",
            lngField: "lng",
            valueField: "count",
          })

          const heatmapData = {
            max: Math.max(...heatData.map((cell) => cell.count)),
            data: heatData.map((cell) => ({
              lat: cell.lat,
              lng: cell.lng,
              count: cell.count,
            })),
          }

          heatmapLayer.setData(heatmapData)
          mapInstanceRef.current.addLayer(heatmapLayer)
          heatLayerRef.current = heatmapLayer
        }
      } catch (error) {
        console.error("Failed to create heat layer:", error)
      }
    }

    updateHeatLayer()
  }, [heatData, showHeatLayer, mapLoaded])

  const handleResetView = () => {
    window.dispatchEvent(new CustomEvent("resetMapView"))
  }

  if (error) {
    return (
      <div className="h-full flex items-center justify-center bg-muted/20">
        <Card className="p-6 max-w-md">
          <div className="text-center space-y-4">
            <div className="text-destructive">Failed to load map data</div>
            <p className="text-sm text-muted-foreground">{error}</p>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="relative h-full">
      {/* Map container */}
      <div ref={mapRef} className="h-full w-full" />

      {/* Loading overlay */}
      {loading && (
        <div className="absolute inset-0 bg-background/80 flex items-center justify-center z-[1000]">
          <div className="flex items-center gap-2 text-sm">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading map data...
          </div>
        </div>
      )}

      {/* Map controls */}
      <div className="absolute top-4 right-4 z-[1000] space-y-2">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => setShowHeatLayer(!showHeatLayer)}
          className="gap-2 bg-background/90 backdrop-blur-sm"
        >
          <Layers className="h-4 w-4" />
          {showHeatLayer ? "Hide" : "Show"} Heat
        </Button>

        <Button
          variant="secondary"
          size="sm"
          onClick={handleResetView}
          className="gap-2 bg-background/90 backdrop-blur-sm"
        >
          <RotateCcw className="h-4 w-4" />
          Reset View
        </Button>
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 z-[1000]">
        <Card className="p-3 bg-background/90 backdrop-blur-sm">
          <div className="space-y-2">
            <h4 className="text-xs font-semibold">Violence Types</h4>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs">
                <div className="w-3 h-3 rounded-full bg-red-500 border border-white shadow-sm" />
                State-based
              </div>
              <div className="flex items-center gap-2 text-xs">
                <div className="w-3 h-3 rounded-full bg-orange-500 border border-white shadow-sm" />
                Non-state
              </div>
              <div className="flex items-center gap-2 text-xs">
                <div className="w-3 h-3 rounded-full bg-yellow-500 border border-white shadow-sm" />
                One-sided
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Event count badge */}
      {events.length > 0 && (
        <div className="absolute top-4 left-4 z-[1000]">
          <Badge variant="secondary" className="bg-background/90 backdrop-blur-sm">
            {events.length} events displayed
          </Badge>
        </div>
      )}
    </div>
  )
}
