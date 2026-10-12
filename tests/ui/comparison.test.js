import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import { COMPARISON_METRICS, summarizeComparison } from '../../src/ui/comparison.js';

const results = [
  { algorithm: 'insertion', comparisons: 400, swaps: 0, moves: 500, timeMs: 2 },
  { algorithm: 'quick', comparisons: 100, swaps: 20, moves: 60, timeMs: 0.5 },
];

function metricOf(row, metric) {
  return row.metrics.find((item) => item.metric === metric);
}

describe('summarizeComparison', () => {
  it('mantém uma linha por algoritmo com todas as métricas', () => {
    const rows = summarizeComparison(results);

    assert.deepEqual(rows.map((row) => row.algorithm), ['insertion', 'quick']);
    for (const row of rows) {
      assert.deepEqual(row.metrics.map((item) => item.metric), COMPARISON_METRICS);
    }
  });

  it('calcula a barra proporcional ao maior valor da métrica', () => {
    const [insertion, quick] = summarizeComparison(results);

    assert.equal(metricOf(insertion, 'comparisons').ratio, 1);
    assert.equal(metricOf(quick, 'comparisons').ratio, 0.25);
    assert.equal(metricOf(quick, 'timeMs').ratio, 0.25);
  });

  it('marca o menor valor de cada métrica como melhor', () => {
    const [insertion, quick] = summarizeComparison(results);

    assert.equal(metricOf(quick, 'comparisons').best, true);
    assert.equal(metricOf(insertion, 'comparisons').best, false);
    assert.equal(metricOf(insertion, 'swaps').best, true);
  });

  it('usa barra vazia quando todos os valores são zero', () => {
    const rows = summarizeComparison([
      { algorithm: 'merge', comparisons: 0, swaps: 0, moves: 0, timeMs: 0 },
      { algorithm: 'heap', comparisons: 0, swaps: 0, moves: 0, timeMs: 0 },
    ]);

    assert.ok(rows.every((row) => row.metrics.every((item) => item.ratio === 0 && item.best)));
  });
});
