import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency: 'USD' | 'INR' = 'USD') {
  return new Intl.NumberFormat(currency === 'USD' ? 'en-US' : 'en-IN', {
    style: 'currency',
    currency: currency,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function convertAmount(amount: number, from: 'USD' | 'INR', to: 'USD' | 'INR', rate: number) {
  if (from === to) return amount;
  if (from === 'USD' && to === 'INR') return amount * rate;
  if (from === 'INR' && to === 'USD') return amount / rate;
  return amount;
}
