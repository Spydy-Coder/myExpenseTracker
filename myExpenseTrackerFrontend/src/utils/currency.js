export const toMinorUnits = (value) => Math.round(Number(value || 0) * 100);

export const fromMinorUnits = (minorUnits) => minorUnits / 100;

export const formatCurrency = (value) =>
  fromMinorUnits(toMinorUnits(value)).toFixed(2);

export const sumCurrency = (values) =>
  fromMinorUnits(
    values.reduce((total, value) => total + toMinorUnits(value), 0),
  );
