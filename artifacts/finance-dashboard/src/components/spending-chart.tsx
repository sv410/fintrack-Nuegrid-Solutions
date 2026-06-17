import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import type { CategorySpending } from "@workspace/api-client-react";

const COLORS = [
  "hsl(14, 80%, 54%)",
  "hsl(24, 80%, 65%)",
  "hsl(34, 80%, 75%)",
  "hsl(44, 80%, 85%)",
  "hsl(54, 80%, 90%)",
];

export function SpendingChart({ data }: { data: CategorySpending[] }) {
  if (!data?.length) {
    return (
      <div className="h-[300px] flex flex-col items-center justify-center text-muted-foreground">
        <div className="w-16 h-16 rounded-full border-4 border-dashed border-border mb-4" />
        <p>No spending data available.</p>
      </div>
    );
  }

  return (
    <div className="h-[300px] w-full pt-4">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={80}
            outerRadius={110}
            paddingAngle={3}
            dataKey="total"
            nameKey="category"
            stroke="none"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number) => [`$${value.toFixed(2)}`, "Spent"]}
            contentStyle={{ 
              borderRadius: '16px', 
              border: 'none', 
              boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)',
              backgroundColor: 'hsl(var(--card))',
              color: 'hsl(var(--foreground))',
              fontWeight: 500
            }}
            itemStyle={{ color: 'hsl(var(--foreground))' }}
          />
          <Legend 
            verticalAlign="bottom" 
            height={36} 
            iconType="circle"
            formatter={(value) => <span className="text-foreground font-medium ml-1">{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
