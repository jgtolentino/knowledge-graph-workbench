import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { GitBranch, Boxes, ArrowRight, Sparkles, Zap, Shield } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <GitBranch className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-semibold">Spec Kit Workbench</span>
          </div>
          <nav className="flex items-center gap-6">
            <Link href="/graph" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Graph
            </Link>
            <Link href="/projects" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Projects
            </Link>
            <Link href="/issues" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Issues
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />
        <div className="relative mx-auto max-w-7xl px-6 py-24 text-center">
          <Badge variant="secondary" className="mb-6">
            <Sparkles className="mr-1 h-3 w-3" />
            Immersive 3D Visualization
          </Badge>
          <h1 className="mx-auto max-w-4xl text-balance text-5xl font-bold tracking-tight text-foreground">
            Your Development Ecosystem, <span className="text-primary">Visualized</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg text-muted-foreground">
            Explore your Spec Kit projects, database schemas, edge functions, and system health through an interactive
            3D knowledge graph. See the connections that matter.
          </p>
          <div className="mt-10 flex items-center justify-center gap-4">
            <Link href="/graph">
              <Button size="lg" className="gap-2">
                Launch Graph
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/projects">
              <Button size="lg" variant="outline">
                View Projects
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="grid gap-8 md:grid-cols-3">
          <div className="rounded-xl border border-border bg-card p-6">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <Boxes className="h-6 w-6 text-primary" />
            </div>
            <h3 className="mb-2 text-lg font-semibold">3D Knowledge Graph</h3>
            <p className="text-sm text-muted-foreground">
              GPU-accelerated visualization with D3-force layout, semantic zoom, and LOD rendering for thousands of
              nodes.
            </p>
          </div>
          <div className="rounded-xl border border-border bg-card p-6">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
              <Zap className="h-6 w-6 text-accent" />
            </div>
            <h3 className="mb-2 text-lg font-semibold">Story Mode Tours</h3>
            <p className="text-sm text-muted-foreground">
              Guided camera tours through your ecosystem. Understand Spec Kits, infrastructure, and observability at a
              glance.
            </p>
          </div>
          <div className="rounded-xl border border-border bg-card p-6">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-destructive/10">
              <Shield className="h-6 w-6 text-destructive" />
            </div>
            <h3 className="mb-2 text-lg font-semibold">Health Monitoring</h3>
            <p className="text-sm text-muted-foreground">
              Track issues, events, and system health in real-time. Quickly identify problem areas and their
              connections.
            </p>
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="border-t border-border">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <h2 className="mb-8 text-center text-2xl font-semibold">Quick Navigation</h2>
          <div className="grid gap-4 md:grid-cols-3">
            <Link href="/graph" className="group">
              <div className="rounded-xl border border-border bg-card p-6 transition-colors hover:border-primary/50 hover:bg-card/80">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">Knowledge Graph</h3>
                    <p className="text-sm text-muted-foreground">Full immersive 3D view</p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
            <Link href="/projects" className="group">
              <div className="rounded-xl border border-border bg-card p-6 transition-colors hover:border-primary/50 hover:bg-card/80">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">Projects</h3>
                    <p className="text-sm text-muted-foreground">Browse all Spec Kit projects</p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
            <Link href="/issues" className="group">
              <div className="rounded-xl border border-border bg-card p-6 transition-colors hover:border-primary/50 hover:bg-card/80">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">Issues</h3>
                    <p className="text-sm text-muted-foreground">Track problems and events</p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
