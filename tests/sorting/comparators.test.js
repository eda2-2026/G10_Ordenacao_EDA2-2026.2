import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import {
  SORT_FIELDS,
  byField,
  compareNumbers,
  compareStrings,
  createComparator,
  descending,
  isMissing,
} from '../../src/sorting/comparators.js';

describe('compareNumbers', () => {
  it('retorna negativo, positivo ou zero conforme a ordem crescente', () => {
    assert.ok(compareNumbers(1, 2) < 0);
    assert.ok(compareNumbers(2, 1) > 0);
    assert.equal(compareNumbers(5, 5), 0);
  });

  it('funciona com negativos e decimais', () => {
    assert.ok(compareNumbers(-10, 3) < 0);
    assert.ok(compareNumbers(1.5, 1.25) > 0);
  });

  it('coloca valores ausentes depois dos números', () => {
    for (const missing of [null, undefined, NaN]) {
      assert.ok(compareNumbers(missing, 100) > 0);
      assert.ok(compareNumbers(100, missing) < 0);
    }
  });

  it('considera dois valores ausentes como empate', () => {
    assert.equal(compareNumbers(null, NaN), 0);
  });
});

describe('compareStrings', () => {
  it('segue a ordem alfabética', () => {
    assert.ok(compareStrings('Fiat', 'Ford') < 0);
    assert.ok(compareStrings('Volkswagen', 'Chevrolet') > 0);
  });

  it('ignora maiúsculas e acentos', () => {
    assert.equal(compareStrings('Citroën', 'citroen'), 0);
    assert.equal(compareStrings('HONDA', 'honda'), 0);
  });

  it('coloca letras acentuadas junto das não acentuadas', () => {
    assert.ok(compareStrings('Ágile', 'Argo') < 0);
    assert.ok(compareStrings('Ágile', 'Bravo') < 0);
  });

  it('coloca valores ausentes depois dos textos', () => {
    for (const missing of [null, undefined]) {
      assert.ok(compareStrings(missing, 'Fiat') > 0);
      assert.ok(compareStrings('Fiat', missing) < 0);
    }
    assert.equal(compareStrings(null, undefined), 0);
  });
});

describe('isMissing', () => {
  it('identifica null, undefined e NaN como ausentes', () => {
    assert.equal(isMissing(null), true);
    assert.equal(isMissing(undefined), true);
    assert.equal(isMissing(NaN), true);
  });

  it('não considera zero nem texto vazio como ausentes', () => {
    assert.equal(isMissing(0), false);
    assert.equal(isMissing(''), false);
  });
});

describe('byField', () => {
  const gol = { brand: 'Volkswagen', price: 45000 };
  const uno = { brand: 'Fiat', price: 30000 };

  it('compara objetos pelo atributo informado', () => {
    assert.ok(byField('price', compareNumbers)(uno, gol) < 0);
    assert.ok(byField('brand', compareStrings)(gol, uno) > 0);
  });

  it('trata atributo inexistente como ausente', () => {
    const semPreco = { brand: 'Ford' };
    assert.ok(byField('price', compareNumbers)(semPreco, uno) > 0);
  });
});

describe('descending', () => {
  it('inverte a ordem dos valores', () => {
    assert.ok(descending(compareNumbers)(1, 2) > 0);
    assert.ok(descending(compareNumbers)(2, 1) < 0);
    assert.ok(descending(compareStrings)('Fiat', 'Ford') > 0);
  });

  it('mantém empates', () => {
    assert.equal(descending(compareNumbers)(7, 7), 0);
  });

  it('mantém valores ausentes no fim', () => {
    const desc = descending(compareNumbers);
    assert.ok(desc(null, 100) > 0);
    assert.ok(desc(100, NaN) < 0);
    assert.equal(desc(null, undefined), 0);
  });

  it('combina com byField mantendo ausentes no fim', () => {
    const porPrecoDesc = byField('price', descending(compareNumbers));
    const caro = { price: 90000 };
    const barato = { price: 20000 };
    const semPreco = { price: null };

    assert.ok(porPrecoDesc(caro, barato) < 0);
    assert.ok(porPrecoDesc(semPreco, barato) > 0);
  });
});

describe('SORT_FIELDS', () => {
  it('define os cinco critérios do catálogo', () => {
    assert.deepEqual(Object.keys(SORT_FIELDS), ['brand', 'model', 'price', 'year', 'mileage']);
  });

  it('usa comparação de texto para marca e modelo e numérica para o resto', () => {
    assert.equal(SORT_FIELDS.brand, compareStrings);
    assert.equal(SORT_FIELDS.model, compareStrings);
    assert.equal(SORT_FIELDS.price, compareNumbers);
    assert.equal(SORT_FIELDS.year, compareNumbers);
    assert.equal(SORT_FIELDS.mileage, compareNumbers);
  });
});

describe('createComparator', () => {
  const onix = { brand: 'Chevrolet', model: 'Onix', price: 80000, year: 2022, mileage: 30000 };
  const argo = { brand: 'Fiat', model: 'Argo', price: 70000, year: 2021, mileage: null };

  it('usa ordem crescente por padrão', () => {
    assert.ok(createComparator('price')(argo, onix) < 0);
    assert.ok(createComparator('brand')(onix, argo) < 0);
  });

  it('respeita a ordem decrescente', () => {
    assert.ok(createComparator('year', 'desc')(onix, argo) < 0);
    assert.ok(createComparator('model', 'desc')(onix, argo) < 0);
  });

  it('mantém valores ausentes no fim nas duas ordens', () => {
    assert.ok(createComparator('mileage', 'asc')(argo, onix) > 0);
    assert.ok(createComparator('mileage', 'desc')(argo, onix) > 0);
  });

  it('lança erro para critério inválido', () => {
    assert.throws(() => createComparator('color'), /Critério de ordenação inválido/);
    assert.throws(() => createComparator('toString'), /Critério de ordenação inválido/);
  });

  it('lança erro para ordem inválida', () => {
    assert.throws(() => createComparator('price', 'up'), /Ordem de ordenação inválida/);
  });
});
