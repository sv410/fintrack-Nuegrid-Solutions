import { Layout } from "@/components/layout";
import { useAuth } from "@/lib/auth";
import { useCurrency, CURRENCIES } from "@/lib/currency";
import { useState, useEffect } from "react";
import {
  User, Bell, Shield, Palette, Check,
  Eye, EyeOff, Monitor, Sun, Moon, AlertTriangle,
} from "lucide-react";

type Tab = "profile" | "notifications" | "security" | "appearance";

interface NotifSettings {
  weeklyDigest: boolean;
  spendingAlerts: boolean;
  transactionConfirm: boolean;
  monthlyReport: boolean;
}

interface AppearanceSettings {
  theme: "light" | "dark" | "system";
  compactMode: boolean;
  dateFormat: "MM/DD/YYYY" | "DD/MM/YYYY" | "YYYY-MM-DD";
  accentColor: string;
}

const ACCENT_COLORS = [
  { label: "Orange", value: "#E8572A" },
  { label: "Blue", value: "#2563EB" },
  { label: "Green", value: "#16A34A" },
  { label: "Purple", value: "#7C3AED" },
  { label: "Pink", value: "#DB2777" },
  { label: "Teal", value: "#0D9488" },
];

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
        checked ? "bg-primary" : "bg-border"
      }`}
    >
      <span
        className={`inline-block h-4 w-4 rounded-full bg-white shadow transform transition-transform ${
          checked ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );
}

function SettingRow({ label, description, children }: { label: string; description?: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between py-4 border-b border-border/50 last:border-0">
      <div>
        <p className="text-sm font-medium">{label}</p>
        {description && <p className="text-xs text-muted-foreground mt-0.5">{description}</p>}
      </div>
      <div className="ml-4 shrink-0">{children}</div>
    </div>
  );
}

