import { formatInteger, formatTime } from './formatters.js';

export const COMPARISON_METRICS = Object.freeze(['comparisons', 'swaps', 'moves', 'timeMs']);

const metricFormatters = {
  comparisons: formatInteger,
  swaps: formatInteger,
  moves: formatInteger,
  timeMs: formatTime,
};

export function summarizeComparison(results) {
  const max = {};
  const min = {};

  for (const metric of COMPARISON_METRICS) {
    const values = results.map((row) => row[metric]);
    max[metric] = Math.max(...values);
    min[metric] = Math.min(...values);
  }

  return results.map((row) => ({
    algorithm: row.algorithm,
    metrics: COMPARISON_METRICS.map((metric) => ({
      metric,
      value: row[metric],
      ratio: max[metric] > 0 ? row[metric] / max[metric] : 0,
      best: row[metric] === min[metric],
    })),
  }));
}

export function renderComparison(tbody, results, algorithmLabels) {
  const fragment = document.createDocumentFragment();

  for (const row of summarizeComparison(results)) {
    const tr = document.createElement('tr');
    const name = document.createElement('th');
    name.scope = 'row';
    name.textContent = algorithmLabels[row.algorithm] ?? row.algorithm;
    tr.append(name);

    for (const { metric, value, ratio, best } of row.metrics) {
      const cell = document.createElement('td');
      cell.classList.toggle('comparison__cell--best', best);

      const text = document.createElement('span');
      text.textContent = metricFormatters[metric](value);

      const bar = document.createElement('span');
      bar.className = 'comparison__bar';
      bar.setAttribute('aria-hidden', 'true');
      bar.style.setProperty('--ratio', ratio.toFixed(4));

      cell.append(text, bar);
      tr.append(cell);
    }

    fragment.append(tr);
  }

  tbody.replaceChildren(fragment);
}
