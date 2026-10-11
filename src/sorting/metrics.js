// Comparação: cada chamada ao comparador de dois elementos.
// Movimentação: cada cópia de um elemento, inclusive para uma variável temporária.
// Troca: intercâmbio efetivo entre duas posições diferentes; equivale a 3 movimentações.

export function createMetrics() {
  return {
    comparisons: 0,
    swaps: 0,
    moves: 0,
    move(count = 1) {
      this.moves += count;
    },
  };
}


export function countComparisons(compare, metrics) {
  return (a, b) => {
    metrics.comparisons++;
    return compare(a, b);
  };
}


export function swap(arr, i, j, metrics) {
  if (i === j) return;

  const temp = arr[i];
  arr[i] = arr[j];
  arr[j] = temp;
  metrics.swaps++;
  metrics.move(3);
}
