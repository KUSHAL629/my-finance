import React, { createContext, useContext, useState, useEffect } from 'react';
import { formatCurrency as formatCur } from '../utils/formatters';
import { useAuth } from './AuthContext';

const CurrencyContext = createContext(null);

export const CurrencyProvider = ({ children }) => {
  const { user } = useAuth();
  const [currency, setCurrency] = useState(() => {
    return localStorage.getItem('currency') || 'INR';
  });

  // Sync with user preference if available
  useEffect(() => {
    if (user?.currency && user.currency !== currency) {
      setCurrency(user.currency);
      localStorage.setItem('currency', user.currency);
    }
  }, [user]);

  const updateCurrency = (newCurrency) => {
    setCurrency(newCurrency);
    localStorage.setItem('currency', newCurrency);
  };

  const format = (amount, showDecimals = false) => {
    return formatCur(amount, currency, showDecimals);
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency: updateCurrency, format }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};
