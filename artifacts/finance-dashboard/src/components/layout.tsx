import { Link } from "wouter";
import { LayoutDashboard, Wallet, LogOut, Settings } from "lucide-react";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex bg-background">
      <aside className="w-64 border-r border-border/50 bg-white/50 backdrop-blur-xl flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-border/50">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-white" />
            </div>
            <span className="font-heading font-bold text-lg tracking-tight">FinTrack</span>
          </Link>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-2">
          <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2 rounded-lg bg-primary/10 text-primary font-medium">
            <LayoutDashboard className="w-5 h-5" />
            Dashboard
          </Link>
          <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg text-muted-foreground hover:bg-secondary/50 font-medium transition-colors">
            <Wallet className="w-5 h-5" />
            Transactions
          </a>
          <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg text-muted-foreground hover:bg-secondary/50 font-medium transition-colors">
            <Settings className="w-5 h-5" />
            Settings
          </a>
        </nav>
        
        <div className="p-4 border-t border-border/50">
          <Link href="/" className="flex items-center gap-3 px-3 py-2 rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive font-medium transition-colors">
            <LogOut className="w-5 h-5" />
            Log out
          </Link>
        </div>
      </aside>
      
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {children}
      </main>
    </div>
  );
}
