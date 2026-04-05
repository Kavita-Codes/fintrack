import React from 'react';
import { Wallet, ArrowUpCircle, ArrowDownCircle, TrendingUp } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { formatCurrency, cn, convertAmount } from '../../lib/utils';
import { motion } from 'motion/react';

export function Summary() {
  const { transactions, displayCurrency, convertAmount } = useFinance();

  const income = transactions
    .filter((t) => t.type === 'income')
    .reduce((acc, t) => acc + t.amount, 0);

  const expenses = transactions
    .filter((t) => t.type === 'expense')
    .reduce((acc, t) => acc + t.amount, 0);

  const balance = income - expenses;

  const stats = [
    { label: 'Total Balance', value: balance, icon: Wallet, color: 'indigo' },
    { label: 'Total Income', value: income, icon: ArrowUpCircle, color: 'emerald' },
    { label: 'Total Expenses', value: expenses, icon: ArrowDownCircle, color: 'rose' },
  ];

  const getIconClasses = (color: string) => {
    switch (color) {
      case 'indigo': return 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400';
      case 'emerald': return 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400';
      case 'rose': return 'bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400';
      default: return 'bg-slate-50 dark:bg-slate-900/20 text-slate-600 dark:text-slate-400';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-200"
        >
          <div className="flex items-center justify-between mb-4">
            <div className={cn("p-3 rounded-xl", getIconClasses(stat.color))}>
              <stat.icon size={24} />
            </div>
            <div className="flex items-center gap-1 text-xs font-medium text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded-lg">
              <TrendingUp size={12} />
              <span>+2.4%</span>
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{stat.label}</p>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
              {formatCurrency(convertAmount(stat.value), displayCurrency)}
            </h3>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
