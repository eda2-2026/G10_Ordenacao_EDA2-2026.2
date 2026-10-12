const priceFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  maximumFractionDigits: 0,
});

const integerFormatter = new Intl.NumberFormat('pt-BR', {
  maximumFractionDigits: 0,
});

const timeFormatter = new Intl.NumberFormat('pt-BR', {
  minimumFractionDigits: 3,
  maximumFractionDigits: 3,
});

function isValidNumber(value) {
  return typeof value === 'number' && Number.isFinite(value);
}

export function formatPrice(value) {
  return isValidNumber(value) ? priceFormatter.format(value) : 'Não informado';
}

export function formatMileage(value) {
  return isValidNumber(value) ? `${integerFormatter.format(value)} km` : 'Não informado';
}

export function formatInteger(value) {
  return isValidNumber(value) ? integerFormatter.format(value) : '—';
}

export function formatTime(value) {
  return isValidNumber(value) ? `${timeFormatter.format(value)} ms` : '—';
}
