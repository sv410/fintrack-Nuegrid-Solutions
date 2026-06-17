import { Layout } from "@/components/layout";
import { useAuth } from "@/lib/auth";
import { useState } from "react";
import { User, Bell, Shield, Palette, ChevronRight } from "lucide-react";

export default function SettingsPage() {
  const { user } = useAuth();
  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const sections = [
    { icon: User, label: "Profile", active: true },
    { icon: Bell, label: "Notifications", active: false },
    { icon: Shield, label: "Security", active: false },
    { icon: Palette, label: "Appearance", active: false },
  ];

  return (
    <Layout>
      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-4xl mx-auto space-y-6">

          <header>
            <p className="text-xs font-semibold tracking-[0.15em] uppercase text-muted-foreground mb-2">Configure</p>
            <h1 className="text-4xl font-heading font-bold tracking-tight">Settings</h1>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-2xl shadow-sm border-0 p-3 h-fit">
              <nav className="space-y-1">
                {sections.map(({ icon: Icon, label, active }) => (
                  <button
                    key={label}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                      active
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {label}
                    <ChevronRight className="w-3.5 h-3.5 ml-auto opacity-40" />
                  </button>
                ))}
              </nav>
            </div>

            <div className="md:col-span-3 space-y-4">
              <div className="bg-white rounded-2xl shadow-sm border-0 p-6">
                <h2 className="font-heading font-bold text-lg mb-1">Profile</h2>
                <p className="text-sm text-muted-foreground mb-6">Update your account details.</p>

                <form onSubmit={handleSave} className="space-y-5">
                  <div>
                    <label className="block text-[10px] font-bold tracking-[0.12em] uppercase text-muted-foreground mb-2">
                      Display Name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 transition-all"
                      placeholder="Your name"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold tracking-[0.12em] uppercase text-muted-foreground mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 transition-all"
                      placeholder="you@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold tracking-[0.12em] uppercase text-muted-foreground mb-2">
                      Currency
                    </label>
                    <select className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 transition-all appearance-none">
                      <option value="USD">USD — US Dollar ($)</option>
                      <option value="EUR">EUR — Euro (€)</option>
                      <option value="GBP">GBP — British Pound (£)</option>
                      <option value="INR">INR — Indian Rupee (₹)</option>
                    </select>
                  </div>

                  <div className="pt-2 flex items-center gap-3">
                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white transition-all"
                      style={{ background: "#111" }}
                    >
                      {saved ? "Saved ✓" : "Save changes"}
                    </button>
                    <button
                      type="button"
                      className="px-6 py-2.5 rounded-xl text-sm font-medium border border-border hover:bg-secondary/50 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border-0 p-6">
                <h2 className="font-heading font-bold text-base mb-1">Danger Zone</h2>
                <p className="text-sm text-muted-foreground mb-4">Irreversible actions for your account.</p>
                <button className="px-5 py-2.5 rounded-xl text-sm font-semibold border border-destructive/40 text-destructive hover:bg-destructive/5 transition-colors">
                  Clear all transactions
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </Layout>
  );
}
