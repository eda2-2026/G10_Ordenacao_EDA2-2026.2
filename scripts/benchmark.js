// Compara os algoritmos em vários tamanhos e cenários de entrada.
// npm run benchmark [-- --sizes=100,1000,10000 --field=price --order=asc --reps=3 --csv=benchmark.csv]
import { writeFileSync } from 'node:fs';

import { SCENARIOS, runBenchmark } from '../src/analysis/benchmark.js';

const options = Object.fromEntries(
  process.argv.slice(2).map((arg) => {
    const [key, value = ''] = arg.replace(/^--/, '').split('=');
    return [key, value];
  }),
);

const sizes = (options.sizes ?? '100,1000,10000').split(',').map(Number);
const field = options.field ?? 'price';
const order = options.order ?? 'asc';
const repetitions = Number(options.reps ?? 3);

if (sizes.some((size) => !Number.isInteger(size) || size < 0) || !Number.isInteger(repetitions) || repetitions < 1) {
  throw new TypeError('Use tamanhos e repetições inteiros, por exemplo --sizes=100,1000 --reps=3.');
}

console.log(`Ordenando por ${field} (${order}), mediana de ${repetitions} execuções.\n`);
const results = runBenchmark({ sizes, scenarios: SCENARIOS, field, order, repetitions });

for (const scenario of SCENARIOS) {
  console.log(`Cenário: ${scenario}`);
  console.table(
    results
      .filter((row) => row.scenario === scenario)
      .map(({ algorithm, size, comparisons, swaps, moves, timeMs }) => ({
        algoritmo: algorithm,
        tamanho: size,
        comparações: comparisons,
        trocas: swaps,
        movimentações: moves,
        'tempo (ms)': Number(timeMs.toFixed(3)),
      })),
  );
}

if (options.csv) {
  const header = 'algorithm,size,scenario,comparisons,swaps,moves,timeMs';
  const lines = results.map((row) =>
    [row.algorithm, row.size, row.scenario, row.comparisons, row.swaps, row.moves, row.timeMs.toFixed(4)].join(','),
  );
  writeFileSync(options.csv, `${[header, ...lines].join('\n')}\n`);
  console.log(`Resultados salvos em ${options.csv}`);
}
