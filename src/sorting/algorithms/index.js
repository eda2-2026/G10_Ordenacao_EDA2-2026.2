import { insertionSort } from './insertionSort.js';
import { mergeSort } from './mergeSort.js';
import { quickSort } from './quickSort.js';

// Algoritmos disponíveis na aplicação: nome -> função (arr, compare, metrics) => array ordenado.
export const ALGORITHMS = Object.freeze({
  insertion: insertionSort,
  merge: mergeSort,
  quick: quickSort,
});

export { insertionSort, mergeSort, quickSort };
