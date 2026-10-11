export function insertionSort(arr, compare, metrics) {
  for (let i = 1; i < arr.length; i++) {
    const current = arr[i];
    metrics.move();

    let j = i - 1;
    while (j >= 0 && compare(arr[j], current) > 0) {
      arr[j + 1] = arr[j];
      metrics.move();
      j--;
    }

    arr[j + 1] = current;
    metrics.move();
  }

  return arr;
}
