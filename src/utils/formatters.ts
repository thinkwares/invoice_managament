export const formatCurrency = (amount: number, includeDecimals: boolean = true): string => {
  const formatted = amount.toFixed(2);
  const [integerPart, decimalPart] = formatted.split('.');

  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

  if (includeDecimals) {
    return `${formattedInteger},${decimalPart}`;
  }

  return formattedInteger;
};

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('tr-TR');
};
