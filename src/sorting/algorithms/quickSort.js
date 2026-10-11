import { swap } from '../metrics.js';

function sortRange(arr, left, right, compare, metrics) {
  let i = left;
  let j = right;
  const pivot = arr[Math.floor((left + right) / 2)];
  metrics.move();

  while (i <= j) {
    while (compare(arr[i], pivot) < 0) i++;
    while (compare(arr[j], pivot) > 0) j--;

    if (i <= j) {
      swap(arr, i, j, metrics);
      i++;
      j--;
    }
  }

  if (left < j) sortRange(arr, left, j, compare, metrics);
  if (i < right) sortRange(arr, i, right, compare, metrics);
}

export function quickSort(arr, compare, metrics) {
  if (arr.length > 1) {
    sortRange(arr, 0, arr.length - 1, compare, metrics);
  }

  return arr;
}
