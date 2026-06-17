import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/lib/auth";
import { ArrowRight } from "lucide-react";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [, navigate] = useLocation();
  const { login } = useAuth();

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      login(email || "user@fintrack.app", name || "User");
      navigate("/dashboard");
    }, 600);
  };

  return (
    <div className="min-h-screen flex">
      <div
        className="hidden lg:flex lg:w-1/2 relative overflow-hidden flex-col justify-end"
        style={{
          background: "linear-gradient(160deg, #1c0f05 0%, #2a1208 15%, #0e1525 45%, #060d1a 65%, #1a0a0a 85%, #150808 100%)",
        }}
      >
        <div className="absolute inset-0 overflow-hidden">
          <div
            className="absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full"
            style={{ background: "radial-gradient(circle at 40% 40%, rgba(120,50,10,0.45) 0%, transparent 65%)" }}
          />
          <div
            className="absolute top-1/3 right-0 w-[500px] h-[500px] rounded-full"
            style={{ background: "radial-gradient(circle at 60% 50%, rgba(10,30,80,0.5) 0%, transparent 65%)" }}
          />
          <div
            className="absolute -bottom-20 left-1/4 w-[400px] h-[400px] rounded-full"
            style={{ background: "radial-gradient(circle at 50% 60%, rgba(80,20,10,0.4) 0%, transparent 65%)" }}
          />
        </div>

        <div className="relative z-10 p-12 pb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/20 text-white/60 text-xs font-medium tracking-widest mb-6 uppercase">
            <div className="w-1.5 h-1.5 rounded-full bg-orange-400" />
            FinTrack
          </div>
          <h2 className="text-white text-4xl font-bold leading-[1.15] mb-3 tracking-tight">
            Start your journey<br />
            <span style={{ color: "#E8572A" }}>to clarity.</span>
          </h2>
          <p className="text-white/45 text-sm leading-relaxed max-w-xs">
            Join thousands who understand their money better with FinTrack.
          </p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-8 py-12" style={{ background: "#FAF7F5" }}>
        <div className="w-full max-w-sm">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground mb-10 tracking-widest uppercase transition-colors"
          >
            ← Home
          </Link>

          <h1 className="text-[1.75rem] font-bold tracking-tight mb-1 font-heading">Create account.</h1>
          <p className="text-sm text-muted-foreground mb-8">Get started in seconds. No credit card required.</p>

          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label className="block text-[10px] font-semibold tracking-[0.12em] uppercase text-muted-foreground mb-2">
                Your Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Alex"
                className="w-full px-4 py-3 rounded-lg border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-[10px] font-semibold tracking-[0.12em] uppercase text-muted-foreground mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-3 rounded-lg border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-[10px] font-semibold tracking-[0.12em] uppercase text-muted-foreground mb-2">
                Password
              </label>
              <input
                type="password"
                placeholder="Choose a strong password"
                className="w-full px-4 py-3 rounded-lg border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:border-transparent transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-all disabled:opacity-70"
              style={{ background: "#111", color: "#fff" }}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating account…
                </span>
              ) : (
                <>Create account <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-foreground hover:underline underline-offset-2">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
