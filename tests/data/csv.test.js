import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import { parseCsv, parseCsvRows } from '../../src/data/csv.js';

describe('parseCsvRows', () => {
  it('separa linhas e campos simples', () => {
    assert.deepEqual(parseCsvRows('a,b\n1,2'), [
      ['a', 'b'],
      ['1', '2'],
    ]);
  });

  it('aceita vírgulas, quebras de linha e aspas escapadas dentro de aspas', () => {
    assert.deepEqual(parseCsvRows('"Rodas 20"", liga","linha 1\nlinha 2"'), [['Rodas 20", liga', 'linha 1\nlinha 2']]);
  });

  it('aceita quebras de linha do Windows', () => {
    assert.deepEqual(parseCsvRows('a,b\r\n1,2\r\n'), [
      ['a', 'b'],
      ['1', '2'],
    ]);
  });

  it('mantém campos vazios', () => {
    assert.deepEqual(parseCsvRows('a,,c'), [['a', '', 'c']]);
  });
});

describe('parseCsv', () => {
  it('usa o cabeçalho como chaves dos objetos', () => {
    assert.deepEqual(parseCsv('Marca,Ano\nFIAT,2020\nHONDA,2022\n'), [
      { Marca: 'FIAT', Ano: '2020' },
      { Marca: 'HONDA', Ano: '2022' },
    ]);
  });

  it('ignora o BOM e linhas vazias', () => {
    assert.deepEqual(parseCsv('﻿Marca\nFIAT\n\n'), [{ Marca: 'FIAT' }]);
  });

  it('retorna lista vazia para texto vazio', () => {
    assert.deepEqual(parseCsv(''), []);
  });
});
