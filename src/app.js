import { runBenchmark } from './analysis/benchmark.js';
import { ALGORITHMS } from './sorting/algorithms/index.js';
import { runSort } from './sorting/runner.js';
import { renderCatalogError, renderMetrics, renderVehicles } from './ui/catalog.js';
import { renderComparison } from './ui/comparison.js';
import { formatInteger } from './ui/formatters.js';

const DATA_URL = './data/vehicles.json';
const DISPLAY_LIMIT = 20;
const DATASET_SIZES = new Set([20, 100, 1000, 10000]);
const REQUIRED_DATASET_SIZE = Math.max(...DATASET_SIZES);

const algorithmLabels = {
  insertion: 'Insertion Sort',
  merge: 'Merge Sort',
  quick: 'Quick Sort',
  heap: 'Heap Sort',
};

const fieldLabels = {
  brand: 'marca',
  model: 'modelo',
  year: 'ano',
  mileage: 'quilometragem',
  price: 'preço',
};

const orderLabels = {
  asc: 'ordem crescente',
  desc: 'ordem decrescente',
};

const scenarioLabels = {
  random: 'entrada aleatória',
  sorted: 'entrada já ordenada',
  reversed: 'entrada em ordem inversa',
};

const elements = {
  form: document.querySelector('#sort-form'),
  size: document.querySelector('#size'),
  algorithm: document.querySelector('#algorithm'),
  field: document.querySelector('#field'),
  order: document.querySelector('#order'),
  button: document.querySelector('#sort-button'),
  status: document.querySelector('#status'),
  catalog: document.querySelector('#catalog'),
  template: document.querySelector('#vehicle-card-template'),
  vehicleCount: document.querySelector('#vehicle-count'),
  comparison: {
    form: document.querySelector('#comparison-form'),
    scenario: document.querySelector('#scenario'),
    button: document.querySelector('#comparison-button'),
    status: document.querySelector('#comparison-status'),
    body: document.querySelector('#comparison-body'),
  },
  catalogCount: document.querySelector('#catalog-count'),
  metrics: {
    comparisons: document.querySelector('#metric-comparisons'),
    swaps: document.querySelector('#metric-swaps'),
    moves: document.querySelector('#metric-moves'),
    time: document.querySelector('#metric-time'),
  },
};

let sourceVehicles = [];

function updateDatasetCount(total) {
  elements.vehicleCount.textContent = formatInteger(total);
}

function updateCatalogCount(total, displayed = total) {
  elements.catalogCount.textContent =
    displayed === total
      ? `${formatInteger(total)} ${total === 1 ? 'veículo' : 'veículos'}`
      : `Exibindo ${formatInteger(displayed)} de ${formatInteger(total)}`;
}

function setStatus(message, { error = false, target = elements.status } = {}) {
  target.textContent = message;
  target.classList.toggle('status--error', error);
}

function vehiclesForSize(size) {
  if (sourceVehicles.length < size) {
    throw new RangeError(`A base contém apenas ${formatInteger(sourceVehicles.length)} veículos.`);
  }

  return sourceVehicles.slice(0, size);
}

async function loadVehicles() {
  const response = await fetch(DATA_URL);
  if (!response.ok) {
    throw new Error(`Não foi possível carregar os veículos (${response.status}).`);
  }

  const vehicles = await response.json();
  if (!Array.isArray(vehicles)) {
    throw new TypeError('O arquivo de veículos não contém uma lista válida.');
  }
  if (vehicles.length < REQUIRED_DATASET_SIZE) {
    throw new RangeError(
      `A base precisa conter pelo menos ${formatInteger(REQUIRED_DATASET_SIZE)} veículos.`,
    );
  }

  return vehicles;
}

function waitForNextPaint() {
  return new Promise((resolve) => requestAnimationFrame(() => resolve()));
}

