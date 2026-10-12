import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, relative, resolve } from 'node:path';

import { DEFAULT_SEED, generateVehicles } from '../src/data/syntheticVehicles.js';

const [sizeText = '100', outputText = 'data/vehicles.json', seedText = String(DEFAULT_SEED)] = process.argv.slice(2);

function parseArgument(value, name) {
  if (!/^\d+$/.test(value)) {
    throw new TypeError(`${name} deve ser um número inteiro não negativo.`);
  }

  return Number(value);
}

const size = parseArgument(sizeText, 'A quantidade');
const seed = parseArgument(seedText, 'A semente');
const outputPath = resolve(outputText);
const vehicles = generateVehicles(size, { seed });

await mkdir(dirname(outputPath), { recursive: true });
await writeFile(outputPath, `${JSON.stringify(vehicles, null, 2)}\n`, 'utf8');

console.log(`${vehicles.length} veículos gerados em ${relative(process.cwd(), outputPath)} (semente ${seed}).`);
