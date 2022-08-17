import { nodeHTTPRequestHandler } from '@trpc/server/adapters/node-http';
import { appPathname } from './app-bridge';
import { appRouter, createContext } from './app-router';

import type { IncomingMessage, ServerResponse } from 'node:http';
import type { AppRouter } from './app-bridge';

function isAppPath(pathname: string) {
  return pathname.startsWith(appPathname);
}

// `+ 1` to exclude the leading solidus
const appPathStartAt = appPathname.length + 1;

function toAppPathname(pathname: string) {
  return pathname.substring(appPathStartAt);
}

function appHandler(req: IncomingMessage, res: ServerResponse, path: string) {
  return nodeHTTPRequestHandler<AppRouter, IncomingMessage, ServerResponse>({
    router: appRouter,
    createContext,
    req,
    res,
    path,
  });
}

export { appHandler, isAppPath, toAppPathname };
