# desenrolai-worker-ts-template

Template for BullMQ workers (TypeScript).

## Stack

- Node 22 + TypeScript (CommonJS)
- `bullmq` + `ioredis` — queue processing
- `vitest` — tests

## Structure

```
src/
  index.ts              # entrypoint — creates Worker, registers processors
  hello.processor.ts    # example job processor (replace with your logic)
  redis.ts              # Redis connection factory
  hello.processor.test.ts
```

## Getting started

```bash
npm ci
REDIS_URL=redis://localhost:6379 npm run dev   # run via tsx
npm run build
REDIS_URL=redis://localhost:6379 npm start
npm test
```

## Environment variables

| Variable | Default | Description |
|----------|---------|-------------|
| `REDIS_URL` | `redis://localhost:6379` | Redis connection string |
| `QUEUE_NAME` | `hello` | BullMQ queue to consume |
| `WORKER_CONCURRENCY` | `5` | Max concurrent jobs |

## Deploy

Deployed as a Kubernetes **Deployment** with no Service or Ingress.
No HTTP port is exposed. See `forge.yaml` for resource configuration.
