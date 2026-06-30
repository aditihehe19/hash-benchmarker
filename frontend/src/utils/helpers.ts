/**
 * Formats a hash rate value to human-readable SI units (H/s, KH/s, MH/s, GH/s, TH/s).
 */
export const formatHashRate = (hashRate: number): string => {
  if (hashRate === 0) return '0 H/s';
  const k = 1000;
  const sizes = ['H/s', 'KH/s', 'MH/s', 'GH/s', 'TH/s', 'PH/s'];
  const i = Math.floor(Math.log(hashRate) / Math.log(k));
  return `${parseFloat((hashRate / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

/**
 * Formats a dollar/euro cost amount to string representation.
 */
export const formatCost = (cost: number, currency = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(cost);
};

/**
 * Formats large integers with commas.
 */
export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('en-US').format(num);
};

/**
 * Standard percentage formatter.
 */
export const formatPercent = (percentage: number): string => {
  return `${percentage > 0 ? '+' : ''}${percentage.toFixed(1)}%`;
};
