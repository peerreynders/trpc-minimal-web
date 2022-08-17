# trpc-minimal-web
Minimal server/browser demo of a query

---

```shell
$ npm run build:server

  > trpc-minimal@0.0.0 build:server
  > ./node_modules/.bin/tsc --project tsconfig.server.json

$ npm run build:client

  > trpc-minimal@0.0.0 build:client
  > ./node_modules/.bin/tsc --project tsconfig.json ; ./node_modules/.bin/rollup -c

  ./client/client/main.js → ./server/dist...
  created ./server/dist in 220ms
$ npm run start

  > trpc-minimal@0.0.0 start
  > node ./server/index.js

  Server running at http://localhost:2022/
```
