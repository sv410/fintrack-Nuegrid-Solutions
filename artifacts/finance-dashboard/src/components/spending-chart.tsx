import { useState } from "react";
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer
} from "recharts";
import type { CategorySpending } from "@workspace/api-client-react";

const COLORS = [
  "hsl(14, 75%, 54%)",
  "hsl(20, 72%, 62%)",
  "hsl(28, 70%, 70%)",
  "hsl(36, 68%, 76%)",
  "hsl(44, 65%, 82%)",
  "hsl(50, 60%, 86%)",
  "hsl(8, 70%, 45%)",
];

type ChartMode = "bar" | "pie";

export function SpendingChart({ data }: { data: CategorySpending[] }) {
  const [mode, setMode] = useState<ChartMode>("bar");

  if (!data?.length) {
    return (
      <div className="h-[300px] flex flex-col items-center justify-center text-muted-foreground">
        <div className="w-16 h-16 rounded-full border-4 border-dashed border-border mb-4" />
        <p className="text-sm">No spending data yet.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs text-muted-foreground uppercase tracking-widest font-medium">Spending</p>
        <div className="flex items-center gap-1 p-1 rounded-lg bg-secondary/60">
          <button
            onClick={() => setMode("bar")}
            className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
              mode === "bar"
                ? "bg-white shadow-sm text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Bar
          </button>
          <button
            onClick={() => setMode("pie")}
            className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
              mode === "pie"
                ? "bg-white shadow-sm text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Pie
          </button>
        </div>
      </div>

      <div className="h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          {mode === "bar" ? (
            <BarChart data={data} barSize={32} margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis
                dataKey="category"
                tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => v.length > 8 ? v.slice(0, 8) + "…" : v}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `$${v}`}
              />
              <Tooltip
                formatter={(value: number) => [`$${value.toFixed(2)}`, "Spent"]}
                contentStyle={{
                  borderRadius: "12px",
                  border: "none",
                  boxShadow: "0 10px 25px -5px rgba(0,0,0,0.12)",
                  backgroundColor: "hsl(var(--card))",
                  color: "hsl(var(--foreground))",
                  fontSize: 13,
                  fontWeight: 500,
                }}
                cursor={{ fill: "hsl(var(--secondary))", radius: 6 }}
              />
              <Bar dataKey="total" radius={[6, 6, 0, 0]} name="Spent">
                {data.map((_, index) => (
                  <Cell key={`bar-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          ) : (
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="45%"
                innerRadius={75}
                outerRadius={105}
                paddingAngle={3}
                dataKey="total"
                nameKey="category"
                stroke="none"
              >
                {data.map((_, index) => (
                  <Cell key={`pie-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number) => [`$${value.toFixed(2)}`, "Spent"]}
                contentStyle={{
                  borderRadius: "12px",
                  border: "none",
                  boxShadow: "0 10px 25px -5px rgba(0,0,0,0.12)",
                  backgroundColor: "hsl(var(--card))",
                  color: "hsl(var(--foreground))",
                  fontSize: 13,
                  fontWeight: 500,
                }}
              />
              <Legend
                verticalAlign="bottom"
                height={40}
                iconType="circle"
                iconSize={8}
                formatter={(value) => (
                  <span style={{ fontSize: 12, color: "hsl(var(--foreground))", marginLeft: 4 }}>
                    {value}
                  </span>
                )}
              />
            </PieChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}
