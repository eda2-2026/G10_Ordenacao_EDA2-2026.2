import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import { compareNumbers } from '../../src/sorting/comparators.js';
import { countComparisons, createMetrics, swap } from '../../src/sorting/metrics.js';

describe('createMetrics', () => {
  it('começa com os contadores zerados', () => {
    const metrics = createMetrics();
    assert.equal(metrics.comparisons, 0);
    assert.equal(metrics.moves, 0);
  });

  it('move soma 1 por padrão ou a quantidade informada', () => {
    const metrics = createMetrics();
    metrics.move();
    metrics.move(4);
    assert.equal(metrics.moves, 5);
  });

  it('cria contadores independentes a cada chamada', () => {
    const a = createMetrics();
    const b = createMetrics();
    a.move();
    assert.equal(b.moves, 0);
  });
});

describe('countComparisons', () => {
  it('conta cada chamada ao comparador', () => {
    const metrics = createMetrics();
    const compare = countComparisons(compareNumbers, metrics);

    compare(1, 2);
    compare(3, 3);
    compare(5, 4);

    assert.equal(metrics.comparisons, 3);
  });

  it('preserva o resultado do comparador original', () => {
    const compare = countComparisons(compareNumbers, createMetrics());
    assert.ok(compare(1, 2) < 0);
    assert.ok(compare(2, 1) > 0);
    assert.equal(compare(7, 7), 0);
  });

  it('não altera as movimentações', () => {
    const metrics = createMetrics();
    countComparisons(compareNumbers, metrics)(1, 2);
    assert.equal(metrics.moves, 0);
  });
});

describe('swap', () => {
  it('troca os elementos de posição', () => {
    const arr = [10, 20, 30];
    swap(arr, 0, 2, createMetrics());
    assert.deepEqual(arr, [30, 20, 10]);
  });

  it('conta 3 movimentações por troca', () => {
    const metrics = createMetrics();
    const arr = [1, 2, 3];
    swap(arr, 0, 1, metrics);
    swap(arr, 1, 2, metrics);
    assert.equal(metrics.moves, 6);
    assert.equal(metrics.comparisons, 0);
  });
});
