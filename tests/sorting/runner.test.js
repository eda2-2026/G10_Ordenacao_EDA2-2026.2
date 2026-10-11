import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import { runSort } from '../../src/sorting/runner.js';
import { selectionSort } from './helpers.js';

const cars = [
  { brand: 'Volkswagen', price: 45000 },
  { brand: 'Fiat', price: 30000 },
  { brand: 'Chevrolet', price: 60000 },
];

describe('runSort', () => {
  it('retorna os veículos ordenados pelo critério e ordem pedidos', () => {
    const asc = runSort(selectionSort, cars, { field: 'price' });
    assert.deepEqual(asc.result.map((car) => car.price), [30000, 45000, 60000]);

    const desc = runSort(selectionSort, cars, { field: 'brand', order: 'desc' });
    assert.deepEqual(desc.result.map((car) => car.brand), ['Volkswagen', 'Fiat', 'Chevrolet']);
  });

  it('não altera o array original', () => {
    const original = [...cars];
    runSort(selectionSort, cars, { field: 'price' });
    assert.deepEqual(cars, original);
  });

  it('preenche comparações, trocas e movimentações', () => {
    const { comparisons, swaps, moves } = runSort(selectionSort, cars, { field: 'price' });
    assert.equal(comparisons, 3); // n(n-1)/2 para n = 3
    assert.equal(swaps, 1);
    assert.equal(moves, 3); // 1 troca: 45000 <-> 30000
  });

  it('mede o tempo de execução', () => {
    const { timeMs } = runSort(selectionSort, cars, { field: 'price' });
    assert.equal(typeof timeMs, 'number');
    assert.ok(timeMs >= 0);
  });

  it('funciona com lista vazia', () => {
    const run = runSort(selectionSort, [], { field: 'year' });
    assert.deepEqual(run.result, []);
    assert.equal(run.comparisons, 0);
    assert.equal(run.swaps, 0);
    assert.equal(run.moves, 0);
  });

  it('lança erro para critério inválido', () => {
    assert.throws(() => runSort(selectionSort, cars, { field: 'color' }), /Critério de ordenação inválido/);
  });
});
