export const formatCurrency = (amount) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

export const truncateText = (text, maxLength = 100) =>
  text.length <= maxLength ? text : `${text.slice(0, maxLength)}...`;

export const getInitials = (name = '') =>
  name
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase();

export const calcDiscount = (original, current) =>
  original > current ? Math.round(((original - current) / original) * 100) : 0;

export const renderStars = (rating) => {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);
  return { full, half, empty };
};
