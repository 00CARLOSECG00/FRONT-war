"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Users,
  AlertTriangle,
  ExternalLink,
  FileText,
  Database,
  Globe,
  Target,
  ChevronDown,
  ChevronUp,
} from "lucide-react"
import Link from "next/link"
import type { ConflictEvent } from "@/lib/types"
import { formatDate } from "@/lib/utils/date"
import { formatNumber } from "@/lib/utils/numbers"
import { EventMiniMap } from "@/components/event-mini-map"

interface EventDetailContentProps {
  event: ConflictEvent
}

export function EventDetailContent({ event }: EventDetailContentProps) {
  const [showAllSources, setShowAllSources] = useState(false)

  const getViolenceTypeLabel = (type: number) => {
    switch (type) {
      case 1:
        return "State-based Violence"
      case 2:
        return "Non-state Violence"
      case 3:
        return "One-sided Violence"
      default:
        return `Violence Type ${type}`
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

  const getClarityLabel = (clarity: number) => {
    switch (clarity) {
      case 1:
        return "High Precision"
      case 2:
        return "Medium Precision"
      case 3:
        return "Low Precision"
      default:
        return `Clarity ${clarity}`
    }
  }

  const getClarityBadge = (clarity: number) => {
    switch (clarity) {
      case 1:
        return "default"
      case 2:
        return "secondary"
      case 3:
        return "outline"
      default:
        return "outline"
    }
  }

  // Parse sources (assuming they might be separated by some delimiter)
  const sources = [
    {
      headline: event.source_headline,
      office: event.source_office,
      date: event.source_date,
      article: event.source_article,
      original: event.source_original,
    },
  ].filter((source) => source.headline || source.office)

  const casualtyData = [
    { label: "Side A Deaths", value: event.deaths_a, color: "bg-chart-1" },
    { label: "Side B Deaths", value: event.deaths_b, color: "bg-chart-2" },
    { label: "Civilian Deaths", value: event.deaths_civilians, color: "bg-destructive" },
    { label: "Unknown Deaths", value: event.deaths_unknown, color: "bg-muted-foreground" },
  ].filter((item) => item.value > 0)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="max-w-6xl mx-auto p-6">
          <div className="flex items-center gap-4 mb-6">
            <Link href="/explore">
              <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                <ArrowLeft className="h-4 w-4" />
                Back to Explore
              </Button>
            </Link>
            <div className="h-4 w-px bg-border" />
            <Badge variant="outline" className="font-mono text-xs">
              ID: {event.id}
            </Badge>
          </div>

          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold text-balance">{event.conflict_name || "Conflict Event"}</h1>
                <div className="flex items-center gap-4 text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {formatDate(event.date_start)}
                    {event.date_end !== event.date_start && ` - ${formatDate(event.date_end)}`}
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {event.country}, {event.adm_1}
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="text-2xl font-bold">{formatNumber(event.best)}</div>
                <div className="text-sm text-muted-foreground">Best estimate casualties</div>
                <div className="text-xs text-muted-foreground mt-1">
                  Range: {formatNumber(event.low)} - {formatNumber(event.high)}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Badge variant={getViolenceTypeBadge(event.type_of_violence) as any}>
                {getViolenceTypeLabel(event.type_of_violence)}
              </Badge>
              <Badge variant={getClarityBadge(event.event_clarity) as any}>
                {getClarityLabel(event.event_clarity)}
              </Badge>
              {event.active_year && <Badge variant="secondary">Active Year</Badge>}
              {event.deaths_civilians > 0 && <Badge variant="destructive">Civilian Casualties</Badge>}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto p-6">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Main Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Conflict Actors */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Conflict Actors
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-muted-foreground">Side A</div>
                    <div className="font-semibold">{event.side_a}</div>
                    <div className="text-xs text-muted-foreground">
                      ID: {event.side_a_dset_id} | New ID: {event.side_a_new_id}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-muted-foreground">Side B</div>
                    <div className="font-semibold">{event.side_b}</div>
                    <div className="text-xs text-muted-foreground">
                      ID: {event.side_b_dset_id} | New ID: {event.side_b_new_id}
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="text-sm font-medium text-muted-foreground">Dyad Information</div>
                  <div className="font-medium">{event.dyad_name}</div>
                  <div className="text-xs text-muted-foreground">
                    Dyad ID: {event.dyad_dset_id} | New ID: {event.dyad_new_id}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Casualties Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Casualties Breakdown
                </CardTitle>
                <CardDescription>Detailed breakdown of casualties by category</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {casualtyData.map((item) => (
                    <div key={item.label} className="text-center p-4 rounded-lg border">
                      <div className={`w-4 h-4 ${item.color} rounded-full mx-auto mb-2`} />
                      <div className="text-2xl font-bold">{formatNumber(item.value)}</div>
                      <div className="text-xs text-muted-foreground">{item.label}</div>
                    </div>
                  ))}
                </div>

                <Separator className="my-4" />

                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-lg font-semibold text-green-600">{formatNumber(event.low)}</div>
                    <div className="text-xs text-muted-foreground">Low Estimate</div>
                  </div>
                  <div>
                    <div className="text-xl font-bold">{formatNumber(event.best)}</div>
                    <div className="text-xs text-muted-foreground">Best Estimate</div>
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-red-600">{formatNumber(event.high)}</div>
                    <div className="text-xs text-muted-foreground">High Estimate</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Sources */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Sources ({event.number_of_sources})
                </CardTitle>
                <CardDescription>Information sources for this conflict event</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {sources.length > 0 ? (
                  sources.slice(0, showAllSources ? sources.length : 1).map((source, index) => (
                    <div key={index} className="border rounded-lg p-4 space-y-2">
                      {source.headline && (
                        <div>
                          <div className="text-sm font-medium text-muted-foreground">Headline</div>
                          <div className="font-medium">{source.headline}</div>
                        </div>
                      )}

                      <div className="grid md:grid-cols-2 gap-4 text-sm">
                        {source.office && (
                          <div>
                            <div className="text-muted-foreground">Source Office</div>
                            <div>{source.office}</div>
                          </div>
                        )}
                        {source.date && (
                          <div>
                            <div className="text-muted-foreground">Source Date</div>
                            <div>{formatDate(source.date)}</div>
                          </div>
                        )}
                      </div>

                      {(source.article || source.original) && (
                        <div className="flex gap-2 pt-2">
                          {source.article && (
                            <Button variant="outline" size="sm" className="gap-2 bg-transparent" asChild>
                              <a href={source.article} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="h-3 w-3" />
                                Article
                              </a>
                            </Button>
                          )}
                          {source.original && (
                            <Button variant="outline" size="sm" className="gap-2 bg-transparent" asChild>
                              <a href={source.original} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="h-3 w-3" />
                                Original
                              </a>
                            </Button>
                          )}
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">No detailed source information available</div>
                )}

                {sources.length > 1 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowAllSources(!showAllSources)}
                    className="w-full gap-2"
                  >
                    {showAllSources ? (
                      <>
                        <ChevronUp className="h-4 w-4" />
                        Show Less
                      </>
                    ) : (
                      <>
                        <ChevronDown className="h-4 w-4" />
                        Show All Sources ({sources.length})
                      </>
                    )}
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Technical Metadata */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Technical Metadata
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible>
                  <AccordionItem value="identifiers">
                    <AccordionTrigger>Dataset Identifiers</AccordionTrigger>
                    <AccordionContent className="space-y-3">
                      <div className="grid md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <div className="text-muted-foreground">Relation ID</div>
                          <div className="font-mono">{event.relid}</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Conflict Dataset ID</div>
                          <div className="font-mono">{event.conflict_dset_id}</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Conflict New ID</div>
                          <div className="font-mono">{event.conflict_new_id}</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Code Status</div>
                          <div className="font-mono">{event.code_status}</div>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="geographic">
                    <AccordionTrigger>Geographic Data</AccordionTrigger>
                    <AccordionContent className="space-y-3">
                      <div className="grid md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <div className="text-muted-foreground">Coordinates</div>
                          <div className="font-mono">
                            {event.latitude.toFixed(6)}, {event.longitude.toFixed(6)}
                          </div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Precision</div>
                          <div>{event.where_prec}</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">PRIOGRID ID</div>
                          <div className="font-mono">{event.priogrid_gid}</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Country ID</div>
                          <div className="font-mono">{event.country_id}</div>
                        </div>
                      </div>

                      {event.where_description && (
                        <div>
                          <div className="text-muted-foreground">Location Description</div>
                          <div>{event.where_description}</div>
                        </div>
                      )}

                      {event.where_coordinates && (
                        <div>
                          <div className="text-muted-foreground">Coordinate String</div>
                          <div className="font-mono text-xs">{event.where_coordinates}</div>
                        </div>
                      )}
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="temporal">
                    <AccordionTrigger>Temporal Data</AccordionTrigger>
                    <AccordionContent className="space-y-3">
                      <div className="grid md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <div className="text-muted-foreground">Date Precision</div>
                          <div>{event.date_prec}</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Year</div>
                          <div>{event.year}</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Start Date</div>
                          <div className="font-mono">{event.date_start}</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">End Date</div>
                          <div className="font-mono">{event.date_end}</div>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="gwn">
                    <AccordionTrigger>GWN Codes</AccordionTrigger>
                    <AccordionContent className="space-y-3">
                      <div className="grid md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <div className="text-muted-foreground">GWN Side A</div>
                          <div className="font-mono">{event.gwnoa}</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">GWN Side B</div>
                          <div className="font-mono">{event.gwnob}</div>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Map and Quick Info */}
          <div className="space-y-6">
            {/* Mini Map */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Location
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <EventMiniMap event={event} />
              </CardContent>
            </Card>

            {/* Quick Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Quick Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <div className="text-sm text-muted-foreground">Region</div>
                    <div className="font-medium">{event.region}</div>
                  </div>

                  <div>
                    <div className="text-sm text-muted-foreground">Administrative Level 2</div>
                    <div className="font-medium">{event.adm_2 || "Not specified"}</div>
                  </div>

                  <Separator />

                  <div>
                    <div className="text-sm text-muted-foreground">Event Clarity</div>
                    <div className="flex items-center gap-2">
                      <Badge variant={getClarityBadge(event.event_clarity) as any}>
                        {getClarityLabel(event.event_clarity)}
                      </Badge>
                      <span className="text-xs text-muted-foreground">({event.event_clarity}/3)</span>
                    </div>
                  </div>

                  <div>
                    <div className="text-sm text-muted-foreground">Number of Sources</div>
                    <div className="font-medium">{event.number_of_sources}</div>
                  </div>

                  <Separator />

                  <div>
                    <div className="text-sm text-muted-foreground">Status</div>
                    <div className="flex flex-wrap gap-1">
                      {event.active_year && (
                        <Badge variant="secondary" className="text-xs">
                          Active Year
                        </Badge>
                      )}
                      <Badge variant="outline" className="text-xs">
                        {event.code_status}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Related Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Related Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Link href={`/explore?countries=${encodeURIComponent(event.country)}`}>
                  <Button variant="outline" size="sm" className="w-full justify-start gap-2 bg-transparent">
                    <MapPin className="h-4 w-4" />
                    View all events in {event.country}
                  </Button>
                </Link>

                <Link href={`/explore?sidesA=${encodeURIComponent(event.side_a)}`}>
                  <Button variant="outline" size="sm" className="w-full justify-start gap-2 bg-transparent">
                    <Users className="h-4 w-4" />
                    View events with {event.side_a}
                  </Button>
                </Link>

                <Link href={`/explore?violenceTypes=${event.type_of_violence}`}>
                  <Button variant="outline" size="sm" className="w-full justify-start gap-2 bg-transparent">
                    <Target className="h-4 w-4" />
                    View {getViolenceTypeLabel(event.type_of_violence).toLowerCase()}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
