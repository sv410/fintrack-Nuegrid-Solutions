import { Layout } from "@/components/layout";
import { useGetTransactionSummary, useListTransactions, useGetSpendingByCategory, useGetSpendingInsight } from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { TransactionList } from "@/components/transaction-list";
import { TransactionForm } from "@/components/transaction-form";
import { SpendingChart } from "@/components/spending-chart";
import { InsightCard } from "@/components/insight-card";
import { ArrowDownRight, ArrowUpRight, TrendingUp, Wallet } from "lucide-react";

export default function Dashboard() {
  const { data: summary, isLoading: loadingSummary } = useGetTransactionSummary({ query: { enabled: true } });
  const { data: transactions, isLoading: loadingTransactions } = useListTransactions(undefined, { query: { enabled: true } });
  const { data: spending, isLoading: loadingSpending } = useGetSpendingByCategory({ query: { enabled: true } });
  const { data: insight, isLoading: loadingInsight } = useGetSpendingInsight({ query: { enabled: true } });

  const formatCurrency = (val: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);

  return (
    <Layout>
      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-6xl mx-auto space-y-8">
          
          <header className="flex items-end justify-between">
            <div>
              <h1 className="text-3xl font-heading font-bold tracking-tight mb-2">Dashboard</h1>
              <p className="text-muted-foreground">Your financial health at a glance.</p>
            </div>
            <TransactionForm />
          </header>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-white border-0 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 text-muted-foreground mb-4">
                  <Wallet className="w-4 h-4" />
                  <span className="font-medium text-sm">Net Balance</span>
                </div>
                {loadingSummary ? <Skeleton className="h-8 w-32" /> : (
                  <div className="text-3xl font-heading font-bold">
                    {summary ? formatCurrency(summary.netBalance) : '$0.00'}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="bg-white border-0 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 text-muted-foreground mb-4">
                  <ArrowUpRight className="w-4 h-4 text-emerald-500" />
                  <span className="font-medium text-sm">Total Income</span>
                </div>
                {loadingSummary ? <Skeleton className="h-8 w-32" /> : (
                  <div className="text-3xl font-heading font-bold">
                    {summary ? formatCurrency(summary.totalIncome) : '$0.00'}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="bg-white border-0 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 text-muted-foreground mb-4">
                  <ArrowDownRight className="w-4 h-4 text-destructive" />
                  <span className="font-medium text-sm">Total Expense</span>
                </div>
                {loadingSummary ? <Skeleton className="h-8 w-32" /> : (
                  <div className="text-3xl font-heading font-bold">
                    {summary ? formatCurrency(summary.totalExpense) : '$0.00'}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="bg-white border-0 shadow-sm bg-gradient-to-br from-primary/10 to-transparent">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 text-primary mb-4">
                  <TrendingUp className="w-4 h-4" />
                  <span className="font-medium text-sm">Top Category</span>
                </div>
                {loadingSummary ? <Skeleton className="h-8 w-32 bg-primary/20" /> : (
                  <div className="text-2xl font-heading font-bold text-primary truncate">
                    {summary?.topCategory || 'N/A'}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <Card className="bg-white border-0 shadow-sm">
                <div className="p-6 border-b border-border/50">
                  <h3 className="font-heading font-bold text-lg">Spending by Category</h3>
                </div>
                <CardContent className="p-6">
                  {loadingSpending ? (
                    <div className="h-[300px] flex items-center justify-center">
                      <Skeleton className="w-full h-full rounded-xl" />
                    </div>
                  ) : (
                    <SpendingChart data={spending || []} />
                  )}
                </CardContent>
              </Card>

              <Card className="bg-white border-0 shadow-sm">
                <div className="p-6 border-b border-border/50">
                  <h3 className="font-heading font-bold text-lg">Recent Transactions</h3>
                </div>
                <CardContent className="p-0">
                  {loadingTransactions ? (
                    <div className="p-6 space-y-4">
                      {[1,2,3].map(i => <Skeleton key={i} className="h-16 w-full" />)}
                    </div>
                  ) : (
                    <TransactionList transactions={transactions || []} />
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="space-y-8">
              {loadingInsight ? (
                <Skeleton className="h-48 w-full rounded-2xl" />
              ) : insight ? (
                <InsightCard insight={insight} />
              ) : null}
            </div>
          </div>

        </div>
      </div>
    </Layout>
  );
}
