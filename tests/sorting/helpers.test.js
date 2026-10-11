import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import { swap } from '../../src/sorting/metrics.js';
import { assertSortsCorrectly, selectionSort } from './helpers.js';

function unstableSort(arr, compare, metrics) {
  selectionSort(arr, compare, metrics);

  let start = 0;
  while (start < arr.length) {
    let end = start + 1;
    while (end < arr.length && compare(arr[start], arr[end]) === 0) end++;

    for (let left = start, right = end - 1; left < right; left++, right--) {
      swap(arr, left, right, metrics);
    }
    start = end;
  }

  return arr;
}

describe('assertSortsCorrectly', () => {
  it('aceita um algoritmo correto', () => {
    assertSortsCorrectly(selectionSort);
  });

  it('aceita um algoritmo correto mesmo quando ele não é estável', () => {
    assertSortsCorrectly(unstableSort);
  });

  it('rejeita um algoritmo que não ordena', () => {
    const doesNothing = (arr) => arr;
    assert.throws(() => assertSortsCorrectly(doesNothing), /ordem incorreta/);
  });

  it('rejeita um algoritmo que perde elementos', () => {
    const dropsLast = (arr, compare, metrics) => selectionSort(arr, compare, metrics).slice(0, -1);
    assert.throws(() => assertSortsCorrectly(dropsLast), /quantidade de elementos alterada/);
  });

  it('rejeita um algoritmo que usa Array.prototype.sort', () => {
    const usesBuiltin = (arr, compare) => arr.sort(compare);
    assert.throws(() => assertSortsCorrectly(usesBuiltin), /não pode usar Array\.prototype\.sort/);
  });

  it('restaura Array.prototype.sort depois da verificação', () => {
    try {
      assertSortsCorrectly((arr, compare) => arr.sort(compare));
    } catch {
      // esperado
    }
    assert.deepEqual([3, 1, 2].sort(), [1, 2, 3]);
  });
});
