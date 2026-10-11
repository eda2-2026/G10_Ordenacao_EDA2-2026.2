import { createComparator } from './comparators.js';
import { countComparisons, createMetrics } from './metrics.js';

export function runSort(algorithm, data, { field, order = 'asc' } = {}) {
  const metrics = createMetrics();
  const compare = countComparisons(createComparator(field, order), metrics);
  const arr = [...data];

  const start = performance.now();
  const result = algorithm(arr, compare, metrics);
  const timeMs = performance.now() - start;

  return {
    result,
    comparisons: metrics.comparisons,
    moves: metrics.moves,
    timeMs,
  };
}
