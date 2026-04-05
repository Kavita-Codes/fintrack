import React from 'react';
import { FinanceProvider, useFinance } from './context/FinanceContext';
import { Summary } from './components/Dashboard/Summary';
import { Charts } from './components/Dashboard/Charts';
import { TransactionList } from './components/Transactions/TransactionList';
import { InsightsSection } from './components/Insights/InsightsSection';
import { TrendingUp } from 'lucide-react';

function DashboardContent() {
  const { role, setRole, displayCurrency, setDisplayCurrency } = useFinance();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-200">
      {/* Navbar */}
      <nav className="sticky top-0 z-40 w-full bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 sm:px-8 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200 dark:shadow-none">
              <TrendingUp size={24} />
            </div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">FinTrack</h1>
          </div>

          <div className="flex items-center gap-4 sm:gap-6">
            {/* Currency Switcher */}
            <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
              <span className="hidden sm:inline text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Currency:</span>
              <select 
                value={displayCurrency}
                onChange={(e) => setDisplayCurrency(e.target.value as any)}
                className="bg-transparent text-sm font-bold text-slate-900 dark:text-white focus:outline-none cursor-pointer"
              >
                <option value="USD">USD ($)</option>
                <option value="INR">INR (₹)</option>
              </select>
            </div>

            {/* Role Switcher in Navbar */}
            <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
              <span className="hidden sm:inline text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Role:</span>
              <select 
                value={role}
                onChange={(e) => setRole(e.target.value as any)}
                className="bg-transparent text-sm font-bold text-slate-900 dark:text-white focus:outline-none cursor-pointer"
              >
                <option value="Admin">Admin</option>
                <option value="Viewer">Viewer</option>
              </select>
            </div>
          </div>
        </div>
      </nav>
      
      <main className="max-w-7xl mx-auto p-4 sm:p-8">
        {/* Header */}
        <header className="mb-8">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Welcome back!</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Here's what's happening with your money today.</p>
        </header>

        {/* Dashboard Sections */}
        <Summary />
        <InsightsSection />
        <Charts />
        <TransactionList />
        
        <footer className="mt-12 py-8 border-t border-slate-200 dark:border-slate-800 text-center text-slate-400 text-sm">
          <p>© 2026 FinTrack. Built with React & Tailwind CSS.</p>
        </footer>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <FinanceProvider>
      <DashboardContent />
    </FinanceProvider>
  );
}
