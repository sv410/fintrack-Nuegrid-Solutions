import { Router } from "express";
import { db, transactionsTable } from "@workspace/db";
import { eq, and, gte, lte, sql } from "drizzle-orm";
import {
  ListTransactionsQueryParams,
  CreateTransactionBody,
  DeleteTransactionParams,
} from "@workspace/api-zod";

const router = Router();

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
  } catch (err) {
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
  } catch (err) {
    res.status(500).json({ error: "Failed to compute category breakdown" });
  }
});

router.get("/transactions/insight", async (_req, res) => {
  try {
    const all = await db.select().from(transactionsTable);

    let totalIncome = 0;
    let totalExpense = 0;
    const categoryMap: Record<string, number> = {};
    const recent30 = new Date();
    recent30.setDate(recent30.getDate() - 30);

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
        message: "No transactions yet",
        detail: "Add your first transaction to start getting personalized insights about your spending.",
      });
      return;
    }

    if (totalExpense > totalIncome) {
      res.json({
        type: "warning",
        message: "Spending exceeds income",
        detail: `You've spent $${(totalExpense - totalIncome).toFixed(2)} more than you've earned. Consider reviewing your ${topEntry?.[0] ?? "largest"} expenses.`,
      });
      return;
    }

    if (topEntry && totalExpense > 0) {
      const pct = Math.round((topEntry[1] / totalExpense) * 100);
      if (pct >= 40) {
        res.json({
          type: "warning",
          message: `${topEntry[0]} is ${pct}% of your spending`,
          detail: `This category dominates your expenses. Reviewing it could free up significant budget.`,
        });
        return;
      }
    }

    if (savingsRate >= 0.2) {
      res.json({
        type: "positive",
        message: `Strong savings rate: ${Math.round(savingsRate * 100)}%`,
        detail: `You're saving ${Math.round(savingsRate * 100)}% of your income. That puts you ahead of most people — keep it up.`,
      });
      return;
    }

    if (savingsRate > 0 && savingsRate < 0.1) {
      res.json({
        type: "tip",
        message: "Savings rate is low",
        detail: `You're saving ${Math.round(savingsRate * 100)}% of your income. Financial experts recommend saving at least 20%. Small cuts in "${topEntry?.[0] ?? "top categories"}" could make a big difference.`,
      });
      return;
    }

    res.json({
      type: "neutral",
      message: "Finances look balanced",
      detail: `Income and expenses are well-matched. Savings rate: ${Math.round(savingsRate * 100)}%. Keep tracking to spot trends over time.`,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to generate insight" });
  }
});

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

    const mapped = rows.map((r) => ({
      ...r,
      amount: parseFloat(r.amount),
      createdAt: r.createdAt.toISOString(),
    }));

    res.json(mapped);
  } catch (err) {
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
      .values({
        amount: amount.toString(),
        category,
        type,
        date,
        note: note ?? null,
      })
      .returning();

    res.status(201).json({
      ...created,
      amount: parseFloat(created.amount),
      createdAt: created.createdAt.toISOString(),
    });
  } catch (err) {
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
  } catch (err) {
    res.status(500).json({ error: "Failed to delete transaction" });
  }
});

export default router;
