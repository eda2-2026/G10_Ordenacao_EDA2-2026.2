import { swap } from '../metrics.js';

function siftDown(arr, root, end, compare, metrics) {
  while (2 * root + 1 < end) {
    let child = 2 * root + 1;
    if (child + 1 < end && compare(arr[child], arr[child + 1]) < 0) child++;

    if (compare(arr[root], arr[child]) >= 0) return;

    swap(arr, root, child, metrics);
    root = child;
  }
}

export function heapSort(arr, compare, metrics) {
  // Constrói o heap máximo a partir do último nó que tem filhos.
  for (let i = Math.floor(arr.length / 2) - 1; i >= 0; i--) {
    siftDown(arr, i, arr.length, compare, metrics);
  }

  // Move o maior elemento para o fim e restaura o heap no restante.
  for (let end = arr.length - 1; end > 0; end--) {
    swap(arr, 0, end, metrics);
    siftDown(arr, 0, end, compare, metrics);
  }

  return arr;
}
