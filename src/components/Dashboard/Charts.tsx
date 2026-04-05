import React from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend, AreaChart, Area 
} from 'recharts';
import { useFinance } from '../../context/FinanceContext';
import { formatCurrency } from '../../lib/utils';
import { motion } from 'motion/react';

export function Charts() {
  const { transactions, isDarkMode, displayCurrency, convertAmount } = useFinance();

  // Prepare data for line chart (Balance trend)
  const sortedTransactions = [...transactions].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  let currentBalance = 0;
  const lineData = sortedTransactions.map((t) => {
    const convertedAmount = convertAmount(t.amount);
    currentBalance += t.type === 'income' ? convertedAmount : -convertedAmount;
    return { date: t.date, balance: currentBalance };
  });

  // Prepare data for pie chart (Category breakdown)
  const categoryDataMap = transactions
    .filter((t) => t.type === 'expense')
    .reduce((acc, t) => {
      const convertedAmount = convertAmount(t.amount);
      acc[t.category] = (acc[t.category] || 0) + convertedAmount;
      return acc;
    }, {} as Record<string, number>);

  const pieData = Object.entries(categoryDataMap).map(([name, value]) => ({ name, value }));

  const COLORS = ['#6366f1', '#10b981', '#f43f5e', '#f59e0b', '#8b5cf6', '#ec4899'];

  const chartTheme = {
    stroke: isDarkMode ? '#cbd5e1' : '#64748b',
    fill: isDarkMode ? '#1e293b' : '#f8fafc',
    grid: isDarkMode ? '#334155' : '#e2e8f0',
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm"
      >
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Balance Trend</h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={lineData}>
              <defs>
                <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={chartTheme.grid} />
              <XAxis 
                dataKey="date" 
                stroke={chartTheme.stroke}
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(str) => new Date(str).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
              />
              <YAxis 
                stroke={chartTheme.stroke}
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(val) => `$${val}`}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: isDarkMode ? '#0f172a' : '#fff',
                  border: `1px solid ${chartTheme.grid}`,
                  borderRadius: '12px',
                  color: isDarkMode ? '#fff' : '#000'
                }}
                formatter={(val: number) => [formatCurrency(val, displayCurrency), 'Balance']}
              />
              <Area 
                type="monotone" 
                dataKey="balance" 
                stroke="#6366f1" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorBalance)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm"
      >
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Spending by Category</h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: isDarkMode ? '#0f172a' : '#fff',
                  border: `1px solid ${chartTheme.grid}`,
                  borderRadius: '12px'
                }}
                formatter={(val: number) => [formatCurrency(val, displayCurrency), 'Spent']}
              />
              <Legend verticalAlign="bottom" height={36}/>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </div>
  );
}