export default function SettingsPage() {
  const { user } = useAuth();
  const { currency, setCurrency } = useCurrency();
  const [activeTab, setActiveTab] = useState<Tab>("profile");

  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [profileSaved, setProfileSaved] = useState(false);

  const [notifs, setNotifs] = useState<NotifSettings>(() => {
    try { return JSON.parse(localStorage.getItem("fintrack_notifs") ?? "{}"); } catch { return {}; }
  });
  const defaultNotifs: NotifSettings = {
    weeklyDigest: notifs.weeklyDigest ?? true,
    spendingAlerts: notifs.spendingAlerts ?? false,
    transactionConfirm: notifs.transactionConfirm ?? true,
    monthlyReport: notifs.monthlyReport ?? false,
  };

  const [currentPwd, setCurrentPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [twoFAEnabled, setTwoFAEnabled] = useState(false);
  const [pwdSaved, setPwdSaved] = useState(false);
  const [pwdError, setPwdError] = useState("");

  const [appearance, setAppearance] = useState<AppearanceSettings>(() => {
    try {
      return JSON.parse(localStorage.getItem("fintrack_appearance") ?? "{}");
    } catch { return {}; }
  });
  const defaultAppearance: AppearanceSettings = {
    theme: appearance.theme ?? "light",
    compactMode: appearance.compactMode ?? false,
    dateFormat: appearance.dateFormat ?? "MM/DD/YYYY",
    accentColor: appearance.accentColor ?? "#E8572A",
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("fintrack_profile", JSON.stringify({ name, email }));
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 2000);
  };

  const setNotif = (key: keyof NotifSettings, value: boolean) => {
    const next = { ...defaultNotifs, [key]: value };
    setNotifs(next);
    localStorage.setItem("fintrack_notifs", JSON.stringify(next));
  };

  const handleSavePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPwdError("");
    if (!currentPwd) { setPwdError("Enter your current password."); return; }
    if (newPwd.length < 8) { setPwdError("New password must be at least 8 characters."); return; }
    if (newPwd !== confirmPwd) { setPwdError("Passwords don't match."); return; }
    setPwdSaved(true);
    setCurrentPwd(""); setNewPwd(""); setConfirmPwd("");
    setTimeout(() => setPwdSaved(false), 2500);
  };

  const setAppearanceProp = <K extends keyof AppearanceSettings>(key: K, value: AppearanceSettings[K]) => {
    const next = { ...defaultAppearance, [key]: value };
    setAppearance(next);
    localStorage.setItem("fintrack_appearance", JSON.stringify(next));
  };

  const tabs = [
    { id: "profile" as Tab, icon: User, label: "Profile" },
    { id: "notifications" as Tab, icon: Bell, label: "Notifications" },
    { id: "security" as Tab, icon: Shield, label: "Security" },
    { id: "appearance" as Tab, icon: Palette, label: "Appearance" },
  ];

  const inputCls = "w-full px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all";
  const labelCls = "block text-[10px] font-bold tracking-[0.12em] uppercase text-muted-foreground mb-2";

  return (
    <Layout>
      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <header>
            <p className="text-xs font-semibold tracking-[0.15em] uppercase text-muted-foreground mb-2">Configure</p>
            <h1 className="text-4xl font-heading font-bold tracking-tight">Settings</h1>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Sidebar nav */}
            <div className="bg-white rounded-2xl shadow-sm border-0 p-3 h-fit">
              <nav className="space-y-1">
                {tabs.map(({ id, icon: Icon, label }) => (
                  <button
                    key={id}
                    onClick={() => setActiveTab(id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                      activeTab === id
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {label}
                  </button>
                ))}
              </nav>
            </div>

            {/* Content area */}
            <div className="md:col-span-3 space-y-4">

              {/* PROFILE */}
              {activeTab === "profile" && (
                <>
                  <div className="bg-white rounded-2xl shadow-sm border-0 p-6">
                    <h2 className="font-heading font-bold text-lg mb-1">Profile</h2>
                    <p className="text-sm text-muted-foreground mb-6">Update your account information.</p>

                    <div className="flex items-center gap-4 mb-6 pb-6 border-b border-border/50">
                      <div
                        className="w-14 h-14 rounded-full flex items-center justify-center text-white text-xl font-bold shrink-0"
                        style={{ background: "#E8572A" }}
                      >
                        {(name || user?.name || "U")[0].toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold">{name || user?.name}</p>
                        <p className="text-sm text-muted-foreground">{email || user?.email}</p>
                      </div>
                    </div>

                    <form onSubmit={handleSaveProfile} className="space-y-5">
                      <div>
                        <label className={labelCls}>Display Name</label>
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} className={inputCls} placeholder="Your name" />
                      </div>
                      <div>
                        <label className={labelCls}>Email Address</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputCls} placeholder="you@example.com" />
                      </div>
                      <div>
                        <label className={labelCls}>Default Currency</label>
                        <select
                          value={currency.code}
                          onChange={(e) => { const c = CURRENCIES.find((c) => c.code === e.target.value); if (c) setCurrency(c); }}
                          className={inputCls + " appearance-none"}
                        >
                          {CURRENCIES.map((c) => (
                            <option key={c.code} value={c.code}>{c.code} — {c.name} ({c.symbol})</option>
                          ))}
                        </select>
                      </div>
                      <div className="pt-2 flex items-center gap-3">
                        <button type="submit" className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white transition-all flex items-center gap-2" style={{ background: "#111" }}>
                          {profileSaved ? <><Check className="w-4 h-4" /> Saved</> : "Save changes"}
                        </button>
                        <button type="button" className="px-6 py-2.5 rounded-xl text-sm font-medium border border-border hover:bg-secondary/50 transition-colors" onClick={() => { setName(user?.name ?? ""); setEmail(user?.email ?? ""); }}>
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>

                  <div className="bg-white rounded-2xl shadow-sm border-0 p-6">
                    <h2 className="font-heading font-bold text-base mb-1 text-destructive">Danger Zone</h2>
                    <p className="text-sm text-muted-foreground mb-4">These actions are permanent and cannot be undone.</p>
                    <button className="px-5 py-2.5 rounded-xl text-sm font-semibold border border-destructive/40 text-destructive hover:bg-destructive/5 transition-colors">
                      Clear all transactions
                    </button>
                  </div>
                </>
              )}

              {/* NOTIFICATIONS */}
              {activeTab === "notifications" && (
                <div className="bg-white rounded-2xl shadow-sm border-0 p-6">
                  <h2 className="font-heading font-bold text-lg mb-1">Notifications</h2>
                  <p className="text-sm text-muted-foreground mb-6">Control how FinTrack keeps you informed.</p>

                  <div className="divide-y divide-border/50">
                    <SettingRow label="Weekly Spending Digest" description="A summary of your week sent every Monday.">
                      <Toggle checked={defaultNotifs.weeklyDigest} onChange={(v) => setNotif("weeklyDigest", v)} />
                    </SettingRow>
                    <SettingRow label="Spending Limit Alerts" description="Notify me when I exceed a category budget.">
                      <Toggle checked={defaultNotifs.spendingAlerts} onChange={(v) => setNotif("spendingAlerts", v)} />
                    </SettingRow>
                    <SettingRow label="Transaction Confirmations" description="Show a confirmation each time I add a transaction.">
                      <Toggle checked={defaultNotifs.transactionConfirm} onChange={(v) => setNotif("transactionConfirm", v)} />
                    </SettingRow>
                    <SettingRow label="Monthly Report" description="End-of-month breakdown of income vs. expenses.">
                      <Toggle checked={defaultNotifs.monthlyReport} onChange={(v) => setNotif("monthlyReport", v)} />
                    </SettingRow>
                  </div>

                  <p className="text-xs text-muted-foreground mt-6 pt-4 border-t border-border/50">
                    Preferences are saved automatically and stored locally.
                  </p>
                </div>
              )}

              {/* SECURITY */}
              {activeTab === "security" && (
                <>
                  <div className="bg-white rounded-2xl shadow-sm border-0 p-6">
                    <h2 className="font-heading font-bold text-lg mb-1">Change Password</h2>
                    <p className="text-sm text-muted-foreground mb-6">Use a strong password you don't use elsewhere.</p>

                    <form onSubmit={handleSavePassword} className="space-y-4">
                      <div>
                        <label className={labelCls}>Current Password</label>
                        <div className="relative">
                          <input type={showCurrent ? "text" : "password"} value={currentPwd} onChange={(e) => setCurrentPwd(e.target.value)} className={inputCls + " pr-11"} placeholder="••••••••" />
                          <button type="button" onClick={() => setShowCurrent(!showCurrent)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                            {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                      <div>
                        <label className={labelCls}>New Password</label>
                        <div className="relative">
                          <input type={showNew ? "text" : "password"} value={newPwd} onChange={(e) => setNewPwd(e.target.value)} className={inputCls + " pr-11"} placeholder="Min. 8 characters" />
                          <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                            {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                        {newPwd && (
                          <div className="mt-2 flex items-center gap-1.5">
                            {[4, 8, 12].map((len, i) => (
                              <div key={i} className={`h-1 flex-1 rounded-full ${newPwd.length >= len ? (len >= 12 ? "bg-green-500" : len >= 8 ? "bg-yellow-400" : "bg-red-400") : "bg-border"}`} />
                            ))}
                            <span className="text-xs text-muted-foreground ml-1">
                              {newPwd.length < 4 ? "Weak" : newPwd.length < 8 ? "Fair" : newPwd.length < 12 ? "Good" : "Strong"}
                            </span>
                          </div>
                        )}
                      </div>
                      <div>
                        <label className={labelCls}>Confirm New Password</label>
                        <input type="password" value={confirmPwd} onChange={(e) => setConfirmPwd(e.target.value)} className={inputCls} placeholder="Repeat new password" />
                      </div>

                      {pwdError && (
                        <div className="flex items-center gap-2 text-destructive text-sm bg-destructive/5 px-4 py-3 rounded-xl">
                          <AlertTriangle className="w-4 h-4 shrink-0" /> {pwdError}
                        </div>
                      )}

                      <div className="pt-2">
                        <button type="submit" className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white transition-all flex items-center gap-2" style={{ background: "#111" }}>
                          {pwdSaved ? <><Check className="w-4 h-4" /> Password updated</> : "Update password"}
                        </button>
                      </div>
                    </form>
                  </div>

                  <div className="bg-white rounded-2xl shadow-sm border-0 p-6">
                    <h2 className="font-heading font-bold text-lg mb-1">Two-Factor Authentication</h2>
                    <p className="text-sm text-muted-foreground mb-4">Add an extra layer of security to your account.</p>
                    <SettingRow label="Enable 2FA" description="Require a code in addition to your password.">
                      <Toggle checked={twoFAEnabled} onChange={setTwoFAEnabled} />
                    </SettingRow>
                    {twoFAEnabled && (
                      <div className="mt-4 p-4 rounded-xl bg-primary/5 text-sm text-primary">
                        2FA is enabled. In a production deployment, you would scan a QR code with your authenticator app.
                      </div>
                    )}
                  </div>

                  <div className="bg-white rounded-2xl shadow-sm border-0 p-6">
                    <h2 className="font-heading font-bold text-base mb-4">Active Sessions</h2>
                    {[
                      { device: "Chrome on macOS", location: "New York, US", time: "Active now", current: true },
                      { device: "Mobile App — iOS", location: "New York, US", time: "2 hours ago", current: false },
                    ].map((s) => (
                      <div key={s.device} className="flex items-center justify-between py-3 border-b border-border/50 last:border-0">
                        <div>
                          <p className="text-sm font-medium">{s.device}</p>
                          <p className="text-xs text-muted-foreground">{s.location} · {s.time}</p>
                        </div>
                        {s.current ? (
                          <span className="text-xs font-semibold text-primary px-2 py-1 rounded-full bg-primary/10">Current</span>
                        ) : (
                          <button className="text-xs text-destructive hover:underline">Revoke</button>
                        )}
                      </div>
                    ))}
                  </div>
                </>
              )}

              {/* APPEARANCE */}
              {activeTab === "appearance" && (
                <>
                  <div className="bg-white rounded-2xl shadow-sm border-0 p-6">
                    <h2 className="font-heading font-bold text-lg mb-1">Theme</h2>
                    <p className="text-sm text-muted-foreground mb-5">Choose how FinTrack looks.</p>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { value: "light" as const, icon: Sun, label: "Light" },
                        { value: "dark" as const, icon: Moon, label: "Dark" },
                        { value: "system" as const, icon: Monitor, label: "System" },
                      ].map(({ value, icon: Icon, label }) => (
                        <button
                          key={value}
                          onClick={() => setAppearanceProp("theme", value)}
                          className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                            defaultAppearance.theme === value
                              ? "border-primary bg-primary/5"
                              : "border-border hover:border-primary/30"
                          }`}
                        >
                          <Icon className={`w-5 h-5 ${defaultAppearance.theme === value ? "text-primary" : "text-muted-foreground"}`} />
                          <span className={`text-xs font-semibold ${defaultAppearance.theme === value ? "text-primary" : "text-muted-foreground"}`}>{label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl shadow-sm border-0 p-6">
                    <h2 className="font-heading font-bold text-lg mb-1">Accent Color</h2>
                    <p className="text-sm text-muted-foreground mb-5">Personalise the highlight color throughout the app.</p>
                    <div className="flex items-center gap-3 flex-wrap">
                      {ACCENT_COLORS.map(({ label, value }) => (
                        <button
                          key={value}
                          onClick={() => setAppearanceProp("accentColor", value)}
                          title={label}
                          className={`w-9 h-9 rounded-full transition-all ring-offset-2 ${defaultAppearance.accentColor === value ? "ring-2 ring-foreground" : "hover:scale-110"}`}
                          style={{ background: value }}
                        >
                          {defaultAppearance.accentColor === value && (
                            <Check className="w-4 h-4 text-white mx-auto" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl shadow-sm border-0 p-6">
                    <h2 className="font-heading font-bold text-lg mb-4">Preferences</h2>
                    <SettingRow label="Compact Mode" description="Reduce spacing for a denser layout.">
                      <Toggle checked={defaultAppearance.compactMode} onChange={(v) => setAppearanceProp("compactMode", v)} />
                    </SettingRow>
                    <div className="pt-4">
                      <label className={labelCls}>Date Format</label>
                      <div className="grid grid-cols-3 gap-2 mt-1">
                        {(["MM/DD/YYYY", "DD/MM/YYYY", "YYYY-MM-DD"] as const).map((fmt) => (
                          <button
                            key={fmt}
                            onClick={() => setAppearanceProp("dateFormat", fmt)}
                            className={`px-3 py-2 rounded-xl text-xs font-medium border-2 transition-all ${
                              defaultAppearance.dateFormat === fmt
                                ? "border-primary bg-primary/5 text-primary"
                                : "border-border text-muted-foreground hover:border-primary/30"
                            }`}
                          >
                            {fmt}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </>
              )}

            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
