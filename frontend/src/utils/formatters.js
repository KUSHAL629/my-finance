import { CURRENCY_SYMBOLS } from './constants';

export const formatCurrency = (amount, currency = 'INR', showDecimals = false) => {
  const numericAmount = Number(amount) || 0;
  const symbol = CURRENCY_SYMBOLS[currency] || '₹';

  const locale = currency === 'INR' ? 'en-IN' : 'en-US';
  const formattedNumber = new Intl.NumberFormat(locale, {
    minimumFractionDigits: showDecimals ? 2 : 0,
    maximumFractionDigits: 2,
  }).format(numericAmount);

  return `${symbol}${formattedNumber}`;
};

export const formatDate = (dateString, format = 'DD/MM/YYYY') => {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '';

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  if (format === 'MM/DD/YYYY') {
    return `${month}/${day}/${year}`;
  } else if (format === 'YYYY-MM-DD') {
    return `${year}-${month}-${day}`;
  }
  return `${day}/${month}/${year}`;
};

export const formatPercent = (value) => {
  const num = Number(value) || 0;
  return `${num >= 0 ? '+' : ''}${num.toFixed(1)}%`;
};
