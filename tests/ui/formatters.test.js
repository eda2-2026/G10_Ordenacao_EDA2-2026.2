import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import { formatInteger, formatMileage, formatPrice, formatTime } from '../../src/ui/formatters.js';

describe('formatPrice', () => {
  it('formata valores em reais sem centavos', () => {
    assert.match(formatPrice(58500), /^R\$\s58\.500$/);
  });

  it('trata valores ausentes', () => {
    assert.equal(formatPrice(null), 'Não informado');
  });
});

describe('formatMileage', () => {
  it('formata a quilometragem', () => {
    assert.equal(formatMileage(83500), '83.500 km');
  });

  it('trata valores ausentes', () => {
    assert.equal(formatMileage(undefined), 'Não informado');
  });
});

describe('formatInteger', () => {
  it('formata contadores e trata valores ausentes', () => {
    assert.equal(formatInteger(1234567), '1.234.567');
    assert.equal(formatInteger(null), '—');
  });
});

describe('formatTime', () => {
  it('formata milissegundos com três casas decimais', () => {
    assert.equal(formatTime(1.23456), '1,235 ms');
  });
});
