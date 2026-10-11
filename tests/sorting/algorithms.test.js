import { describe, it } from 'node:test';

import { ALGORITHMS } from '../../src/sorting/algorithms/index.js';
import { assertSortsCorrectly } from './helpers.js';

describe('algoritmos registrados', () => {
  for (const [name, algorithm] of Object.entries(ALGORITHMS)) {
    it(`${name} ordena corretamente`, () => {
      assertSortsCorrectly(algorithm);
    });
  }
});
