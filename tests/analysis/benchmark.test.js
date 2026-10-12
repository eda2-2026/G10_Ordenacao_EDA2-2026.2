import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import { SCENARIOS, median, prepareInput, runBenchmark } from '../../src/analysis/benchmark.js';
import { createComparator } from '../../src/sorting/comparators.js';

// Preços distintos e embaralhados (7919 é primo, então i * 7919 % n percorre 0..n-1 sem repetir).
function distinctPrices(count) {
  return Array.from({ length: count }, (_, id) => ({ id, price: ((id * 7919) % count) * 1000 }));
}

function isOrdered(vehicles, field, order) {
  const compare = createComparator(field, order);
  return vehicles.every((vehicle, i) => i === 0 || compare(vehicles[i - 1], vehicle) <= 0);
}

describe('prepareInput', () => {
  const vehicles = distinctPrices(50);

  it('mantém a ordem original no cenário aleatório', () => {
    assert.deepEqual(prepareInput(vehicles, 'random', { field: 'price' }), vehicles);
  });

  it('entrega a lista já na ordem pedida no cenário ordenado', () => {
    assert.ok(isOrdered(prepareInput(vehicles, 'sorted', { field: 'price', order: 'desc' }), 'price', 'desc'));
  });

  it('entrega a lista na ordem oposta no cenário invertido', () => {
    assert.ok(isOrdered(prepareInput(vehicles, 'reversed', { field: 'price', order: 'asc' }), 'price', 'desc'));
  });

  it('não altera a lista original', () => {
    const copy = [...vehicles];
    for (const scenario of SCENARIOS) prepareInput(vehicles, scenario, { field: 'price' });
    assert.deepEqual(vehicles, copy);
  });

  it('lança erro para cenário inválido', () => {
    assert.throws(() => prepareInput(vehicles, 'quase', { field: 'price' }), /Cenário inválido/);
  });
});

describe('median', () => {
  it('calcula a mediana de quantidades ímpares e pares', () => {
    assert.equal(median([5, 1, 3]), 3);
    assert.equal(median([4, 1, 3, 2]), 2.5);
  });

  it('retorna null para lista vazia', () => {
    assert.equal(median([]), null);
  });
});

describe('runBenchmark', () => {
  const options = { sizes: [10, 50], scenarios: SCENARIOS, field: 'price', repetitions: 2, makeData: distinctPrices };

  it('gera uma linha por algoritmo, tamanho e cenário', () => {
    const results = runBenchmark(options);
    assert.equal(results.length, 4 * 2 * 3);

    for (const row of results) {
      assert.ok(Number.isInteger(row.comparisons) && row.comparisons >= 0);
      assert.ok(Number.isInteger(row.swaps) && row.swaps >= 0);
      assert.ok(Number.isInteger(row.moves) && row.moves >= 0);
      assert.ok(row.timeMs >= 0);
    }
  });

  it('reproduz o melhor e o pior caso do Insertion Sort', () => {
    const results = runBenchmark(options);
    const insertion = (size, scenario) =>
      results.find((row) => row.algorithm === 'insertion' && row.size === size && row.scenario === scenario);

    assert.equal(insertion(50, 'sorted').comparisons, 50 - 1);
    assert.equal(insertion(50, 'reversed').comparisons, (50 * 49) / 2);
  });

  it('usa a mesma entrada para todos os algoritmos', () => {
    const received = [];
    const spy = (name) => (arr) => {
      received.push({ name, ids: arr.map((vehicle) => vehicle.id) });
      return arr;
    };

    runBenchmark({ ...options, sizes: [10], scenarios: ['random'], repetitions: 1, algorithms: { a: spy('a'), b: spy('b') } });
    assert.deepEqual(received[0].ids, received[1].ids);
  });
});
