// Gera data/webmotors-vehicles.json a partir do CSV bruto em data/raw.
// npm run data [-- caminho/do/arquivo.csv]
import { readFileSync, writeFileSync } from 'node:fs';

import { parseCsv } from '../src/data/csv.js';
import { normalizeVehicles } from '../src/data/vehicles.js';

const input = process.argv[2] ?? 'data/raw/Webmotors-dataset-sample.csv';
const output = 'data/webmotors-vehicles.json';

const rows = parseCsv(readFileSync(input, 'utf-8'));
const vehicles = normalizeVehicles(rows);

writeFileSync(output, `${JSON.stringify(vehicles, null, 2)}\n`);
console.log(`${vehicles.length} de ${rows.length} anúncios salvos em ${output}`);
