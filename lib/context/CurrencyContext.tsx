'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Currency = 'USD' | 'EUR' | 'AUD' | 'VND';

interface ExchangeRates {
  USD: number;
  EUR: number;
  AUD: number;
  VND: number;
}

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (c: Currency) => void;
  rates: ExchangeRates;
  convert: (usdAmount: number) => number;
  format: (usdAmount: number) => string;
}

const CurrencyContext = createContext<CurrencyContextType | null>(null);

const DEFAULT_RATES: ExchangeRates = { USD: 1, EUR: 0.92, AUD: 1.58, VND: 25400 };

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>('VND');
  const [rates, setRates] = useState<ExchangeRates>(DEFAULT_RATES);

  // Lấy tỷ giá từ API một lần khi app load
  useEffect(() => {
    fetch('/api/settings')
      .then((r) => r.json())
      .then((data) => {
        if (data.success && data.data?.exchangeRates) {
          setRates(data.data.exchangeRates);
        }
      })
      .catch(() => {}); // fail silently, dùng default rates
  }, []);

  // Persist currency selection vào localStorage
  useEffect(() => {
    const saved = localStorage.getItem('currency') as Currency | null;
    if (saved && ['USD', 'EUR', 'AUD', 'VND'].includes(saved)) {
      setCurrencyState(saved);
    }
  }, []);

  function setCurrency(c: Currency) {
    setCurrencyState(c);
    localStorage.setItem('currency', c);
  }

  function convert(usdAmount: number): number {
    const result = usdAmount * (rates[currency] ?? 1);
    return currency === 'VND' ? Math.round(result) : parseFloat(result.toFixed(2));
  }

  function format(usdAmount: number): string {
    const converted = convert(usdAmount);
    if (currency === 'VND') {
      return new Intl.NumberFormat('vi-VN').format(converted) + ' ₫';
    }
    const symbols: Record<Exclude<Currency, 'VND'>, string> = { USD: '$', EUR: '€', AUD: 'A$' };
    return `${symbols[currency as Exclude<Currency, 'VND'>]}${converted.toFixed(2).replace(/\.00$/, '')}`;
  }

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, rates, convert, format }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error('useCurrency must be used within CurrencyProvider');
  return ctx;
}
