import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import { heapSort } from '../../src/sorting/algorithms/heapSort.js';
import { runSort } from '../../src/sorting/runner.js';

function carsWithPrices(prices) {
  return prices.map((price, id) => ({ id, price }));
}

describe('heapSort', () => {
  it('não realiza operações em uma lista vazia', () => {
    const run = runSort(heapSort, [], { field: 'price' });

    assert.deepEqual(run.result, []);
    assert.equal(run.comparisons, 0);
    assert.equal(run.swaps, 0);
    assert.equal(run.moves, 0);
  });

  it('não realiza operações em uma lista com um elemento', () => {
    const run = runSort(heapSort, carsWithPrices([50000]), { field: 'price' });

    assert.deepEqual(run.result.map((car) => car.price), [50000]);
    assert.equal(run.comparisons, 0);
    assert.equal(run.swaps, 0);
    assert.equal(run.moves, 0);
  });

  it('contabiliza uma lista já ordenada', () => {
    const run = runSort(heapSort, carsWithPrices([10000, 20000, 30000]), { field: 'price' });

    assert.deepEqual(run.result.map((car) => car.price), [10000, 20000, 30000]);
    assert.equal(run.comparisons, 3);
    assert.equal(run.swaps, 4); // 1 na construção do heap + 3 nas extrações
    assert.equal(run.moves, 12);
  });

  it('contabiliza uma lista em ordem inversa', () => {
    const run = runSort(heapSort, carsWithPrices([30000, 20000, 10000]), { field: 'price' });

    assert.deepEqual(run.result.map((car) => car.price), [10000, 20000, 30000]);
    assert.equal(run.comparisons, 3);
    assert.equal(run.swaps, 3); // a lista inversa já é um heap máximo
    assert.equal(run.moves, 9);
  });

  it('ordena valores repetidos sem perder elementos', () => {
    const run = runSort(heapSort, carsWithPrices([20000, 10000, 20000, 10000]), { field: 'price' });

    assert.deepEqual(run.result.map((car) => car.price), [10000, 10000, 20000, 20000]);
    assert.deepEqual(new Set(run.result.map((car) => car.id)), new Set([0, 1, 2, 3]));
  });

  it('não é estável', () => {
    const run = runSort(heapSort, carsWithPrices([20000, 20000, 10000]), { field: 'price' });

    assert.deepEqual(run.result.map((car) => car.id), [2, 1, 0]);
  });

  it('ordena uma lista grande em ordem inversa', () => {
    const input = carsWithPrices(Array.from({ length: 10000 }, (_, index) => 10000 - index));
    const run = runSort(heapSort, input, { field: 'price' });

    assert.equal(run.result.length, 10000);
    assert.equal(run.result[0].price, 1);
    assert.equal(run.result.at(-1).price, 10000);
  });
});
