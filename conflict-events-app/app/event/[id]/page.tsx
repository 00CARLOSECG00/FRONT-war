import { Suspense } from "react"
import { notFound } from "next/navigation"
import { EventDetailContent } from "@/components/event-detail-content"
import { getEvent } from "@/lib/api"

interface EventDetailPageProps {
  params: {
    id: string
  }
}

async function EventDetailPage({ params }: EventDetailPageProps) {
  try {
    const event = await getEvent(params.id)
    return <EventDetailContent event={event} />
  } catch (error) {
    console.error("Failed to fetch event:", error)
    notFound()
  }
}

export default function EventDetailPageWrapper({ params }: EventDetailPageProps) {
  return (
    <Suspense fallback={<EventDetailSkeleton />}>
      <EventDetailPage params={params} />
    </Suspense>
  )
}

function EventDetailSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        {/* Header skeleton */}
        <div className="space-y-4">
          <div className="h-8 bg-muted rounded w-3/4" />
          <div className="h-4 bg-muted rounded w-1/2" />
          <div className="flex gap-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-6 bg-muted rounded w-20" />
            ))}
          </div>
        </div>

        {/* Content skeleton */}
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-48 bg-muted rounded" />
            ))}
          </div>
          <div className="space-y-6">
            {[1, 2].map((i) => (
              <div key={i} className="h-32 bg-muted rounded" />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
