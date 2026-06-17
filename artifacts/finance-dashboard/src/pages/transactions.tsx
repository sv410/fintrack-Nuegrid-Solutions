import { Layout } from "@/components/layout";
import { useListTransactions } from "@workspace/api-client-react";
import { TransactionList } from "@/components/transaction-list";
import { TransactionForm } from "@/components/transaction-form";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";

const CATEGORIES = ["Food", "Transport", "Shopping", "Rent", "Utilities", "Groceries", "Entertainment", "Subscriptions", "Health", "Education", "Other"];

export default function TransactionsPage() {
  const [category, setCategory] = useState<string>("");
  const [type, setType] = useState<string>("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const params = {
    ...(category ? { category } : {}),
    ...(type ? { type } : {}),
    ...(startDate ? { startDate } : {}),
    ...(endDate ? { endDate } : {}),
  };

  const { data: transactions, isLoading } = useListTransactions(
    Object.keys(params).length > 0 ? params : undefined,
    { query: { enabled: true } }
  );

  const hasFilters = !!(category || type || startDate || endDate);

  const clearFilters = () => {
    setCategory("");
    setType("");
    setStartDate("");
    setEndDate("");
  };

  return (
    <Layout>
      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-4xl mx-auto space-y-6">

          <header className="flex items-end justify-between">
            <div>
              <p className="text-xs font-semibold tracking-[0.15em] uppercase text-muted-foreground mb-2">Manage</p>
              <h1 className="text-4xl font-heading font-bold tracking-tight">Transactions</h1>
            </div>
            <TransactionForm />
          </header>

          <div className="bg-white rounded-2xl border-0 shadow-sm p-5">
            <div className="flex items-center gap-2 mb-4">
              <SlidersHorizontal className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-semibold">Filters</span>
              {hasFilters && (
                <button
                  onClick={clearFilters}
                  className="ml-auto text-xs text-muted-foreground hover:text-foreground underline underline-offset-2 transition-colors"
                >
                  Clear all
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div>
                <label className="block text-[10px] font-bold tracking-[0.12em] uppercase text-muted-foreground mb-1.5">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 transition-all appearance-none"
                >
                  <option value="">All categories</option>
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold tracking-[0.12em] uppercase text-muted-foreground mb-1.5">
                  Type
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 transition-all appearance-none"
                >
                  <option value="">All types</option>
                  <option value="income">Income</option>
                  <option value="expense">Expense</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold tracking-[0.12em] uppercase text-muted-foreground mb-1.5">
                  From
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 transition-all"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold tracking-[0.12em] uppercase text-muted-foreground mb-1.5">
                  To
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 transition-all"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border-0 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-border/50 flex items-center gap-2">
              <Search className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-semibold">
                {isLoading ? "Loading…" : `${transactions?.length ?? 0} transaction${transactions?.length === 1 ? "" : "s"}`}
              </span>
              {hasFilters && (
                <span className="text-xs text-muted-foreground">— filtered</span>
              )}
            </div>

            {isLoading ? (
              <div className="p-6 space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Skeleton key={i} className="h-14 w-full rounded-xl" />
                ))}
              </div>
            ) : (
              <TransactionList transactions={transactions ?? []} />
            )}
          </div>

        </div>
      </div>
    </Layout>
  );
}
