import { Worker } from 'bullmq';
import { helloProcessor } from './hello.processor';
import { parseRedisUrl } from './redis';

const QUEUE_NAME = process.env['QUEUE_NAME'] ?? 'hello';
const REDIS_URL = process.env['REDIS_URL'] ?? 'redis://localhost:6379';

async function main(): Promise<void> {
  const connection = parseRedisUrl(REDIS_URL);

  const worker = new Worker(QUEUE_NAME, helloProcessor, {
    connection,
    concurrency: parseInt(process.env['WORKER_CONCURRENCY'] ?? '5', 10),
  });

  worker.on('completed', (job) => {
    process.stdout.write(`[${QUEUE_NAME}] job ${job.id} completed\n`);
  });

  worker.on('failed', (job, err) => {
    process.stderr.write(
      `[${QUEUE_NAME}] job ${job?.id ?? 'unknown'} failed: ${err.message}\n`,
    );
  });

  process.stderr.write(`Worker started — queue: ${QUEUE_NAME}, redis: ${REDIS_URL}\n`);

  // Graceful shutdown
  const shutdown = async (): Promise<void> => {
    process.stderr.write('Shutting down worker...\n');
    await worker.close();
    process.exit(0);
  };

  process.on('SIGTERM', () => void shutdown());
  process.on('SIGINT', () => void shutdown());
}

main().catch((err: unknown) => {
  process.stderr.write(
    `Fatal: ${err instanceof Error ? err.message : String(err)}\n`,
  );
  process.exit(1);
});
