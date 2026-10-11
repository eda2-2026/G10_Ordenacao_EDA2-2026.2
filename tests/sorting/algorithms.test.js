import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import { ALGORITHMS, insertionSort, quickSort } from '../../src/sorting/algorithms/index.js';
import { assertSortsCorrectly } from './helpers.js';

describe('algoritmos registrados', () => {
  it('registra o Insertion Sort', () => {
    assert.equal(ALGORITHMS.insertion, insertionSort);
  });

  it('registra o Quick Sort', () => {
    assert.equal(ALGORITHMS.quick, quickSort);
  });

  for (const [name, algorithm] of Object.entries(ALGORITHMS)) {
    it(`${name} ordena corretamente`, () => {
      assertSortsCorrectly(algorithm);
    });
  }
});
