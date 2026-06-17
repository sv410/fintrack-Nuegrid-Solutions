import { format } from "date-fns";
import { Trash2, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDeleteTransaction, getListTransactionsQueryKey, getGetTransactionSummaryQueryKey, getGetSpendingByCategoryQueryKey, getGetSpendingInsightQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import type { Transaction } from "@workspace/api-client-react";

export function TransactionList({ transactions }: { transactions: Transaction[] }) {
  const queryClient = useQueryClient();
  const deleteTx = useDeleteTransaction();

  const handleDelete = (id: number) => {
    deleteTx.mutate({ id }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListTransactionsQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetTransactionSummaryQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetSpendingByCategoryQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetSpendingInsightQueryKey() });
      }
    });
  };

  if (!transactions?.length) {
    return (
      <div className="p-8 text-center text-muted-foreground flex flex-col items-center justify-center">
        <p>No transactions yet.</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-border/50">
      {transactions.map((tx) => (
        <div key={tx.id} className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors">
          <div className="flex items-center gap-4">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-sm ${tx.type === 'income' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
              {tx.type === 'income' ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownRight className="w-5 h-5" />}
            </div>
            <div>
              <p className="font-heading font-medium text-foreground">{tx.category}</p>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mt-0.5">
                <span>{format(new Date(tx.date), "MMM d, yyyy")}</span>
                {tx.note && (
                  <>
                    <span className="opacity-50">•</span>
                    <span>{tx.note}</span>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className={`font-semibold tracking-tight ${tx.type === 'income' ? 'text-emerald-600' : 'text-rose-600'}`}>
              {tx.type === 'income' ? '+' : '-'}${tx.amount.toFixed(2)}
            </span>
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive hover:bg-destructive/10" onClick={() => handleDelete(tx.id)} disabled={deleteTx.isPending}>
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
