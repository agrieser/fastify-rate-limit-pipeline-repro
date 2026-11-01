# HTTP/1.1 pipelining and @fastify/rate-limit

One route, a fresh default in-memory store, and six HTTP/1.1 requests sent together on one connection.
The limit is five requests per minute.
There are no custom hooks, key generators, or store implementations.

## Run

Requires Node.js 20 or later and pnpm.

```sh
pnpm install --ignore-scripts
pnpm start
```

Observed on Node.js 24.19.0, Fastify 5.12.7, and @fastify/rate-limit 11.2.1, on Debian 12 (Linux 6.1.158+, x86_64):

```text
[ 429, 429, 429, 429, 429, 429 ]
```

I expected five requests to receive 200 and one to receive 429.
Is rejecting the entire pipeline intentional, or should each request be evaluated against the count returned by its own increment?
