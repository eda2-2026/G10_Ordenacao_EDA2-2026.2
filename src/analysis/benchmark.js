import { generateVehicles } from '../data/syntheticVehicles.js';
import { ALGORITHMS } from '../sorting/algorithms/index.js';
import { insertionSort } from '../sorting/algorithms/insertionSort.js';
import { mergeSort } from '../sorting/algorithms/mergeSort.js';
import { compareNumbers } from '../sorting/comparators.js';
import { createMetrics } from '../sorting/metrics.js';
import { runSort } from '../sorting/runner.js';

export const SCENARIOS = Object.freeze(['random', 'sorted', 'reversed']);

export function prepareInput(vehicles, scenario, { field, order = 'asc' }) {
  if (scenario === 'random') return [...vehicles];

  const sorted = runSort(mergeSort, vehicles, { field, order }).result;
  if (scenario === 'sorted') return sorted;
  if (scenario === 'reversed') return sorted.reverse();

  throw new Error(`Cenário inválido: ${scenario}`);
}

export function median(values) {
  if (values.length === 0) return null;

  const sorted = insertionSort([...values], compareNumbers, createMetrics());
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 1 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

export function runBenchmark({
  sizes,
  scenarios = ['random'],
  field = 'price',
  order = 'asc',
  repetitions = 3,
  algorithms = ALGORITHMS,
  makeData = generateVehicles,
} = {}) {
  const results = [];

  for (const size of sizes) {
    const vehicles = makeData(size);

    for (const scenario of scenarios) {
      const input = prepareInput(vehicles, scenario, { field, order });

      for (const [algorithm, sort] of Object.entries(algorithms)) {
        const runs = Array.from({ length: repetitions }, () => runSort(sort, input, { field, order }));
        const { comparisons, swaps, moves } = runs[0];

        results.push({
          algorithm,
          size,
          scenario,
          comparisons,
          swaps,
          moves,
          timeMs: median(runs.map((run) => run.timeMs)),
        });
      }
    }
  }

  return results;
}
