// Normaliza os anúncios do dataset da Webmotors para o formato usado pela aplicação.

export function cleanText(value) {
  const text = String(value ?? '').replace(/\s+/g, ' ').trim();
  return text === '' ? null : text;
}

export function parseInteger(value) {
  const text = cleanText(value);
  if (text === null || !/^\d+$/.test(text)) return null;
  return Number(text);
}

// "São Paulo (SP)" -> "SP"
export function parseState(value) {
  const match = cleanText(value)?.match(/\(([A-Z]{2})\)$/);
  return match ? match[1] : null;
}

export function normalizeVehicle(row) {
  return {
    id: parseInteger(row.id),
    brand: cleanText(row.Marca),
    model: cleanText(row.Modelo),
    version: cleanText(row.Variante),
    year: parseInteger(row.Ano),
    mileage: parseInteger(row.Kilometraje),
    price: parseInteger(row.price),
    color: cleanText(row.Color),
    fuel: cleanText(row.Combustible),
    bodyType: cleanText(row.carroceria),
    city: cleanText(row.Comuna),
    state: parseState(row.Ciudad),
  };
}

// Descarta anúncios sem id e ids repetidos 
export function normalizeVehicles(rows) {
  const seen = new Set();
  const vehicles = [];

  for (const row of rows) {
    const vehicle = normalizeVehicle(row);
    if (vehicle.id === null || seen.has(vehicle.id)) continue;

    seen.add(vehicle.id);
    vehicles.push(vehicle);
  }

  return vehicles;
}
