import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import { cleanText, normalizeVehicle, normalizeVehicles, parseInteger, parseState } from '../../src/data/vehicles.js';

const row = {
  id: '53114326',
  Marca: 'MERCEDES-BENZ',
  Modelo: ' A 35  AMG ',
  Variante: '2.0 CGI GASOLINA 4MATIC 7G-DCT',
  Ano: '2023',
  Kilometraje: '10178',
  price: '369990',
  Color: 'Preto',
  Combustible: 'Gasolina',
  carroceria: 'Hatchback',
  Comuna: 'Valinhos',
  Ciudad: 'São Paulo (SP)',
  Dueno: 'EA MOTORS',
  cnpj_cpf: '37893441000170',
  phone: '(19)99999-9999',
  description: 'texto do anúncio',
};

describe('cleanText', () => {
  it('remove espaços extras', () => {
    assert.equal(cleanText('  A 35   AMG\n'), 'A 35 AMG');
  });

  it('retorna null para texto vazio ou ausente', () => {
    assert.equal(cleanText('   '), null);
    assert.equal(cleanText(undefined), null);
  });
});

describe('parseInteger', () => {
  it('converte números inteiros', () => {
    assert.equal(parseInteger('369990'), 369990);
    assert.equal(parseInteger('0'), 0);
  });

  it('retorna null para valores inválidos', () => {
    assert.equal(parseInteger(''), null);
    assert.equal(parseInteger('12,5'), null);
    assert.equal(parseInteger('abc'), null);
  });
});

describe('parseState', () => {
  it('extrai a sigla do estado', () => {
    assert.equal(parseState('São Paulo (SP)'), 'SP');
  });

  it('retorna null sem sigla', () => {
    assert.equal(parseState('São Paulo'), null);
  });
});

describe('normalizeVehicle', () => {
  it('converte o anúncio para o formato da aplicação', () => {
    assert.deepEqual(normalizeVehicle(row), {
      id: 53114326,
      brand: 'MERCEDES-BENZ',
      model: 'A 35 AMG',
      version: '2.0 CGI GASOLINA 4MATIC 7G-DCT',
      year: 2023,
      mileage: 10178,
      price: 369990,
      color: 'Preto',
      fuel: 'Gasolina',
      bodyType: 'Hatchback',
      city: 'Valinhos',
      state: 'SP',
    });
  });

  it('não mantém dados pessoais do vendedor', () => {
    const vehicle = normalizeVehicle(row);
    for (const key of ['Dueno', 'cnpj_cpf', 'phone', 'description']) {
      assert.equal(key in vehicle, false);
    }
  });

  it('usa null para atributos ausentes ou inválidos', () => {
    const vehicle = normalizeVehicle({ ...row, price: '', Kilometraje: 'n/d' });
    assert.equal(vehicle.price, null);
    assert.equal(vehicle.mileage, null);
  });
});

describe('normalizeVehicles', () => {
  it('descarta anúncios sem id e ids repetidos', () => {
    const vehicles = normalizeVehicles([row, { ...row, Modelo: 'Outro' }, { ...row, id: '' }]);
    assert.equal(vehicles.length, 1);
    assert.equal(vehicles[0].model, 'A 35 AMG');
  });
});
