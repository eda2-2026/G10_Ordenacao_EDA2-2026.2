import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

import { DEFAULT_SEED, generateVehicles } from '../../src/data/syntheticVehicles.js';

const VEHICLE_KEYS = [
  'id',
  'brand',
  'model',
  'version',
  'year',
  'mileage',
  'price',
  'color',
  'fuel',
  'bodyType',
  'city',
  'state',
];

describe('generateVehicles', () => {
  it('gera a quantidade solicitada com ids únicos', () => {
    const vehicles = generateVehicles(100);
    const ids = new Set(vehicles.map((vehicle) => vehicle.id));

    assert.equal(vehicles.length, 100);
    assert.equal(ids.size, 100);
  });

  it('produz o mesmo resultado com a mesma semente', () => {
    assert.deepEqual(generateVehicles(20), generateVehicles(20, { seed: DEFAULT_SEED }));
  });

  it('produz resultados diferentes com sementes diferentes', () => {
    assert.notDeepEqual(generateVehicles(5, { seed: 1 }), generateVehicles(5, { seed: 2 }));
  });

  it('reproduz a amostra versionada com a semente padrão', async () => {
    const sampleUrl = new URL('../../data/sample-vehicles.json', import.meta.url);
    const sample = JSON.parse(await readFile(sampleUrl, 'utf8'));

    assert.equal(sample.length, 20);
    assert.deepEqual(sample, generateVehicles(20));
  });

  it('gera veículos no formato normalizado da aplicação', () => {
    for (const vehicle of generateVehicles(100)) {
      assert.deepEqual(Object.keys(vehicle), VEHICLE_KEYS);
      assert.ok(vehicle.id > 0);
      assert.ok(vehicle.brand.length > 0);
      assert.ok(vehicle.model.length > 0);
      assert.ok(vehicle.year >= 2017 && vehicle.year <= 2026);
      assert.ok(vehicle.mileage >= 0);
      assert.ok(vehicle.price >= 15000);
      assert.match(vehicle.state, /^[A-Z]{2}$/);
    }
  });

  it('aceita uma quantidade igual a zero', () => {
    assert.deepEqual(generateVehicles(0), []);
  });

  it('rejeita quantidade ou semente inválida', () => {
    assert.throws(() => generateVehicles(-1), /quantidade/);
    assert.throws(() => generateVehicles(1.5), /quantidade/);
    assert.throws(() => generateVehicles(1, { seed: -1 }), /semente/);
  });
});
