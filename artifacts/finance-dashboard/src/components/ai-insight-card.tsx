import { Sparkles, Diamond } from "lucide-react";
import type { SpendingInsight } from "@workspace/api-client-react";

export function AiInsightCard({ insight, isLoading }: { insight?: SpendingInsight; isLoading?: boolean }) {
  if (isLoading) {
    return (
      <div className="rounded-2xl p-6 animate-pulse" style={{ background: "#111" }}>
        <div className="h-4 w-20 rounded bg-white/10 mb-4" />
        <div className="h-6 w-40 rounded bg-white/10 mb-4" />
        <div className="space-y-2">
          <div className="h-3 w-full rounded bg-white/10" />
          <div className="h-3 w-5/6 rounded bg-white/10" />
          <div className="h-3 w-4/6 rounded bg-white/10" />
        </div>
      </div>
    );
  }

  if (!insight) return null;

  const ruleText = getRuleText(insight);

  return (
    <div
      className="rounded-2xl p-6 flex flex-col gap-4"
      style={{ background: "#111", color: "#fff" }}
    >
      <div className="flex items-center gap-2">
        <Sparkles className="w-3.5 h-3.5" style={{ color: "#E8572A" }} />
        <span
          className="text-[10px] font-bold tracking-[0.18em] uppercase"
          style={{ color: "#E8572A" }}
        >
          AI Coach
        </span>
      </div>

      <div>
        <h3 className="text-xl font-bold text-white mb-3 font-heading tracking-tight">
          Smart Insight
        </h3>
        <p className="text-white/65 text-sm leading-relaxed">
          {insight.message}
        </p>
      </div>

      <div
        className="mt-2 pt-4 border-t flex items-start gap-2"
        style={{ borderColor: "rgba(255,255,255,0.08)" }}
      >
        <Diamond className="w-3 h-3 mt-0.5 shrink-0" style={{ color: "rgba(255,255,255,0.3)" }} />
        <div>
          <p
            className="text-[10px] font-bold tracking-[0.15em] uppercase mb-1"
            style={{ color: "rgba(255,255,255,0.3)" }}
          >
            Rule-Based
          </p>
          <p className="text-white/50 text-xs leading-relaxed">{ruleText}</p>
        </div>
      </div>
    </div>
  );
}

function getRuleText(insight: SpendingInsight): string {
  if (insight.detail) return insight.detail;
  switch (insight.type) {
    case "warning":
      return "Spending pattern detected — review your top categories.";
    case "positive":
      return "Financial health looks strong — maintain current habits.";
    case "tip":
      return "Small adjustments in key categories can compound over time.";
    default:
      return "Keep logging transactions to unlock deeper insights.";
  }
}