async function sortCatalog(event) {
  event.preventDefault();

  const size = Number(elements.size.value);
  const algorithmName = elements.algorithm.value;
  const field = elements.field.value;
  const order = elements.order.value;
  const algorithm = ALGORITHMS[algorithmName];

  if (!DATASET_SIZES.has(size) || !algorithm || sourceVehicles.length === 0) return;

  elements.button.disabled = true;
  const intensiveInsertion = algorithmName === 'insertion' && size === 10000;
  setStatus(
    intensiveInsertion
      ? 'Executando Insertion Sort com 10.000 veículos. Esta combinação pode demorar…'
      : `Preparando ${formatInteger(size)} veículos para ordenação…`,
  );
  await waitForNextPaint();

  try {
    const vehicles = vehiclesForSize(size);
    const run = runSort(algorithm, vehicles, { field, order });
    const displayedVehicles = run.result.slice(0, DISPLAY_LIMIT);
    const displayMessage =
      displayedVehicles.length < run.result.length
        ? ` Exibindo os primeiros ${formatInteger(displayedVehicles.length)}.`
        : '';

    renderVehicles(elements.catalog, elements.template, displayedVehicles);
    renderMetrics(elements.metrics, run);
    updateCatalogCount(run.result.length, displayedVehicles.length);
    setStatus(
      `${algorithmLabels[algorithmName]} ordenou ${formatInteger(run.result.length)} veículos por ${fieldLabels[field]}, em ${orderLabels[order]}.${displayMessage}`,
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Não foi possível ordenar o catálogo.';
    setStatus(message, { error: true });
  } finally {
    elements.button.disabled = false;
  }
}

async function compareAlgorithms(event) {
  event.preventDefault();

  const size = Number(elements.size.value);
  const field = elements.field.value;
  const order = elements.order.value;
  const scenario = elements.comparison.scenario.value;
  const { button, status, body } = elements.comparison;

  if (!DATASET_SIZES.has(size) || !scenarioLabels[scenario] || sourceVehicles.length === 0) return;

  const repetitions = size >= 10000 ? 1 : 3;

  button.disabled = true;
  setStatus(
    size >= 10000
      ? 'Comparando com 10.000 veículos. O Insertion Sort pode levar alguns segundos…'
      : `Comparando os algoritmos com ${formatInteger(size)} veículos…`,
    { target: status },
  );
  await waitForNextPaint();

  try {
    const vehicles = vehiclesForSize(size);
    const results = runBenchmark({
      sizes: [size],
      scenarios: [scenario],
      field,
      order,
      repetitions,
      makeData: () => vehicles,
    });

    renderComparison(body, results, algorithmLabels);
    setStatus(
      `${formatInteger(size)} veículos por ${fieldLabels[field]}, em ${orderLabels[order]}, com ${scenarioLabels[scenario]}. ` +
        (repetitions > 1 ? `Tempo: mediana de ${repetitions} execuções.` : 'Tempo de uma execução.'),
      { target: status },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Não foi possível comparar os algoritmos.';
    setStatus(message, { error: true, target: status });
  } finally {
    button.disabled = false;
  }
}

async function initialize() {
  elements.button.disabled = true;
  elements.comparison.button.disabled = true;

  try {
    sourceVehicles = await loadVehicles();
    const initialVehicles = sourceVehicles.slice(0, DISPLAY_LIMIT);
    renderVehicles(elements.catalog, elements.template, initialVehicles);
    updateDatasetCount(sourceVehicles.length);
    updateCatalogCount(sourceVehicles.length, initialVehicles.length);
    setStatus(
      `${formatInteger(sourceVehicles.length)} veículos carregados. Escolha os parâmetros para iniciar.`,
    );
    elements.button.disabled = false;
    elements.comparison.button.disabled = false;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Não foi possível iniciar o catálogo.';
    setStatus(message, { error: true });
    renderCatalogError(elements.catalog, message);
  }
}

elements.form.addEventListener('submit', sortCatalog);
elements.comparison.form.addEventListener('submit', compareAlgorithms);
initialize();
