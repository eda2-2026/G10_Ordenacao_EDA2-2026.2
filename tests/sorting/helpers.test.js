import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import { assertSortsCorrectly, selectionSort } from './helpers.js';

describe('assertSortsCorrectly', () => {
  it('aceita um algoritmo correto', () => {
    assertSortsCorrectly(selectionSort);
  });

  it('rejeita um algoritmo que não ordena', () => {
    const doesNothing = (arr) => arr;
    assert.throws(() => assertSortsCorrectly(doesNothing), /ordem incorreta/);
  });

  it('rejeita um algoritmo que perde elementos', () => {
    const dropsLast = (arr, compare, metrics) => selectionSort(arr, compare, metrics).slice(0, -1);
    assert.throws(() => assertSortsCorrectly(dropsLast));
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
