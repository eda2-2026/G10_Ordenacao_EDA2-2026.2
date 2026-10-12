import { ALGORITHMS } from './sorting/algorithms/index.js';
import { runSort } from './sorting/runner.js';
import { renderCatalogError, renderMetrics, renderVehicles } from './ui/catalog.js';

const DATA_URL = './data/sample-vehicles.json';

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

function updateVehicleCount(count) {
  elements.vehicleCount.textContent = String(count).padStart(2, '0');
  elements.catalogCount.textContent = `${count} ${count === 1 ? 'veículo' : 'veículos'}`;
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

function sortCatalog(event) {
  event.preventDefault();

  const algorithmName = elements.algorithm.value;
  const field = elements.field.value;
  const order = elements.order.value;
  const algorithm = ALGORITHMS[algorithmName];

  if (!algorithm || sourceVehicles.length === 0) return;

  const run = runSort(algorithm, sourceVehicles, { field, order });
  renderVehicles(elements.catalog, elements.template, run.result);
  renderMetrics(elements.metrics, run);
  setStatus(
    `${algorithmLabels[algorithmName]} ordenou ${run.result.length} veículos por ${fieldLabels[field]}, em ${orderLabels[order]}.`,
  );
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
