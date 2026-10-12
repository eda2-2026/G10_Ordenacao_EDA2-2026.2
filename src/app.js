import { ALGORITHMS } from './sorting/algorithms/index.js';
import { runSort } from './sorting/runner.js';
import { renderCatalogError, renderMetrics, renderVehicles } from './ui/catalog.js';
import { generateVehicles } from './data/syntheticVehicles.js';
import { formatInteger } from './ui/formatters.js';

const DATA_URL = './data/sample-vehicles.json';
const DISPLAY_LIMIT = 20;
const DATASET_SIZES = new Set([20, 100, 1000, 10000]);

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
  catalogCount: document.querySelector('#catalog-count'),
  metrics: {
    comparisons: document.querySelector('#metric-comparisons'),
    swaps: document.querySelector('#metric-swaps'),
    moves: document.querySelector('#metric-moves'),
    time: document.querySelector('#metric-time'),
  },
};

let sourceVehicles = [];

function updateVehicleCount(total, displayed = total) {
  elements.vehicleCount.textContent = formatInteger(total);
  elements.catalogCount.textContent =
    displayed === total
      ? `${formatInteger(total)} ${total === 1 ? 'veículo' : 'veículos'}`
      : `Exibindo ${formatInteger(displayed)} de ${formatInteger(total)}`;
}

function setStatus(message, { error = false } = {}) {
  elements.status.textContent = message;
  elements.status.classList.toggle('status--error', error);
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
    const vehicles = size === sourceVehicles.length ? sourceVehicles : generateVehicles(size);
    const run = runSort(algorithm, vehicles, { field, order });
    const displayedVehicles = run.result.slice(0, DISPLAY_LIMIT);
    const displayMessage =
      displayedVehicles.length < run.result.length
        ? ` Exibindo os primeiros ${formatInteger(displayedVehicles.length)}.`
        : '';

    renderVehicles(elements.catalog, elements.template, displayedVehicles);
    renderMetrics(elements.metrics, run);
    updateVehicleCount(run.result.length, displayedVehicles.length);
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

async function initialize() {
  elements.button.disabled = true;

  try {
    sourceVehicles = await loadVehicles();
    renderVehicles(elements.catalog, elements.template, sourceVehicles);
    updateVehicleCount(sourceVehicles.length);
    setStatus(`${sourceVehicles.length} veículos carregados. Escolha os parâmetros para iniciar.`);
    elements.button.disabled = false;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Não foi possível iniciar o catálogo.';
    setStatus(message, { error: true });
    renderCatalogError(elements.catalog, message);
  }
}

elements.form.addEventListener('submit', sortCatalog);
initialize();
