import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, PieChart, Wallet, Sparkles } from "lucide-react";
import { useAuth } from "@/lib/auth";

export default function Landing() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen flex flex-col items-center">
      <header className="w-full max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
            <div className="w-3 h-3 rounded-full bg-white" />
          </div>
          <span className="font-heading font-bold text-xl tracking-tight">FinTrack</span>
        </div>
        <nav className="flex items-center gap-4">
          <Link
            href={isAuthenticated ? "/dashboard" : "/login"}
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Sign In
          </Link>
          <Button asChild className="rounded-full px-6 shadow-md shadow-primary/20">
            <Link href="/login">Get Started</Link>
          </Button>
        </nav>
      </header>

      <main className="flex-1 w-full flex flex-col items-center justify-center text-center px-6 py-24">
        <div className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-medium text-sm mb-8">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
          </span>
          AI-Powered Personal Finance
        </div>

        <h1 className="text-5xl md:text-7xl font-bold font-heading max-w-4xl leading-[1.1] mb-6 tracking-tight">
          Money in.<br />
          Money out.<br />
          <span className="text-primary">Insight gained.</span>
        </h1>

        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-12">
          A minimalist personal finance dashboard with AI-driven insights. Log transactions, see where your money goes, and get clear advice.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Button size="lg" asChild className="rounded-full px-8 h-14 text-base shadow-xl shadow-primary/25">
            <Link href="/login">
              Get Started <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="rounded-full px-8 h-14 text-base border-2 hover:bg-secondary/50"
            onClick={() => {
              window.location.href = "/login";
            }}
          >
            Try Demo Account
          </Button>
        </div>

        <div className="mt-32 w-full max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center text-center p-6 rounded-2xl border border-border/50 bg-white/60 backdrop-blur-sm">
            <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-6 text-primary">
              <Wallet className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-semibold text-xl mb-3">Track Everything</h3>
            <p className="text-muted-foreground text-sm">Income, expenses, categorized — searchable and filterable.</p>
          </div>
          <div className="flex flex-col items-center text-center p-6 rounded-2xl border border-border/50 bg-white/60 backdrop-blur-sm">
            <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-6 text-primary">
              <PieChart className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-semibold text-xl mb-3">Visual Clarity</h3>
            <p className="text-muted-foreground text-sm">Bar charts, top categories, and a live net-balance number.</p>
          </div>
          <div className="flex flex-col items-center text-center p-6 rounded-2xl border border-border/50 bg-white/60 backdrop-blur-sm">
            <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-6 text-primary">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-semibold text-xl mb-3">AI Insights</h3>
            <p className="text-muted-foreground text-sm">Smart, friendly advice generated from your real spending.</p>
          </div>
        </div>
      </main>

      <footer className="w-full border-t border-border/50 py-6 px-6 text-center text-xs text-muted-foreground">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <span>© 2026 FinTrack</span>
          <span>v1.0 — built with Express + React</span>
        </div>
      </footer>
    </div>
  );
}
