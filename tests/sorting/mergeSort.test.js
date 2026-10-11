import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import { mergeSort } from '../../src/sorting/algorithms/mergeSort.js';
import { runSort } from '../../src/sorting/runner.js';

function carsWithPrices(prices) {
  return prices.map((price, id) => ({ id, price }));
}

describe('mergeSort', () => {
  it('não realiza operações em uma lista vazia', () => {
    const run = runSort(mergeSort, [], { field: 'price' });

    assert.deepEqual(run.result, []);
    assert.equal(run.comparisons, 0);
    assert.equal(run.swaps, 0);
    assert.equal(run.moves, 0);
  });

  it('não realiza operações em uma lista com um elemento', () => {
    const run = runSort(mergeSort, carsWithPrices([50000]), { field: 'price' });

    assert.deepEqual(run.result.map((car) => car.price), [50000]);
    assert.equal(run.comparisons, 0);
    assert.equal(run.swaps, 0);
    assert.equal(run.moves, 0);
  });

  it('contabiliza uma lista já ordenada', () => {
    const run = runSort(mergeSort, carsWithPrices([10000, 20000, 30000]), { field: 'price' });

    assert.deepEqual(run.result.map((car) => car.price), [10000, 20000, 30000]);
    assert.equal(run.comparisons, 3);
    assert.equal(run.swaps, 0);
    assert.equal(run.moves, 10); // (2 + 2) na primeira intercalação + (3 + 3) na segunda
  });

  it('contabiliza uma lista em ordem inversa', () => {
    const run = runSort(mergeSort, carsWithPrices([30000, 20000, 10000]), { field: 'price' });

    assert.deepEqual(run.result.map((car) => car.price), [10000, 20000, 30000]);
    assert.equal(run.comparisons, 2); // a metade direita (10000) se esgota após 1 comparação no segundo merge
    assert.equal(run.swaps, 0);
    assert.equal(run.moves, 10);
  });

  it('é estável quando há valores repetidos', () => {
    const input = carsWithPrices([20000, 20000, 10000]);
    const run = runSort(mergeSort, input, { field: 'price' });

    assert.deepEqual(run.result.map((car) => car.id), [2, 0, 1]);
  });

  it('faz sempre n·log2(n) movimentações em listas de tamanho potência de 2', () => {
    const run = runSort(mergeSort, carsWithPrices(Array.from({ length: 1024 }, (_, i) => 1024 - i)), {
      field: 'price',
    });

    assert.equal(run.result[0].price, 1);
    assert.equal(run.moves, 2 * 1024 * 10); // cada um dos 10 níveis copia e devolve os 1024 elementos
  });
});
