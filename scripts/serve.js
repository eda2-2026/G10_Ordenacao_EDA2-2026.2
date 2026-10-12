import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, resolve, sep } from 'node:path';

const HOST = '127.0.0.1';
const PORT = 4173;
const ROOT = resolve(process.cwd());

const MIME_TYPES = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
};

function resolveRequestPath(requestUrl) {
  const pathname = decodeURIComponent(new URL(requestUrl, `http://${HOST}`).pathname);
  const relativePath = pathname === '/' ? 'index.html' : pathname.slice(1);
  const filePath = resolve(ROOT, relativePath);

  if (filePath !== ROOT && !filePath.startsWith(`${ROOT}${sep}`)) {
    return null;
  }

  return filePath;
}

const server = createServer(async (request, response) => {
  const filePath = resolveRequestPath(request.url ?? '/');

  if (filePath === null) {
    response.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
    response.end('Acesso negado.');
    return;
  }

  try {
    const content = await readFile(filePath);
    response.writeHead(200, {
      'Content-Type': MIME_TYPES[extname(filePath)] ?? 'application/octet-stream',
      'Cache-Control': 'no-store',
    });
    response.end(content);
  } catch (error) {
    const status = error?.code === 'ENOENT' ? 404 : 500;
    response.writeHead(status, { 'Content-Type': 'text/plain; charset=utf-8' });
    response.end(status === 404 ? 'Arquivo não encontrado.' : 'Erro interno do servidor.');
  }
});

server.listen(PORT, HOST, () => {
  console.log(`AutoSort disponível em http://${HOST}:${PORT}`);
});
