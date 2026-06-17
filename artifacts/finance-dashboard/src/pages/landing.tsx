import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, PieChart, Wallet, Zap } from "lucide-react";

export default function Landing() {
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
          <Link href="/dashboard" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Sign In
          </Link>
          <Button asChild className="rounded-full px-6 shadow-md shadow-primary/20">
            <Link href="/dashboard">Get Started</Link>
          </Button>
        </nav>
      </header>

      <main className="flex-1 w-full flex flex-col items-center justify-center text-center px-6 py-24">
        <div className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-medium text-sm mb-8">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
          </span>
          Your new financial space
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold font-heading max-w-4xl leading-[1.1] mb-6 tracking-tight">
          Where your money makes sense.
        </h1>
        
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-12">
          A sleek, crafted personal finance tracker that helps you check where your money goes, add transactions quickly, and get a moment of clarity.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Button size="lg" asChild className="rounded-full px-8 h-14 text-base shadow-xl shadow-primary/25">
            <Link href="/dashboard">
              Open Dashboard <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" className="rounded-full px-8 h-14 text-base border-2 hover:bg-secondary/50">
            View Live Demo
          </Button>
        </div>

        <div className="mt-32 w-full max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center text-center p-6">
            <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-6 text-primary">
              <PieChart className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-semibold text-xl mb-3">Clear Insights</h3>
            <p className="text-muted-foreground">Understand your spending patterns at a glance with beautiful, interactive visualizations.</p>
          </div>
          <div className="flex flex-col items-center text-center p-6">
            <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-6 text-primary">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-semibold text-xl mb-3">Lightning Fast</h3>
            <p className="text-muted-foreground">Add transactions in seconds. No more complex forms or confusing categories.</p>
          </div>
          <div className="flex flex-col items-center text-center p-6">
            <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-6 text-primary">
              <Wallet className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-semibold text-xl mb-3">Total Control</h3>
            <p className="text-muted-foreground">Your personal financial space, crafted to make you feel confident about your money.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
