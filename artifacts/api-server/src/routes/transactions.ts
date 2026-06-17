import { Router } from "express";
import { db, transactionsTable } from "@workspace/db";
import { eq, and, gte, lte, sql } from "drizzle-orm";
import OpenAI from "openai";
import {
  ListTransactionsQueryParams,
  CreateTransactionBody,
  DeleteTransactionParams,
} from "@workspace/api-zod";

const router = Router();

const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

router.get("/transactions/summary", async (_req, res) => {
  try {
    const all = await db.select().from(transactionsTable);
    let totalIncome = 0;
    let totalExpense = 0;
    const categoryMap: Record<string, number> = {};

    for (const t of all) {
      const amount = parseFloat(t.amount);
      if (t.type === "income") {
        totalIncome += amount;
      } else {
        totalExpense += amount;
        categoryMap[t.category] = (categoryMap[t.category] ?? 0) + amount;
      }
    }

    const topCategory =
      Object.entries(categoryMap).sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;

    res.json({
      totalIncome: Math.round(totalIncome * 100) / 100,
      totalExpense: Math.round(totalExpense * 100) / 100,
      netBalance: Math.round((totalIncome - totalExpense) * 100) / 100,
      topCategory,
      transactionCount: all.length,
    });
  } catch {
    res.status(500).json({ error: "Failed to compute summary" });
  }
});

router.get("/transactions/by-category", async (_req, res) => {
  try {
    const rows = await db
      .select({
        category: transactionsTable.category,
        total: sql<number>`CAST(SUM(${transactionsTable.amount}) AS FLOAT)`,
        count: sql<number>`CAST(COUNT(*) AS INT)`,
      })
      .from(transactionsTable)
      .where(eq(transactionsTable.type, "expense"))
      .groupBy(transactionsTable.category)
      .orderBy(sql`SUM(${transactionsTable.amount}) DESC`);

    res.json(rows);
  } catch {
    res.status(500).json({ error: "Failed to compute category breakdown" });
  }
});

router.get("/transactions/insight", async (_req, res) => {
  try {
    const all = await db.select().from(transactionsTable);

    let totalIncome = 0;
    let totalExpense = 0;
    const categoryMap: Record<string, number> = {};

    for (const t of all) {
      const amount = parseFloat(t.amount);
      if (t.type === "income") {
        totalIncome += amount;
      } else {
        totalExpense += amount;
        categoryMap[t.category] = (categoryMap[t.category] ?? 0) + amount;
      }
    }

    const topEntry = Object.entries(categoryMap).sort((a, b) => b[1] - a[1])[0];
    const savingsRate = totalIncome > 0 ? (totalIncome - totalExpense) / totalIncome : 0;

    if (all.length === 0) {
      res.json({
        type: "neutral",
        message: "Add your first transaction to get a personalized AI insight about your spending patterns and financial health.",
        detail: "No transactions recorded yet — start logging to unlock insights.",
      });
      return;
    }

    const ruleBasedDetail = getRuleBasedNote(totalIncome, totalExpense, topEntry, savingsRate);
    const ruleType = getInsightType(totalIncome, totalExpense, savingsRate, topEntry);

    if (openai) {
      try {
        const categoryBreakdown = Object.entries(categoryMap)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5)
          .map(([cat, amt]) => `${cat}: $${amt.toFixed(2)}`)
          .join(", ");

        const prompt = `You are a friendly, direct personal finance coach. Analyze this user's spending data and write ONE concise paragraph (3-4 sentences) of personalized, actionable financial insight. Be specific with numbers. Sound like a knowledgeable friend, not a robot.

Financial data:
- Total Income: $${totalIncome.toFixed(2)}
- Total Expenses: $${totalExpense.toFixed(2)}
- Net Balance: $${(totalIncome - totalExpense).toFixed(2)}
- Savings Rate: ${Math.round(savingsRate * 100)}%
- Top spending categories: ${categoryBreakdown}
- Total transactions: ${all.length}

Write a 3-4 sentence insight paragraph only. No headers, no bullets. Be specific and encouraging.`;

        const response = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [{ role: "user", content: prompt }],
          max_tokens: 180,
          temperature: 0.7,
        });

        const aiText = response.choices[0]?.message?.content?.trim() ?? "";

        if (aiText) {
          res.json({
            type: ruleType,
            message: aiText,
            detail: ruleBasedDetail,
          });
          return;
        }
      } catch {
        // Fall through to rule-based
      }
    }

    res.json({
      type: ruleType,
      message: getRuleBasedMessage(totalIncome, totalExpense, savingsRate, topEntry),
      detail: ruleBasedDetail,
    });
  } catch {
    res.status(500).json({ error: "Failed to generate insight" });
  }
});

