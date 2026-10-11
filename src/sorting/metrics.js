
export function createMetrics() {
  return {
    comparisons: 0,
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
  const temp = arr[i];
  arr[i] = arr[j];
  arr[j] = temp;
  metrics.move(3);
}
