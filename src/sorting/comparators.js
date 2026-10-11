// Comparadores usados pelos algoritmos de ordenação.
export function isMissing(value) {
  return value === null || value === undefined || Number.isNaN(value);
}

// Valores ausentes ficam no fim. Retorna null quando nenhum dos dois está ausente.
function compareMissing(a, b) {
  const aMissing = isMissing(a);
  const bMissing = isMissing(b);

  if (aMissing && bMissing) return 0;
  if (aMissing) return 1;
  if (bMissing) return -1;

  return null;
}

// Ordena números de forma crescente. 
export function compareNumbers(a, b) {
  return compareMissing(a, b) ?? a - b;
}

// Ordena textos em ordem alfabética. 
export function compareStrings(a, b) {
  return compareMissing(a, b) ?? String(a).localeCompare(String(b), 'pt-BR', { sensitivity: 'base' });
}

// Compara objetos pelo atributo `field` usando o comparador base informado.
export function byField(field, compare) {
  return (a, b) => compare(a[field], b[field]);
}

// Inverte a ordem do comparador. 
export function descending(compare) {
  return (a, b) => {
    if (isMissing(a) || isMissing(b)) return compare(a, b);
    return compare(b, a);
  };
}
