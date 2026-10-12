import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import {
  ALGORITHMS,
  heapSort,
  insertionSort,
  mergeSort,
  quickSort,
} from '../../src/sorting/algorithms/index.js';
import { assertSortsCorrectly } from './helpers.js';

describe('algoritmos registrados', () => {
  it('registra somente os quatro algoritmos esperados', () => {
    assert.deepEqual(Object.keys(ALGORITHMS), ['insertion', 'merge', 'quick', 'heap']);
  });

  it('registra o Insertion Sort', () => {
    assert.equal(ALGORITHMS.insertion, insertionSort);
  });

  it('registra o Merge Sort', () => {
    assert.equal(ALGORITHMS.merge, mergeSort);
  });

  it('registra o Quick Sort', () => {
    assert.equal(ALGORITHMS.quick, quickSort);
  });

  it('registra o Heap Sort', () => {
    assert.equal(ALGORITHMS.heap, heapSort);
  });

  for (const [name, algorithm] of Object.entries(ALGORITHMS)) {
    it(`${name} ordena corretamente`, () => {
      assertSortsCorrectly(algorithm);
    });
  }
});
