export function isMissing(value) {
  return value === null || value === undefined || Number.isNaN(value);
}

// Valores ausentes ficam no fim. Retorna null quando nenhum dos dois está ausente
function compareMissing(a, b) {
  const aMissing = isMissing(a);
  const bMissing = isMissing(b);

  if (aMissing && bMissing) return 0;
  if (aMissing) return 1;
  if (bMissing) return -1;

  return null;
}

// Ordena números de forma crescente
export function compareNumbers(a, b) {
  return compareMissing(a, b) ?? a - b;
}

// Ordena textos em ordem alfabética. 
export function compareStrings(a, b) {
  return compareMissing(a, b) ?? String(a).localeCompare(String(b), 'pt-BR', { sensitivity: 'base' });
}

// Compara objetos pelo atributo `field` 
export function byField(field, compare) {
  return (a, b) => compare(a[field], b[field]);
}

// Inverte a ordem do comparador
export function descending(compare) {
  return (a, b) => {
    if (isMissing(a) || isMissing(b)) return compare(a, b);
    return compare(b, a);
  };
}

// Critérios de ordenação do catálogo
export const SORT_FIELDS = Object.freeze({
  brand: compareStrings,
  model: compareStrings,
  price: compareNumbers,
  year: compareNumbers,
  mileage: compareNumbers,
});

export const SORT_ORDERS = Object.freeze(['asc', 'desc']);

// Monta o comparador final de veículos para um critério e uma ordem.
export function createComparator(field, order = 'asc') {
  if (!Object.hasOwn(SORT_FIELDS, field)) {
    throw new Error(`Critério de ordenação inválido: ${field}`);
  }
  if (!SORT_ORDERS.includes(order)) {
    throw new Error(`Ordem de ordenação inválida: ${order}`);
  }

  const base = SORT_FIELDS[field];
  return byField(field, order === 'desc' ? descending(base) : base);
}
