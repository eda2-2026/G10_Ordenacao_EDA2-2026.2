import { heapSort } from './heapSort.js';
import { insertionSort } from './insertionSort.js';
import { mergeSort } from './mergeSort.js';
import { quickSort } from './quickSort.js';

export const ALGORITHMS = Object.freeze({
  insertion: insertionSort,
  merge: mergeSort,
  quick: quickSort,
  heap: heapSort,
});

export { heapSort, insertionSort, mergeSort, quickSort };
