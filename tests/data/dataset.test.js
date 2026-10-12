import { readFile } from 'node:fs/promises';
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import { generateVehicles } from '../../src/data/syntheticVehicles.js';

const datasetUrl = new URL('../../data/vehicles.json', import.meta.url);

async function readJson(url) {
  return JSON.parse(await readFile(url, 'utf8'));
}

describe('data/vehicles.json', () => {
  it('contém exatamente 10.000 veículos com ids únicos', async () => {
    const vehicles = await readJson(datasetUrl);
    const ids = new Set(vehicles.map((vehicle) => vehicle.id));

    assert.equal(vehicles.length, 10000);
    assert.equal(ids.size, vehicles.length);
  });

  it('mantém o formato esperado pela aplicação', async () => {
    const vehicles = await readJson(datasetUrl);
    const requiredFields = [
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

    for (const vehicle of vehicles) {
      assert.deepEqual(Object.keys(vehicle), requiredFields);
    }
  });

  it('pode ser reproduzido pelo gerador com a configuração padrão', async () => {
    const vehicles = await readJson(datasetUrl);
    assert.deepEqual(vehicles, generateVehicles(10000));
  });
});