function getInsightType(
  income: number,
  expense: number,
  rate: number,
  top?: [string, number]
): "warning" | "positive" | "neutral" | "tip" {
  if (expense > income) return "warning";
  if (top && expense > 0 && top[1] / expense >= 0.4) return "warning";
  if (rate >= 0.2) return "positive";
  if (rate < 0.1) return "tip";
  return "neutral";
}

function getRuleBasedMessage(
  income: number,
  expense: number,
  rate: number,
  top?: [string, number]
): string {
  if (expense > income) {
    return `Your spending of $${expense.toFixed(2)} exceeds your income of $${income.toFixed(2)} by $${(expense - income).toFixed(2)}. Reviewing your largest expense categories could help bring the balance back into positive territory quickly.`;
  }
  if (top && expense > 0 && top[1] / expense >= 0.4) {
    const pct = Math.round((top[1] / expense) * 100);
    return `You're in decent shape with a $${(income - expense).toFixed(2)} net balance — that's ${Math.round(rate * 100)}% of your income saved. Your biggest opportunity is ${top[0]} at $${top[1].toFixed(2)}, which is ${pct}% of total expenses. Setting a monthly budget for it could unlock significant savings.`;
  }
  if (rate >= 0.2) {
    return `Strong work — you're saving ${Math.round(rate * 100)}% of your income with a net balance of $${(income - expense).toFixed(2)}. Your spending is well-distributed across categories. Keep this momentum and consider directing surplus funds into an emergency fund or investment account.`;
  }
  return `Your finances are balanced with a ${Math.round(rate * 100)}% savings rate and net balance of $${(income - expense).toFixed(2)}. Small, consistent cuts in your top spending categories could meaningfully improve your savings rate over time.`;
}

function getRuleBasedNote(
  income: number,
  expense: number,
  top?: [string, number],
  rate?: number
): string {
  if (expense > income) return `Spending exceeds income by $${(expense - income).toFixed(2)}.`;
  if (top && expense > 0) {
    const pct = Math.round((top[1] / expense) * 100);
    return `${top[0]} is ${pct}% of expenses — ${pct >= 40 ? "heavy" : "notable"} concentration in a single category.`;
  }
  return `Savings rate: ${Math.round((rate ?? 0) * 100)}% — ${(rate ?? 0) >= 0.2 ? "above the recommended 20% target." : "below the recommended 20% target."}`;
}

router.get("/transactions", async (req, res) => {
  try {
    const parseResult = ListTransactionsQueryParams.safeParse(req.query);
    if (!parseResult.success) {
      res.status(400).json({ error: "Invalid query parameters" });
      return;
    }

    const { category, type, startDate, endDate } = parseResult.data;
    const conditions = [];
    if (category) conditions.push(eq(transactionsTable.category, category));
    if (type) conditions.push(eq(transactionsTable.type, type as "income" | "expense"));
    if (startDate) conditions.push(gte(transactionsTable.date, startDate));
    if (endDate) conditions.push(lte(transactionsTable.date, endDate));

    const rows = await db
      .select()
      .from(transactionsTable)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(sql`${transactionsTable.date} DESC, ${transactionsTable.createdAt} DESC`);

    res.json(
      rows.map((r) => ({
        ...r,
        amount: parseFloat(r.amount),
        createdAt: r.createdAt.toISOString(),
      }))
    );
  } catch {
    res.status(500).json({ error: "Failed to fetch transactions" });
  }
});

router.post("/transactions", async (req, res) => {
  try {
    const parseResult = CreateTransactionBody.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({ error: "Invalid request body" });
      return;
    }

    const { amount, category, type, date, note } = parseResult.data;
    const [created] = await db
      .insert(transactionsTable)
      .values({ amount: amount.toString(), category, type, date, note: note ?? null })
      .returning();

    res.status(201).json({
      ...created,
      amount: parseFloat(created.amount),
      createdAt: created.createdAt.toISOString(),
    });
  } catch {
    res.status(500).json({ error: "Failed to create transaction" });
  }
});

router.delete("/transactions/:id", async (req, res) => {
  try {
    const parseResult = DeleteTransactionParams.safeParse({ id: parseInt(req.params.id, 10) });
    if (!parseResult.success) {
      res.status(400).json({ error: "Invalid transaction ID" });
      return;
    }

    const deleted = await db
      .delete(transactionsTable)
      .where(eq(transactionsTable.id, parseResult.data.id))
      .returning();

    if (deleted.length === 0) {
      res.status(404).json({ error: "Transaction not found" });
      return;
    }

    res.json({ success: true });
  } catch {
    res.status(500).json({ error: "Failed to delete transaction" });
  }
});

export default router;
