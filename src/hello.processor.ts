import type { Job } from 'bullmq';

export interface HelloJobData {
  message: string;
}

/**
 * Example processor — replace with your actual job logic.
 * Idempotent: safe to run more than once for the same job.
 */
export async function helloProcessor(job: Job<HelloJobData>): Promise<void> {
  const { message } = job.data;
  process.stdout.write(`[hello] job ${job.id} — ${message}\n`);

  // Simulate async work
  await new Promise<void>((resolve) => setTimeout(resolve, 50));
}
