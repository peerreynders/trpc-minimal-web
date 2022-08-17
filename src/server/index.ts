import http from 'node:http';
import { basename, join } from 'node:path';
import { promises as fs } from 'fs';
import { isAppPath, toAppPathname, appHandler } from './app-handler';

import type { IncomingMessage, ServerResponse } from 'node:http';

type FileDetails = [
  base: string,
  ext: string,
  encoding: BufferEncoding | undefined
];
type FileEntry = [string, FileDetails];

const port = 2022;
const defaultFile = 'index.html';
const defaultFileEntry: FileEntry = [defaultFile, ['index', '.html', 'utf8']];
const files: {
  [key: string]: FileDetails;
} = {
  [defaultFileEntry[0]]: defaultFileEntry[1],
  'favicon.ico': ['favicon', '.ico', undefined],
  'index.css': ['index', '.css', 'utf8'],
  'main.js': ['main', '.js', 'utf8'],
};

const mimeTypes: {
  [key: string]: string;
} = {
  '.css': 'text/css',
  '.html': 'text/html',
  '.ico': 'vnd.microsoft.icon',
  '.js': 'text/javascript',
};

function fileDetails(name: string): FileEntry {
  const details = files[name];
  if (details) return [name, details];

  return defaultFileEntry;
}

function makeAssetLocation(name: string) {
  return join(__dirname, '/dist', name);
}

async function serveFile(filename: string, res: ServerResponse) {
  const [name, [, ext, encoding]] = fileDetails(filename);
  const contentType = mimeTypes[ext];
  if (contentType) res.writeHead(200, { 'Content-Type': contentType });

  const content = await fs.readFile(makeAssetLocation(name));
  if (encoding) res.end(content, encoding);
  else res.end(content);
}

function serveFileNotFound(req: IncomingMessage, res: ServerResponse) {
  res.writeHead(404, { 'Content-Type': 'text/plain' });
  res.end(`${req.url} not found!`, 'utf8');
}

const hasOwnProperty = Object.hasOwnProperty;

function hasOwn(object: unknown, key: string): boolean {
  if (!(object && typeof object === 'object')) return false;
  return hasOwnProperty.call(object, key);
}

function urlFromRequest({ socket, headers, url }: IncomingMessage) {
  const host = headers.host;
  if (!host) return undefined;

  const protocol = hasOwn(socket, 'encrypted') ? 'https://' : 'http://';
  return new URL(protocol + host + url);
}

function requestListener(req: IncomingMessage, res: ServerResponse) {
  console.log(`request ${req.url}`);

  const url = urlFromRequest(req);

  if (!url) return serveFileNotFound(req, res);

  if (isAppPath(url.pathname))
    return appHandler(req, res, toAppPathname(url.pathname));

  const filename = basename(url.pathname) || defaultFile;
  return hasOwn(files, filename)
    ? serveFile(filename, res)
    : serveFileNotFound(req, res);
}

const server = http.createServer(requestListener);
server.listen(port);
console.log(`Server running at http://localhost:${port}/`);
