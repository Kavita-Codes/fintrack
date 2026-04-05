import React from 'react';
import { Lightbulb, TrendingDown, TrendingUp, AlertCircle } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { formatCurrency } from '../../lib/utils';
import { motion } from 'motion/react';

export function InsightsSection() {
  const { transactions, displayCurrency, convertAmount } = useFinance();

  const expenses = transactions.filter((t) => t.type === 'expense');
  
  // Highest spending category
  const categoryMap = expenses.reduce((acc, t) => {
    const convertedAmount = convertAmount(t.amount);
    acc[t.category] = (acc[t.category] || 0) + convertedAmount;
    return acc;
  }, {} as Record<string, number>);

  const categoryEntries = Object.entries(categoryMap) as [string, number][];
  const highestCategory = categoryEntries.length > 0 
    ? categoryEntries.sort((a, b) => b[1] - a[1])[0] 
    : null;

  // Monthly comparison (Current vs Previous)
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const currentMonthExpenses = expenses
    .filter((t) => {
      const d = new Date(t.date);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    })
    .reduce((acc, t) => acc + convertAmount(t.amount), 0);

  const prevMonthExpenses = expenses
    .filter((t) => {
      const d = new Date(t.date);
      const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
      const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;
      return d.getMonth() === prevMonth && d.getFullYear() === prevYear;
    })
    .reduce((acc, t) => acc + convertAmount(t.amount), 0);

  const diff = currentMonthExpenses - prevMonthExpenses;
  const percentChange = prevMonthExpenses === 0 ? 100 : (diff / prevMonthExpenses) * 100;

  return (
    <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-indigo-600 p-6 rounded-2xl text-white shadow-xl shadow-indigo-200 dark:shadow-none relative overflow-hidden"
      >
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4 opacity-80">
            <Lightbulb size={20} />
            <span className="text-sm font-semibold uppercase tracking-wider">Top Spending Insight</span>
          </div>
          {highestCategory ? (
            <>
              <h4 className="text-2xl font-bold mb-2">You've spent the most on {highestCategory[0]}</h4>
              <p className="text-indigo-100 text-sm">
                Totaling <span className="font-bold">{formatCurrency(highestCategory[1], displayCurrency)}</span>. 
                Consider setting a budget for this category to save more.
              </p>
            </>
          ) : (
            <p className="text-sm">No expense data available yet.</p>
          )}
        </div>
        <div className="absolute -right-8 -bottom-8 opacity-10">
          <Lightbulb size={120} />
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm"
      >
        <div className="flex items-center gap-2 mb-4 text-slate-500 dark:text-slate-400">
          <TrendingUp size={20} />
          <span className="text-sm font-semibold uppercase tracking-wider">Monthly Comparison</span>
        </div>
        <div className="flex items-end justify-between">
          <div>
            <h4 className="text-3xl font-bold text-slate-900 dark:text-white">
              {formatCurrency(currentMonthExpenses, displayCurrency)}
            </h4>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Spent this month</p>
          </div>
          <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-bold ${
            diff > 0 ? 'bg-rose-50 dark:bg-rose-900/20 text-rose-600' : 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600'
          }`}>
            {diff > 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
            <span>{Math.abs(percentChange).toFixed(1)}%</span>
          </div>
        </div>
        <div className="mt-4 flex items-center gap-2 text-xs text-slate-400">
          <AlertCircle size={14} />
          <span>Compared to {formatCurrency(prevMonthExpenses, displayCurrency)} last month</span>
        </div>
      </motion.div>
    </div>
  );
}
