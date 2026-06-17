import { Link, useLocation } from "wouter";
import { LayoutDashboard, Wallet, LogOut, Settings, ChevronDown, Check } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useCurrency, CURRENCIES } from "@/lib/currency";
import { useState, useRef, useEffect } from "react";

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/transactions", icon: Wallet, label: "Transactions" },
  { href: "/settings", icon: Settings, label: "Settings" },
];

function CurrencyDropdown() {
  const { currency, setCurrency } = useCurrency();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handle(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setSearch("");
      }
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  const filtered = CURRENCIES.filter(
    (c) =>
      c.code.toLowerCase().includes(search.toLowerCase()) ||
      c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => { setOpen(!open); setSearch(""); }}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-white text-sm font-semibold hover:bg-secondary/40 transition-colors"
      >
        <span className="text-muted-foreground font-normal">{currency.symbol}</span>
        {currency.code}
        <ChevronDown className={`w-3.5 h-3.5 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-60 bg-white rounded-2xl shadow-xl border border-border/60 z-50 overflow-hidden">
          <div className="p-2 border-b border-border/50">
            <input
              autoFocus
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search currency…"
              className="w-full px-3 py-2 rounded-lg bg-secondary/40 text-sm focus:outline-none placeholder:text-muted-foreground"
            />
          </div>
          <div className="max-h-64 overflow-y-auto py-1">
            {filtered.length === 0 ? (
              <p className="text-xs text-muted-foreground text-center py-4">No results</p>
            ) : (
              filtered.map((c) => (
                <button
                  key={c.code}
                  onClick={() => { setCurrency(c); setOpen(false); setSearch(""); }}
                  className={`w-full flex items-center justify-between px-4 py-2.5 text-sm hover:bg-secondary/50 transition-colors ${
                    c.code === currency.code ? "text-primary font-semibold" : "text-foreground"
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <span className="w-8 text-muted-foreground font-mono text-xs">{c.symbol}</span>
                    <span>
                      <span className="font-semibold">{c.code}</span>
                      <span className="text-muted-foreground ml-1.5 text-xs">{c.name}</span>
                    </span>
                  </span>
                  {c.code === currency.code && <Check className="w-3.5 h-3.5 text-primary" />}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export function Layout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const [location, navigate] = useLocation();

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
          {navItems.map(({ href, icon: Icon, label }) => {
            const isActive = location === href;
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium text-sm transition-colors ${
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            );
          })}
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
        {/* Top bar */}
        <div className="h-16 border-b border-border/50 bg-white/70 backdrop-blur-sm flex items-center justify-end px-8 gap-3 shrink-0">
          <CurrencyDropdown />
          {user && (
            <span className="text-sm font-medium text-muted-foreground">{user.name}</span>
          )}
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-white text-sm font-medium hover:bg-secondary/40 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            Logout
          </button>
        </div>

        <div className="flex-1 overflow-hidden flex flex-col">
          {children}
        </div>
      </main>
    </div>
  );
}
