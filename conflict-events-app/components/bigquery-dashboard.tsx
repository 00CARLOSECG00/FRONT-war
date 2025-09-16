"use client"

import { PowerBIDashboard } from "./power-bi-dashboard"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface BigQueryDashboardProps {
  filters?: Record<string, any>
}

export function BigQueryDashboard({ filters = {} }: BigQueryDashboardProps) {
  // Power BI report IDs for different dashboards
  const dashboards = {
    timeline: process.env.NEXT_PUBLIC_POWERBI_TIMELINE_REPORT_ID || "timeline-report-id",
    regions: process.env.NEXT_PUBLIC_POWERBI_REGIONS_REPORT_ID || "regions-report-id",
    actors: process.env.NEXT_PUBLIC_POWERBI_ACTORS_REPORT_ID || "actors-report-id",
    casualties: process.env.NEXT_PUBLIC_POWERBI_CASUALTIES_REPORT_ID || "casualties-report-id",
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Conflict Data Analytics</h2>
        <p className="text-muted-foreground">Interactive dashboards powered by BigQuery and Power BI</p>
      </div>

      <Tabs defaultValue="timeline" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="timeline">Timeline Analysis</TabsTrigger>
          <TabsTrigger value="regions">Regional Breakdown</TabsTrigger>
          <TabsTrigger value="actors">Conflict Actors</TabsTrigger>
          <TabsTrigger value="casualties">Casualty Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="timeline" className="space-y-4">
          <PowerBIDashboard
            reportId={dashboards.timeline}
            title="Conflict Events Timeline"
            description="Temporal analysis of conflict events, deaths, and patterns over time"
            height={700}
            filters={filters}
          />
        </TabsContent>

        <TabsContent value="regions" className="space-y-4">
          <PowerBIDashboard
            reportId={dashboards.regions}
            title="Regional Analysis"
            description="Geographic distribution and regional patterns of conflict events"
            height={700}
            filters={filters}
          />
        </TabsContent>

        <TabsContent value="actors" className="space-y-4">
          <PowerBIDashboard
            reportId={dashboards.actors}
            title="Conflict Actors Analysis"
            description="Analysis of conflict actors, their involvement, and relationships"
            height={700}
            filters={filters}
          />
        </TabsContent>

        <TabsContent value="casualties" className="space-y-4">
          <PowerBIDashboard
            reportId={dashboards.casualties}
            title="Casualty Analysis"
            description="Detailed analysis of casualties including civilian impact"
            height={700}
            filters={filters}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
