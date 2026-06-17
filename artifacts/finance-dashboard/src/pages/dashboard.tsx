import { Layout } from "@/components/layout";
import {
  useGetTransactionSummary,
  useListTransactions,
  useGetSpendingByCategory,
  useGetSpendingInsight,
} from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { TransactionList } from "@/components/transaction-list";
import { TransactionForm } from "@/components/transaction-form";
import { SpendingChart } from "@/components/spending-chart";
import { AiInsightCard } from "@/components/ai-insight-card";
import { ArrowDownRight, ArrowUpRight, TrendingUp, Wallet } from "lucide-react";
import { useAuth } from "@/lib/auth";

export default function Dashboard() {
  const { user } = useAuth();
  const { data: summary, isLoading: loadingSummary } = useGetTransactionSummary({ query: { enabled: true } });
  const { data: transactions, isLoading: loadingTransactions } = useListTransactions(undefined, { query: { enabled: true } });
  const { data: spending, isLoading: loadingSpending } = useGetSpendingByCategory({ query: { enabled: true } });
  const { data: insight, isLoading: loadingInsight } = useGetSpendingInsight({ query: { enabled: true } });

  const fmt = (val: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(val);

  return (
    <Layout>
      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-6xl mx-auto space-y-8">

          <header className="flex items-end justify-between">
            <div>
              <p className="text-xs font-semibold tracking-[0.15em] uppercase text-muted-foreground mb-2">
                Dashboard
              </p>
              <h1 className="text-4xl font-heading font-bold tracking-tight">
                Hello, {user?.name ?? "there"}.
              </h1>
            </div>
            <TransactionForm />
          </header>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-white border-0 shadow-sm">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-bold tracking-[0.14em] uppercase text-muted-foreground">
                    Total Income
                  </span>
                  <ArrowUpRight className="w-4 h-4 text-muted-foreground/50" />
                </div>
                {loadingSummary ? (
                  <Skeleton className="h-8 w-28" />
                ) : (
                  <div className="text-2xl font-heading font-bold" style={{ color: "#16a34a" }}>
                    {summary ? fmt(summary.totalIncome) : "$0.00"}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="bg-white border-0 shadow-sm">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-bold tracking-[0.14em] uppercase text-muted-foreground">
                    Total Expense
                  </span>
                  <ArrowDownRight className="w-4 h-4 text-muted-foreground/50" />
                </div>
                {loadingSummary ? (
                  <Skeleton className="h-8 w-28" />
                ) : (
                  <div className="text-2xl font-heading font-bold" style={{ color: "#E8572A" }}>
                    {summary ? fmt(summary.totalExpense) : "$0.00"}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="bg-white border-0 shadow-sm">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-bold tracking-[0.14em] uppercase text-muted-foreground">
                    Net Balance
                  </span>
                  <Wallet className="w-4 h-4 text-muted-foreground/50" />
                </div>
                {loadingSummary ? (
                  <Skeleton className="h-8 w-28" />
                ) : (
                  <div
                    className="text-2xl font-heading font-bold"
                    style={{ color: summary && summary.netBalance >= 0 ? "#16a34a" : "#E8572A" }}
                  >
                    {summary ? fmt(summary.netBalance) : "$0.00"}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="bg-white border-0 shadow-sm">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-bold tracking-[0.14em] uppercase text-muted-foreground">
                    Top Category
                  </span>
                  <TrendingUp className="w-4 h-4 text-muted-foreground/50" />
                </div>
                {loadingSummary ? (
                  <Skeleton className="h-8 w-24" />
                ) : (
                  <div className="text-2xl font-heading font-bold truncate">
                    {summary?.topCategory ?? "N/A"}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card className="bg-white border-0 shadow-sm">
                <CardContent className="p-6">
                  <h3 className="font-heading font-bold text-lg mb-1">By Category</h3>
                  {loadingSpending ? (
                    <div className="h-[300px] flex items-center justify-center">
                      <Skeleton className="w-full h-full rounded-xl" />
                    </div>
                  ) : (
                    <SpendingChart data={spending ?? []} />
                  )}
                </CardContent>
              </Card>

              <Card className="bg-white border-0 shadow-sm">
                <div className="px-6 pt-6 pb-4 border-b border-border/50">
                  <h3 className="font-heading font-bold text-lg">Recent Transactions</h3>
                </div>
                <CardContent className="p-0">
                  {loadingTransactions ? (
                    <div className="p-6 space-y-4">
                      {[1, 2, 3].map((i) => (
                        <Skeleton key={i} className="h-14 w-full rounded-xl" />
                      ))}
                    </div>
                  ) : (
                    <TransactionList transactions={transactions ?? []} />
                  )}
                </CardContent>
              </Card>
            </div>

            <div>
              <AiInsightCard insight={insight} isLoading={loadingInsight} />
            </div>
          </div>

        </div>
      </div>
    </Layout>
  );
}
