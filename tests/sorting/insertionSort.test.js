import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import { insertionSort } from '../../src/sorting/algorithms/insertionSort.js';
import { runSort } from '../../src/sorting/runner.js';

function carsWithPrices(prices) {
  return prices.map((price, id) => ({ id, price }));
}

describe('insertionSort', () => {
  it('não realiza operações em uma lista vazia', () => {
    const run = runSort(insertionSort, [], { field: 'price' });

    assert.deepEqual(run.result, []);
    assert.equal(run.comparisons, 0);
    assert.equal(run.swaps, 0);
    assert.equal(run.moves, 0);
  });

  it('não realiza operações em uma lista com um elemento', () => {
    const run = runSort(insertionSort, carsWithPrices([50000]), { field: 'price' });

    assert.deepEqual(run.result.map((car) => car.price), [50000]);
    assert.equal(run.comparisons, 0);
    assert.equal(run.swaps, 0);
    assert.equal(run.moves, 0);
  });

  it('contabiliza uma lista já ordenada', () => {
    const run = runSort(insertionSort, carsWithPrices([10000, 20000, 30000]), { field: 'price' });

    assert.deepEqual(run.result.map((car) => car.price), [10000, 20000, 30000]);
    assert.equal(run.comparisons, 2);
    assert.equal(run.swaps, 0);
    assert.equal(run.moves, 4);
  });

  it('contabiliza uma lista em ordem inversa', () => {
    const run = runSort(insertionSort, carsWithPrices([30000, 20000, 10000]), { field: 'price' });

    assert.deepEqual(run.result.map((car) => car.price), [10000, 20000, 30000]);
    assert.equal(run.comparisons, 3);
    assert.equal(run.swaps, 0);
    assert.equal(run.moves, 7);
  });

  it('é estável quando há valores repetidos', () => {
    const input = carsWithPrices([20000, 20000, 10000]);
    const run = runSort(insertionSort, input, { field: 'price' });

    assert.deepEqual(run.result.map((car) => car.id), [2, 0, 1]);
  });
});
