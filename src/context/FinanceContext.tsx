import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type TransactionType = 'income' | 'expense';
export type Currency = 'USD' | 'INR';

export interface Transaction {
  id: string;
  date: string;
  amount: number;
  currency: Currency;
  category: string;
  type: TransactionType;
  description: string;
}

export type Role = 'Admin' | 'Viewer';

interface FinanceContextType {
  transactions: Transaction[];
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  deleteTransaction: (id: string) => void;
  role: Role;
  setRole: (role: Role) => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  displayCurrency: Currency;
  setDisplayCurrency: (currency: Currency) => void;
  exchangeRate: number;
  convertAmount: (amountInUsd: number) => number;
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

const EXCHANGE_RATE = 83.45;

const MOCK_DATA: Transaction[] = [
  { id: '1', date: '2026-04-01', amount: 2500, currency: 'USD', category: 'Salary', type: 'income', description: 'Monthly paycheck' },
  { id: '2', date: '2026-04-02', amount: 120, currency: 'USD', category: 'Food', type: 'expense', description: 'Grocery shopping' },
  { id: '3', date: '2026-04-03', amount: 45, currency: 'USD', category: 'Transport', type: 'expense', description: 'Uber ride' },
  { id: '4', date: '2026-04-04', amount: 800, currency: 'USD', category: 'Rent', type: 'expense', description: 'April rent' },
  { id: '5', date: '2026-04-05', amount: 150, currency: 'USD', category: 'Entertainment', type: 'expense', description: 'Movie night' },
  { id: '6', date: '2026-03-28', amount: 200, currency: 'USD', category: 'Freelance', type: 'income', description: 'Logo design' },
];

export function FinanceProvider({ children }: { children: ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('transactions');
    return saved ? JSON.parse(saved) : MOCK_DATA;
  });

  const [displayCurrency, setDisplayCurrency] = useState<Currency>(() => {
    const saved = localStorage.getItem('displayCurrency');
    return (saved as Currency) || 'USD';
  });

  const [role, setRole] = useState<Role>(() => {
    const saved = localStorage.getItem('userRole');
    return (saved as Role) || 'Admin';
  });

  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved === 'true';
  });

  useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('userRole', role);
  }, [role]);

  useEffect(() => {
    localStorage.setItem('darkMode', isDarkMode.toString());
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  useEffect(() => {
    localStorage.setItem('displayCurrency', displayCurrency);
  }, [displayCurrency]);

  const addTransaction = (newTx: Omit<Transaction, 'id'>) => {
    const transaction: Transaction = {
      ...newTx,
      id: Math.random().toString(36).substr(2, 9),
    };
    setTransactions((prev) => [transaction, ...prev]);
  };

  const deleteTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((tx) => tx.id !== id));
  };

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  const convertAmount = (amountInUsd: number) => {
    return displayCurrency === 'INR' ? amountInUsd * EXCHANGE_RATE : amountInUsd;
  };

  return (
    <FinanceContext.Provider value={{ 
      transactions, 
      addTransaction, 
      deleteTransaction, 
      role, 
      setRole, 
      isDarkMode, 
      toggleDarkMode,
      displayCurrency,
      setDisplayCurrency,
      exchangeRate: EXCHANGE_RATE,
      convertAmount
    }}>
      {children}
    </FinanceContext.Provider>
  );
}

export function useFinance() {
  const context = useContext(FinanceContext);
  if (context === undefined) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
}
