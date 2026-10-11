import { insertionSort } from './insertionSort.js';

// Algoritmos disponíveis na aplicação: nome -> função (arr, compare, metrics) => array ordenado.
export const ALGORITHMS = Object.freeze({
  insertion: insertionSort,
});

export { insertionSort };
