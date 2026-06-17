import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, CheckCircle2, Info, Lightbulb } from "lucide-react";
import type { SpendingInsight } from "@workspace/api-client-react";

export function InsightCard({ insight }: { insight: SpendingInsight }) {
  const getIcon = () => {
    switch (insight.type) {
      case 'warning': return <AlertCircle className="w-6 h-6 text-destructive" />;
      case 'positive': return <CheckCircle2 className="w-6 h-6 text-emerald-600" />;
      case 'tip': return <Lightbulb className="w-6 h-6 text-amber-600" />;
      case 'neutral': default: return <Info className="w-6 h-6 text-blue-600" />;
    }
  };

  const getBgStyle = () => {
     switch (insight.type) {
      case 'warning': return "bg-destructive/10 border-destructive/20";
      case 'positive': return "bg-emerald-50 border-emerald-200 dark:bg-emerald-950/20 dark:border-emerald-900";
      case 'tip': return "bg-amber-50 border-amber-200 dark:bg-amber-950/20 dark:border-amber-900";
      case 'neutral': default: return "bg-blue-50 border-blue-200 dark:bg-blue-950/20 dark:border-blue-900";
    }
  };

  return (
    <Card className={`border shadow-sm overflow-hidden ${getBgStyle()}`}>
      <div className="h-1 w-full bg-gradient-to-r from-transparent via-current to-transparent opacity-10" />
      <CardContent className="p-6">
        <div className="flex gap-4">
          <div className="shrink-0 mt-0.5">
            <div className="w-12 h-12 rounded-full bg-white/60 dark:bg-black/20 flex items-center justify-center shadow-sm backdrop-blur-sm">
              {getIcon()}
            </div>
          </div>
          <div className="space-y-1.5">
            <h3 className="font-heading font-semibold text-lg text-foreground tracking-tight">
              {insight.message}
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {insight.detail}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
