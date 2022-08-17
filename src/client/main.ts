import { createTRPCClient } from '@trpc/client';
import { appPathname } from '../server/app-bridge';

import type { AppRouter } from '../server/app-bridge';

const urlBase = (() => {
  const url = new URL(window.location.origin);
  url.pathname = appPathname;
  return url.href;
})();

async function main() {
  const client = createTRPCClient<AppRouter>({
    url: urlBase,
  });

  const queryInput = {
    name: 'world',
  };
  const helloResponse = await client.query('hello', queryInput);

  console.log('helloResponse', helloResponse);
}

main();
