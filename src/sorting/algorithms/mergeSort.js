// Intercala arr[left..mid] e arr[mid+1..right], já ordenados, usando o vetor auxiliar.
function merge(arr, aux, left, mid, right, compare, metrics) {
  for (let k = left; k <= right; k++) {
    aux[k] = arr[k];
    metrics.move();
  }

  let i = left;
  let j = mid + 1;

  for (let k = left; k <= right; k++) {
    if (i > mid) {
      arr[k] = aux[j++];
    } else if (j > right) {
      arr[k] = aux[i++];
    } else if (compare(aux[j], aux[i]) < 0) {
      arr[k] = aux[j++];
    } else {
      // Em caso de empate, a metade esquerda vem primeiro: mantém a ordenação estável.
      arr[k] = aux[i++];
    }
    metrics.move();
  }
}

function sortRange(arr, aux, left, right, compare, metrics) {
  if (left >= right) return;

  const mid = Math.floor((left + right) / 2);
  sortRange(arr, aux, left, mid, compare, metrics);
  sortRange(arr, aux, mid + 1, right, compare, metrics);
  merge(arr, aux, left, mid, right, compare, metrics);
}

export function mergeSort(arr, compare, metrics) {
  const aux = new Array(arr.length);
  sortRange(arr, aux, 0, arr.length - 1, compare, metrics);

  return arr;
}
