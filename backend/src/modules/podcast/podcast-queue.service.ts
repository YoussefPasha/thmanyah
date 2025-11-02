import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { PodcastJob } from './entities/podcast-job.entity';
import { ITunesPodcast } from './interfaces/itunes-response.interface';

@Injectable()
export class PodcastQueueService {
  private readonly logger = new Logger(PodcastQueueService.name);

  constructor(
    @InjectRepository(PodcastJob)
    private podcastJobRepository: Repository<PodcastJob>,
  ) {}

  /**
   * Add a single job to the queue
   */
  async addJob(podcastData: ITunesPodcast): Promise<PodcastJob> {
    this.logger.debug(`Adding job for podcast: ${podcastData.trackName}`);

    const job = this.podcastJobRepository.create({
      trackId: podcastData.trackId,
      trackName: podcastData.trackName,
      podcastData,
      status: 'pending',
      attempts: 0,
      maxAttempts: 3,
    });

    return await this.podcastJobRepository.save(job);
  }

  /**
   * Add multiple jobs to the queue in bulk
   */
  async addJobs(podcastsData: ITunesPodcast[]): Promise<PodcastJob[]> {
    if (podcastsData.length === 0) {
      return [];
    }

    this.logger.debug(`Adding ${podcastsData.length} jobs to queue`);

    const jobs = podcastsData.map((podcastData) =>
      this.podcastJobRepository.create({
        trackId: podcastData.trackId,
        trackName: podcastData.trackName,
        podcastData,
        status: 'pending',
        attempts: 0,
        maxAttempts: 3,
      }),
    );

    return await this.podcastJobRepository.save(jobs);
  }

  /**
   * Get next jobs to process
   * Fetches pending jobs without locking (locking will be handled by status update)
   */
  async getNextJobs(limit: number = 10): Promise<PodcastJob[]> {
    const jobs = await this.podcastJobRepository.find({
      where: {
        status: 'pending',
      },
      order: {
        createdAt: 'ASC',
      },
      take: limit,
    });

    // Filter jobs that haven't exceeded max attempts
    return jobs.filter((job) => job.attempts < job.maxAttempts);
  }

  /**
   * Mark job as processing
   */
  async markJobAsProcessing(jobId: number): Promise<void> {
    this.logger.debug(`Marking job ${jobId} as processing`);

    await this.podcastJobRepository.update(jobId, {
      status: 'processing',
      lastAttemptAt: new Date(),
    });
  }

  /**
   * Mark job as completed
   */
  async markJobAsCompleted(jobId: number): Promise<void> {
    this.logger.debug(`Marking job ${jobId} as completed`);

    await this.podcastJobRepository.update(jobId, {
      status: 'completed',
      completedAt: new Date(),
    });
  }

  /**
   * Mark job as failed
   * Increments attempts and marks as failed if max attempts reached
   */
  async markJobAsFailed(jobId: number, error: string): Promise<void> {
    const job = await this.podcastJobRepository.findOne({ where: { id: jobId } });

    if (!job) {
      this.logger.warn(`Job ${jobId} not found`);
      return;
    }

    const newAttempts = job.attempts + 1;
    const isFailed = newAttempts >= job.maxAttempts;

    this.logger.debug(
      `Marking job ${jobId} as failed (attempt ${newAttempts}/${job.maxAttempts})`,
    );

    await this.podcastJobRepository.update(jobId, {
      status: isFailed ? 'failed' : 'pending',
      attempts: newAttempts,
      error,
      lastAttemptAt: new Date(),
    });
  }

  /**
   * Get job statistics
   */
  async getJobStats(): Promise<{
    pending: number;
    processing: number;
    completed: number;
    failed: number;
    total: number;
  }> {
    const [pending, processing, completed, failed, total] = await Promise.all([
      this.podcastJobRepository.count({ where: { status: 'pending' } }),
      this.podcastJobRepository.count({ where: { status: 'processing' } }),
      this.podcastJobRepository.count({ where: { status: 'completed' } }),
      this.podcastJobRepository.count({ where: { status: 'failed' } }),
      this.podcastJobRepository.count(),
    ]);

    return { pending, processing, completed, failed, total };
  }

  /**
   * Check if a job already exists for a given trackId
   */
  async jobExistsForTrackId(trackId: number): Promise<boolean> {
    const count = await this.podcastJobRepository.count({
      where: {
        trackId,
        status: In(['pending', 'processing', 'completed']),
      },
    });

    return count > 0;
  }

  /**
   * Bulk check if jobs exist for multiple trackIds
   */
  async getExistingJobTrackIds(trackIds: number[]): Promise<number[]> {
    if (trackIds.length === 0) {
      return [];
    }

    const jobs = await this.podcastJobRepository.find({
      where: {
        trackId: In(trackIds),
        status: In(['pending', 'processing', 'completed']),
      },
      select: ['trackId'],
    });

    return jobs.map((job) => job.trackId);
  }
}

