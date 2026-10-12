import { formatInteger, formatMileage, formatPrice, formatTime } from './formatters.js';

function textOrFallback(value) {
  return value ?? 'Não informado';
}

function brandInitials(brand) {
  return String(brand ?? '?')
    .split(/[\s-]+/)
    .filter(Boolean)
    .map((word) => word[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

function setField(card, field, value) {
  card.querySelector(`[data-field="${field}"]`).textContent = value;
}

export function renderVehicles(container, template, vehicles) {
  const fragment = document.createDocumentFragment();

  vehicles.forEach((vehicle) => {
    const card = template.content.firstElementChild.cloneNode(true);
    const visual = card.querySelector('[data-field="visual"]');

    visual.dataset.tone = String(vehicle.id % 4);
    setField(card, 'initials', brandInitials(vehicle.brand));
    setField(card, 'bodyType', textOrFallback(vehicle.bodyType));
    setField(card, 'brand', textOrFallback(vehicle.brand));
    setField(card, 'model', textOrFallback(vehicle.model));
    setField(card, 'version', textOrFallback(vehicle.version));
    setField(card, 'year', textOrFallback(vehicle.year));
    setField(card, 'mileage', formatMileage(vehicle.mileage));
    setField(card, 'fuel', textOrFallback(vehicle.fuel));
    setField(card, 'location', [vehicle.city, vehicle.state].filter(Boolean).join(' · ') || 'Local não informado');
    setField(card, 'price', formatPrice(vehicle.price));
    setField(card, 'id', `#${vehicle.id}`);

    fragment.append(card);
  });

  container.replaceChildren(fragment);
  container.setAttribute('aria-busy', 'false');
}

export function renderMetrics(elements, metrics) {
  elements.comparisons.textContent = formatInteger(metrics.comparisons);
  elements.swaps.textContent = formatInteger(metrics.swaps);
  elements.moves.textContent = formatInteger(metrics.moves);
  elements.time.textContent = formatTime(metrics.timeMs);
}

export function renderCatalogError(container, message) {
  const error = document.createElement('p');
  error.className = 'catalog-error';
  error.textContent = message;
  container.replaceChildren(error);
  container.setAttribute('aria-busy', 'false');
}
