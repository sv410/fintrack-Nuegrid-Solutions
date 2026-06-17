import { Link, useLocation } from "wouter";
import { LayoutDashboard, Wallet, LogOut, Settings } from "lucide-react";
import { useAuth } from "@/lib/auth";

export function Layout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const [, navigate] = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen flex bg-background">
      <aside className="w-60 border-r border-border/50 bg-white/50 backdrop-blur-xl flex flex-col shrink-0">
        <div className="h-16 flex items-center px-6 border-b border-border/50">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-white" />
            </div>
            <span className="font-heading font-bold text-lg tracking-tight">FinTrack</span>
          </Link>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-primary/10 text-primary font-medium text-sm"
          >
            <LayoutDashboard className="w-4 h-4" />
            Dashboard
          </Link>
          <a
            href="#"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground hover:bg-secondary/50 font-medium text-sm transition-colors"
          >
            <Wallet className="w-4 h-4" />
            Transactions
          </a>
          <a
            href="#"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground hover:bg-secondary/50 font-medium text-sm transition-colors"
          >
            <Settings className="w-4 h-4" />
            Settings
          </a>
        </nav>

        <div className="p-4 border-t border-border/50 space-y-3">
          {user && (
            <div className="px-3 py-2">
              <p className="text-xs font-semibold truncate text-foreground">{user.name}</p>
              <p className="text-xs text-muted-foreground truncate">{user.email}</p>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive font-medium text-sm transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Log out
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {children}
      </main>
    </div>
  );
}
