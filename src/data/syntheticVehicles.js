export const DEFAULT_SEED = 2026;

const MAX_YEAR = 2026;

const VEHICLE_OPTIONS = [
  {
    brand: 'Chevrolet',
    model: 'Onix',
    version: '1.0 Turbo',
    fuel: 'Flex',
    bodyType: 'Hatchback',
    minYear: 2020,
    basePrice: 95000,
  },
  {
    brand: 'Fiat',
    model: 'Argo',
    version: 'Drive 1.0',
    fuel: 'Flex',
    bodyType: 'Hatchback',
    minYear: 2018,
    basePrice: 82000,
  },
  {
    brand: 'Ford',
    model: 'Ranger',
    version: 'XLT 3.2',
    fuel: 'Diesel',
    bodyType: 'Picape',
    minYear: 2017,
    basePrice: 260000,
  },
  {
    brand: 'Honda',
    model: 'Civic',
    version: 'EXL 2.0',
    fuel: 'Flex',
    bodyType: 'Sedã',
    minYear: 2017,
    basePrice: 175000,
  },
  {
    brand: 'Hyundai',
    model: 'HB20',
    version: 'Comfort 1.0',
    fuel: 'Flex',
    bodyType: 'Hatchback',
    minYear: 2020,
    basePrice: 88000,
  },
  {
    brand: 'Jeep',
    model: 'Renegade',
    version: 'T270 1.3',
    fuel: 'Flex',
    bodyType: 'SUV',
    minYear: 2019,
    basePrice: 145000,
  },
  {
    brand: 'Nissan',
    model: 'Kicks',
    version: 'Advance 1.6',
    fuel: 'Flex',
    bodyType: 'SUV',
    minYear: 2018,
    basePrice: 132000,
  },
  {
    brand: 'Renault',
    model: 'Kwid',
    version: 'Zen 1.0',
    fuel: 'Flex',
    bodyType: 'Hatchback',
    minYear: 2018,
    basePrice: 72000,
  },
  {
    brand: 'Toyota',
    model: 'Corolla',
    version: 'XEi 2.0',
    fuel: 'Flex',
    bodyType: 'Sedã',
    minYear: 2017,
    basePrice: 180000,
  },
  {
    brand: 'Volkswagen',
    model: 'T-Cross',
    version: 'Comfortline 1.0 TSI',
    fuel: 'Flex',
    bodyType: 'SUV',
    minYear: 2020,
    basePrice: 158000,
  },
  {
    brand: 'BYD',
    model: 'Dolphin',
    version: 'GS',
    fuel: 'Elétrico',
    bodyType: 'Hatchback',
    minYear: 2023,
    basePrice: 150000,
  },
  {
    brand: 'Mercedes-Benz',
    model: 'A 35 AMG',
    version: '2.0 4MATIC',
    fuel: 'Gasolina',
    bodyType: 'Hatchback',
    minYear: 2019,
    basePrice: 390000,
  },
];

const COLORS = ['Branco', 'Cinza', 'Prata', 'Preto', 'Vermelho', 'Azul'];

const LOCATIONS = [
  { city: 'Belo Horizonte', state: 'MG' },
  { city: 'Brasília', state: 'DF' },
  { city: 'Campinas', state: 'SP' },
  { city: 'Curitiba', state: 'PR' },
  { city: 'Florianópolis', state: 'SC' },
  { city: 'Goiânia', state: 'GO' },
  { city: 'Porto Alegre', state: 'RS' },
  { city: 'Recife', state: 'PE' },
  { city: 'Rio de Janeiro', state: 'RJ' },
  { city: 'Salvador', state: 'BA' },
  { city: 'São Paulo', state: 'SP' },
];

function createRandom(seed) {
  let state = seed >>> 0;

  return () => {
    state = (Math.imul(1664525, state) + 1013904223) >>> 0;
    return state / 2 ** 32;
  };
}

function randomInteger(random, min, max) {
  return Math.floor(random() * (max - min + 1)) + min;
}

function randomItem(random, items) {
  return items[randomInteger(random, 0, items.length - 1)];
}

function createVehicle(random, index) {
  const option = randomItem(random, VEHICLE_OPTIONS);
  const location = randomItem(random, LOCATIONS);
  const year = randomInteger(random, option.minYear, MAX_YEAR);
  const age = MAX_YEAR - year;
  const mileage = Math.round(randomInteger(random, 0, (age + 1) * 18000) / 100) * 100;
  const depreciation = option.basePrice * age * 0.055;
  const usageDiscount = mileage * 0.08;
  const priceVariation = randomInteger(random, -5000, 5000);
  const price = Math.max(
    15000,
    Math.round((option.basePrice - depreciation - usageDiscount + priceVariation) / 500) * 500,
  );

  return {
    id: 10000001 + index,
    brand: option.brand,
    model: option.model,
    version: option.version,
    year,
    mileage,
    price,
    color: randomItem(random, COLORS),
    fuel: option.fuel,
    bodyType: option.bodyType,
    city: location.city,
    state: location.state,
  };
}

export function generateVehicles(count, { seed = DEFAULT_SEED } = {}) {
  if (!Number.isSafeInteger(count) || count < 0) {
    throw new TypeError('A quantidade deve ser um número inteiro não negativo.');
  }

  if (!Number.isSafeInteger(seed) || seed < 0) {
    throw new TypeError('A semente deve ser um número inteiro não negativo.');
  }

  const random = createRandom(seed);
  return Array.from({ length: count }, (_, index) => createVehicle(random, index));
}
