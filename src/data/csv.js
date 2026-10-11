// Leitor de CSV (RFC 4180): campos entre aspas podem conter vírgulas, quebras de linha e "" (aspas escapadas).
export function parseCsvRows(text) {
  const rows = [];
  let row = [];
  let field = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];

    if (inQuotes) {
      if (char === '"' && text[i + 1] === '"') {
        field += '"';
        i++;
      } else if (char === '"') {
        inQuotes = false;
      } else {
        field += char;
      }
    } else if (char === '"') {
      inQuotes = true;
    } else if (char === ',') {
      row.push(field);
      field = '';
    } else if (char === '\n' || char === '\r') {
      if (char === '\r' && text[i + 1] === '\n') i++;
      row.push(field);
      rows.push(row);
      row = [];
      field = '';
    } else {
      field += char;
    }
  }

  if (field !== '' || row.length > 0) {
    row.push(field);
    rows.push(row);
  }

  return rows;
}

export function parseCsv(text) {
  const [header, ...rows] = parseCsvRows(text.replace(/^﻿/, ''));
  if (!header) return [];

  return rows
    .filter((row) => row.some((value) => value !== ''))
    .map((row) => Object.fromEntries(header.map((column, i) => [column, row[i] ?? ''])));
}
