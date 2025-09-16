import { Suspense } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Globe, AlertTriangle } from "lucide-react"
import Link from "next/link"
import { StatsCard } from "@/components/stats-card"
import { HeroSection } from "@/components/hero-section"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <HeroSection />

      {/* Statistics Section */}
      <section className="py-16 px-4 bg-muted/20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-balance">Global Conflict Monitoring</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto text-pretty">
              Real-time insights into armed conflicts worldwide, providing comprehensive data for researchers,
              policymakers, and humanitarian organizations.
            </p>
          </div>

          <Suspense fallback={<StatsCardSkeleton />}>
            <StatsCard />
          </Suspense>
        </div>
      </section>

      {/* Purpose and Ethics Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="border-l-4 border-l-primary">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-primary" />
                  <CardTitle>Our Mission</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  The War Events Observatory provides transparent, data-driven insights into global armed conflicts. Our
                  platform aggregates verified information to support academic research, policy development, and
                  humanitarian efforts.
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                    Evidence-based conflict analysis
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                    Temporal and spatial mapping
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                    Open data for research
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-destructive">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-destructive" />
                  <CardTitle>Ethical Considerations</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <Badge variant="outline" className="text-destructive border-destructive">
                    Sensitive Content Warning
                  </Badge>
                  <p className="text-muted-foreground text-sm">
                    This platform contains information about armed conflicts and casualties. Data is presented for
                    analytical purposes and should be interpreted with appropriate context and sensitivity.
                  </p>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-destructive rounded-full mt-2 flex-shrink-0" />
                      Data represents human tragedy and should be treated with respect
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-destructive rounded-full mt-2 flex-shrink-0" />
                      Information is aggregated from multiple sources and may contain uncertainties
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-destructive rounded-full mt-2 flex-shrink-0" />
                      Not intended for operational or real-time decision making
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 px-4 bg-muted/20">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4 text-balance">Explore Global Conflict Data</h2>
          <p className="text-muted-foreground mb-8 text-pretty">
            Access comprehensive mapping tools, temporal analysis, and detailed event information to understand patterns
            in global armed conflicts.
          </p>
          <Link href="/explore">
            <Button size="lg" className="gap-2">
              Start Exploring
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}

function StatsCardSkeleton() {
  return (
    <div className="grid md:grid-cols-3 gap-6">
      {[1, 2, 3].map((i) => (
        <Card key={i} className="animate-pulse">
          <CardHeader className="pb-3">
            <div className="h-4 bg-muted rounded w-3/4" />
          </CardHeader>
          <CardContent>
            <div className="h-8 bg-muted rounded w-1/2 mb-2" />
            <div className="h-3 bg-muted rounded w-full" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
