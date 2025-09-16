import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  Database,
  Globe,
  Shield,
  AlertTriangle,
  BookOpen,
  Users,
  MapPin,
  Clock,
  BarChart3,
  ExternalLink,
  ArrowLeft,
} from "lucide-react"
import Link from "next/link"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="max-w-4xl mx-auto p-6">
          <div className="flex items-center gap-4 mb-6">
            <Link href="/">
              <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </Button>
            </Link>
          </div>

          <div className="space-y-4">
            <h1 className="text-4xl font-bold text-balance">About War Events Observatory</h1>
            <p className="text-xl text-muted-foreground text-pretty">
              Understanding our methodology, data sources, and ethical framework for conflict analysis
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto p-6 space-y-8">
        {/* Mission Statement */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Our Mission
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              The War Events Observatory provides comprehensive, data-driven insights into global armed conflicts. Our
              platform serves researchers, policymakers, journalists, and humanitarian organizations by offering
              transparent access to verified conflict data with sophisticated analytical tools.
            </p>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="text-center p-4 border rounded-lg">
                <BookOpen className="h-8 w-8 mx-auto mb-2 text-primary" />
                <h3 className="font-semibold mb-1">Research</h3>
                <p className="text-sm text-muted-foreground">Supporting academic and policy research</p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <Users className="h-8 w-8 mx-auto mb-2 text-primary" />
                <h3 className="font-semibold mb-1">Humanitarian</h3>
                <p className="text-sm text-muted-foreground">Informing humanitarian response efforts</p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <Shield className="h-8 w-8 mx-auto mb-2 text-primary" />
                <h3 className="font-semibold mb-1">Transparency</h3>
                <p className="text-sm text-muted-foreground">Promoting open access to conflict data</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Data Structure */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Data Structure & Sources
            </CardTitle>
            <CardDescription>Understanding how conflict events are categorized and verified</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Violence Types</h3>
              <div className="grid gap-3">
                <div className="flex items-start gap-3 p-3 border rounded-lg">
                  <Badge variant="destructive" className="mt-0.5">
                    Type 1
                  </Badge>
                  <div>
                    <div className="font-medium">State-based Violence</div>
                    <div className="text-sm text-muted-foreground">
                      Armed conflicts between governments and organized armed groups, or between organized armed groups
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 border rounded-lg">
                  <Badge variant="secondary" className="mt-0.5">
                    Type 2
                  </Badge>
                  <div>
                    <div className="font-medium">Non-state Violence</div>
                    <div className="text-sm text-muted-foreground">
                      Armed conflicts between organized armed groups, neither of which is the government
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 border rounded-lg">
                  <Badge variant="outline" className="mt-0.5">
                    Type 3
                  </Badge>
                  <div>
                    <div className="font-medium">One-sided Violence</div>
                    <div className="text-sm text-muted-foreground">
                      Deliberate attacks on civilians by governments or organized armed groups
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Geographic Precision</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center p-3 border rounded-lg">
                  <MapPin className="h-6 w-6 mx-auto mb-2 text-green-600" />
                  <div className="font-medium">High Precision</div>
                  <div className="text-xs text-muted-foreground">Exact location known</div>
                </div>
                <div className="text-center p-3 border rounded-lg">
                  <MapPin className="h-6 w-6 mx-auto mb-2 text-yellow-600" />
                  <div className="font-medium">Medium Precision</div>
                  <div className="text-xs text-muted-foreground">Approximate area</div>
                </div>
                <div className="text-center p-3 border rounded-lg">
                  <MapPin className="h-6 w-6 mx-auto mb-2 text-red-600" />
                  <div className="font-medium">Low Precision</div>
                  <div className="text-xs text-muted-foreground">General region</div>
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Casualty Estimates</h3>
              <p className="text-sm text-muted-foreground">
                Each event includes three casualty estimates to account for uncertainty in reporting:
              </p>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-3 border rounded-lg">
                  <div className="font-medium text-green-600">Low Estimate</div>
                  <div className="text-xs text-muted-foreground">Conservative minimum casualties</div>
                </div>
                <div className="p-3 border rounded-lg">
                  <div className="font-medium">Best Estimate</div>
                  <div className="text-xs text-muted-foreground">Most likely casualty count</div>
                </div>
                <div className="p-3 border rounded-lg">
                  <div className="font-medium text-red-600">High Estimate</div>
                  <div className="text-xs text-muted-foreground">Maximum reported casualties</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Technical Architecture */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Technical Architecture
            </CardTitle>
            <CardDescription>How our platform processes and serves conflict data</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Data Storage</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Database className="h-5 w-5 mt-0.5 text-primary" />
                    <div>
                      <div className="font-medium">PostgreSQL</div>
                      <div className="text-sm text-muted-foreground">Primary event storage and relationships</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 mt-0.5 text-primary" />
                    <div>
                      <div className="font-medium">PostGIS</div>
                      <div className="text-sm text-muted-foreground">Geospatial analysis and heat mapping</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <BarChart3 className="h-5 w-5 mt-0.5 text-primary" />
                    <div>
                      <div className="font-medium">ClickHouse/DuckDB</div>
                      <div className="text-sm text-muted-foreground">Fast analytical queries and time series</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">API Endpoints</h3>
                <div className="space-y-2 text-sm font-mono">
                  <div className="p-2 bg-muted rounded">GET /api/events</div>
                  <div className="p-2 bg-muted rounded">GET /api/events/:id</div>
                  <div className="p-2 bg-muted rounded">GET /api/lookups</div>
                  <div className="p-2 bg-muted rounded">GET /api/stats/series</div>
                  <div className="p-2 bg-muted rounded">GET /api/stats/by-region</div>
                  <div className="p-2 bg-muted rounded">GET /api/stats/heat</div>
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Performance Optimizations</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="font-medium">Frontend</div>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Map clustering for large datasets</li>
                    <li>• Virtual scrolling for tables</li>
                    <li>• Debounced filter updates</li>
                    <li>• Memoized chart components</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <div className="font-medium">Backend</div>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Indexed geographic queries</li>
                    <li>• Columnar analytics engine</li>
                    <li>• Geohash-based heat mapping</li>
                    <li>• Cached lookup tables</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Ethical Framework */}
        <Card className="border-l-4 border-l-destructive">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Ethical Framework & Limitations
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
              <h3 className="font-semibold text-destructive mb-2">Important Disclaimers</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-destructive rounded-full mt-2 flex-shrink-0" />
                  This data represents human tragedy and should be interpreted with appropriate sensitivity and context
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-destructive rounded-full mt-2 flex-shrink-0" />
                  Information is aggregated from multiple sources and may contain uncertainties or reporting biases
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-destructive rounded-full mt-2 flex-shrink-0" />
                  Data is not intended for operational decision-making or real-time conflict response
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-destructive rounded-full mt-2 flex-shrink-0" />
                  Casualty figures represent reported deaths and may not reflect the full human cost of conflicts
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Data Limitations</h3>
              <div className="grid gap-4">
                <div className="p-4 border rounded-lg">
                  <div className="font-medium mb-2">Reporting Bias</div>
                  <p className="text-sm text-muted-foreground">
                    Events in remote areas or authoritarian regions may be underreported. Media coverage and source
                    availability vary significantly across different conflicts and regions.
                  </p>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="font-medium mb-2">Temporal Delays</div>
                  <p className="text-sm text-muted-foreground">
                    There may be significant delays between when events occur and when they are reported and verified.
                    Recent events may be incomplete or subject to revision.
                  </p>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="font-medium mb-2">Definitional Challenges</div>
                  <p className="text-sm text-muted-foreground">
                    Categorizing complex conflicts into discrete events and violence types involves subjective judgments
                    that may not capture the full complexity of situations.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Responsible Use Guidelines</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 mt-0.5 text-primary" />
                  <div>
                    <div className="font-medium">Context is Critical</div>
                    <div className="text-sm text-muted-foreground">
                      Always consider historical, political, and social context when interpreting conflict data
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Users className="h-5 w-5 mt-0.5 text-primary" />
                  <div>
                    <div className="font-medium">Human Impact</div>
                    <div className="text-sm text-muted-foreground">
                      Remember that statistics represent real human suffering and should be treated with dignity
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Shield className="h-5 w-5 mt-0.5 text-primary" />
                  <div>
                    <div className="font-medium">Verification</div>
                    <div className="text-sm text-muted-foreground">
                      Cross-reference with multiple sources and consult domain experts for critical applications
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact and Resources */}
        <Card>
          <CardHeader>
            <CardTitle>Contact & Resources</CardTitle>
            <CardDescription>Get in touch or learn more about conflict research</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">For Researchers</h3>
                <p className="text-sm text-muted-foreground">
                  If you're using this data for academic research, please ensure proper citation and consider the
                  ethical implications of your work.
                </p>
                <div className="space-y-2">
                  <Button variant="outline" size="sm" className="gap-2 bg-transparent" asChild>
                    <a href="mailto:research@warevents.org">
                      <ExternalLink className="h-4 w-4" />
                      Contact Research Team
                    </a>
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">For Organizations</h3>
                <p className="text-sm text-muted-foreground">
                  Humanitarian organizations and policy institutions can access additional resources and support for
                  using conflict data responsibly.
                </p>
                <div className="space-y-2">
                  <Button variant="outline" size="sm" className="gap-2 bg-transparent" asChild>
                    <a href="mailto:partnerships@warevents.org">
                      <ExternalLink className="h-4 w-4" />
                      Partnership Inquiries
                    </a>
                  </Button>
                </div>
              </div>
            </div>

            <Separator />

            <div className="text-center space-y-4">
              <h3 className="text-lg font-semibold">Explore the Data</h3>
              <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
                Ready to start exploring global conflict data? Use our interactive tools to analyze patterns, trends,
                and regional variations in armed conflicts worldwide.
              </p>
              <Link href="/explore">
                <Button className="gap-2">
                  Start Exploring
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
