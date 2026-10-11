import assert from 'node:assert/strict';

import { SORT_FIELDS, SORT_ORDERS, createComparator } from '../../src/sorting/comparators.js';
import { swap } from '../../src/sorting/metrics.js';
import { runSort } from '../../src/sorting/runner.js';

export function selectionSort(arr, compare, metrics) {
  for (let i = 0; i < arr.length - 1; i++) {
    let min = i;
    for (let j = i + 1; j < arr.length; j++) {
      if (compare(arr[j], arr[min]) < 0) min = j;
    }
    if (min !== i) swap(arr, i, min, metrics);
  }
  return arr;
}

// Gerador pseudoaleatório 
function createRandom(seed) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const BRANDS = ['Fiat', 'Chevrolet', 'Volkswagen', 'Citroën', 'Honda', 'Ford'];
const MODELS = ['Uno', 'Onix', 'Gol', 'C3', 'Civic', 'Ka', 'Ágile', 'Argo'];

function makeCars(count, seed) {
  const random = createRandom(seed);
  const pick = (list) => list[Math.floor(random() * list.length)];

  return Array.from({ length: count }, (_, id) => ({
    id,
    brand: pick(BRANDS),
    model: pick(MODELS),
    price: 20000 + Math.floor(random() * 200) * 1000,
    year: 2005 + Math.floor(random() * 20),
    mileage: Math.floor(random() * 200000),
  }));
}

// Ordenação de referência
function referenceSort(cars, field, order) {
  return [...cars].sort(createComparator(field, order));
}

// Cada caso recebe o critério atual e devolve a lista de entrada
const CASES = {
  'lista vazia': () => [],
  'um elemento': () => makeCars(1, 1),
  'já ordenada': (field) => referenceSort(makeCars(50, 2), field, 'asc'),
  'ordem inversa': (field) => referenceSort(makeCars(50, 3), field, 'desc'),
  'muitas duplicatas': () => {
    const base = makeCars(3, 4);
    return Array.from({ length: 30 }, (_, id) => ({ ...base[id % 3], id }));
  },
  'aleatória': () => makeCars(200, 5),
  'com valores ausentes': () =>
    makeCars(40, 6).map((car, i) => {
      if (i % 5 === 0) return { ...car, price: null, mileage: undefined, model: null };
      if (i % 7 === 0) return { ...car, year: NaN, brand: undefined };
      return car;
    }),
};

function withoutBuiltinSort(fn) {
  const { sort, toSorted } = Array.prototype;
  const forbid = () => {
    throw new Error('O algoritmo não pode usar Array.prototype.sort/toSorted');
  };

  Array.prototype.sort = forbid;
  Array.prototype.toSorted = forbid;
  try {
    return fn();
  } finally {
    Array.prototype.sort = sort;
    Array.prototype.toSorted = toSorted;
  }
}

const ids = (cars) => cars.map((car) => car.id).sort((a, b) => a - b);

export function assertSortsCorrectly(algorithm) {
  for (const [caseName, makeInput] of Object.entries(CASES)) {
    for (const field of Object.keys(SORT_FIELDS)) {
      for (const order of SORT_ORDERS) {
        const label = `${caseName} / ${field} / ${order}`;
        const input = makeInput(field);
        const expected = referenceSort(input, field, order).map((car) => car[field]);

        const run = withoutBuiltinSort(() => runSort(algorithm, input, { field, order }));

        assert.ok(Array.isArray(run.result), `${label}: o algoritmo deve retornar um array`);
        assert.deepEqual(run.result.map((car) => car[field]), expected, `${label}: ordem incorreta`);
        assert.deepEqual(ids(run.result), ids(input), `${label}: elementos perdidos ou duplicados`);
        assert.ok(Number.isInteger(run.comparisons) && run.comparisons >= 0, `${label}: comparações inválidas`);
        assert.ok(Number.isInteger(run.moves) && run.moves >= 0, `${label}: movimentações inválidas`);
      }
    }
  }
}
