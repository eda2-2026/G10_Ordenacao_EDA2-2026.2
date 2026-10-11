import { insertionSort } from './insertionSort.js';
import { quickSort } from './quickSort.js';

// Algoritmos disponíveis na aplicação: nome -> função (arr, compare, metrics) => array ordenado.
export const ALGORITHMS = Object.freeze({
  insertion: insertionSort,
  quick: quickSort,
});

export { insertionSort, quickSort };
