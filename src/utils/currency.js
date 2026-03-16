export const formatCurrency = (amount) => {
  if (amount === undefined || amount === null) return 'Rs. 0.00';
  return 'Rs. ' + Number(amount).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

export const parseCurrency = (formattedString) => {
  return parseFloat(formattedString.replace(/[^0-9.-]+/g,""));
};
