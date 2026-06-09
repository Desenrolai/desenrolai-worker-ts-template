import { describe, it, expect, vi } from 'vitest';
import type { Job } from 'bullmq';
import { helloProcessor } from './hello.processor';
import type { HelloJobData } from './hello.processor';

describe('helloProcessor', () => {
  it('processes a job without throwing', async () => {
    const writeSpy = vi.spyOn(process.stdout, 'write').mockImplementation(() => true);

    const mockJob = {
      id: 'test-1',
      data: { message: 'hi from test' },
    } as unknown as Job<HelloJobData>;

    await expect(helloProcessor(mockJob)).resolves.toBeUndefined();
    expect(writeSpy).toHaveBeenCalledWith(expect.stringContaining('hi from test'));

    writeSpy.mockRestore();
  });
});
