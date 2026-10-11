import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import { quickSort } from '../../src/sorting/algorithms/quickSort.js';
import { runSort } from '../../src/sorting/runner.js';

function carsWithPrices(prices) {
  return prices.map((price, id) => ({ id, price }));
}

describe('quickSort', () => {
  it('não realiza operações em uma lista vazia', () => {
    const run = runSort(quickSort, [], { field: 'price' });

    assert.deepEqual(run.result, []);
    assert.equal(run.comparisons, 0);
    assert.equal(run.swaps, 0);
    assert.equal(run.moves, 0);
  });

  it('não realiza operações em uma lista com um elemento', () => {
    const run = runSort(quickSort, carsWithPrices([50000]), { field: 'price' });

    assert.deepEqual(run.result.map((car) => car.price), [50000]);
    assert.equal(run.comparisons, 0);
    assert.equal(run.swaps, 0);
    assert.equal(run.moves, 0);
  });

  it('contabiliza uma lista já ordenada', () => {
    const run = runSort(quickSort, carsWithPrices([10000, 20000, 30000]), { field: 'price' });

    assert.deepEqual(run.result.map((car) => car.price), [10000, 20000, 30000]);
    assert.equal(run.comparisons, 4);
    assert.equal(run.swaps, 0);
    assert.equal(run.moves, 1);
  });

  it('contabiliza uma lista em ordem inversa', () => {
    const run = runSort(quickSort, carsWithPrices([30000, 20000, 10000]), { field: 'price' });

    assert.deepEqual(run.result.map((car) => car.price), [10000, 20000, 30000]);
    assert.equal(run.comparisons, 4);
    assert.equal(run.swaps, 1);
    assert.equal(run.moves, 4);
  });

  it('ordena valores repetidos sem perder elementos', () => {
    const run = runSort(quickSort, carsWithPrices([20000, 10000, 20000, 10000]), { field: 'price' });

    assert.deepEqual(run.result.map((car) => car.price), [10000, 10000, 20000, 20000]);
    assert.deepEqual(new Set(run.result.map((car) => car.id)), new Set([0, 1, 2, 3]));
  });

  it('ordena uma lista grande já ordenada sem exceder a pilha', () => {
    const input = carsWithPrices(Array.from({ length: 10000 }, (_, index) => index));
    const run = runSort(quickSort, input, { field: 'price' });

    assert.equal(run.result.length, 10000);
    assert.equal(run.result[0].price, 0);
    assert.equal(run.result.at(-1).price, 9999);
  });
});
