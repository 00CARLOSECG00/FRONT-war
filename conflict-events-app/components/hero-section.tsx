import { Button } from "@/components/ui/button"
import { ArrowRight, BarChart3, Map, Clock } from "lucide-react"
import Link from "next/link"

export function HeroSection() {
  return (
    <section className="relative py-24 px-4 overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-muted/20" />
      <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.02)_50%,transparent_75%)] bg-[length:20px_20px]" />

      <div className="relative max-w-6xl mx-auto">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-balance">
            War Events
            <span className="block text-primary">Observatory</span>
          </h1>

          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto text-pretty">
            Comprehensive mapping and analysis of armed conflict events worldwide. Providing data-driven insights for
            research, policy, and humanitarian efforts.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/explore">
              <Button size="lg" className="gap-2 min-w-[160px]">
                Explore Data
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/about">
              <Button variant="outline" size="lg" className="gap-2 min-w-[160px] bg-transparent">
                Learn More
              </Button>
            </Link>
          </div>

          {/* Feature highlights */}
          <div className="grid md:grid-cols-3 gap-8 mt-16">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Map className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Interactive Mapping</h3>
              <p className="text-sm text-muted-foreground text-pretty">
                Visualize conflict events with precise geographic coordinates and clustering
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Clock className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Temporal Analysis</h3>
              <p className="text-sm text-muted-foreground text-pretty">
                Track conflict patterns over time with detailed timeline visualization
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <BarChart3 className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Statistical Insights</h3>
              <p className="text-sm text-muted-foreground text-pretty">
                Comprehensive analytics and aggregated data by region and conflict type
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
