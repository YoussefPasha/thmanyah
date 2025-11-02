import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Podcast } from './entities/podcast.entity';
import { PodcastQueueService } from './podcast-queue.service';
import { ITunesPodcast } from './interfaces/itunes-response.interface';

@Injectable()
export class PodcastWorkerService {
  private readonly logger = new Logger(PodcastWorkerService.name);
  private isProcessing = false;

  constructor(
    private podcastQueueService: PodcastQueueService,
    @InjectRepository(Podcast)
    private podcastRepository: Repository<Podcast>,
  ) {}

  /**
   * Process podcast jobs every 10 seconds
   */
  @Cron('*/10 * * * * *')
  async processJobs(): Promise<void> {
    // Prevent concurrent processing
    if (this.isProcessing) {
      this.logger.debug('Skipping job processing - already in progress');
      return;
    }

    this.isProcessing = true;

    try {
      const jobs = await this.podcastQueueService.getNextJobs(10);

      if (jobs.length === 0) {
        this.logger.debug('No pending jobs to process');
        return;
      }

      this.logger.log(`Processing ${jobs.length} podcast jobs`);

      // Process jobs in parallel
      await Promise.allSettled(
        jobs.map((job) => this.processJob(job.id, job.podcastData)),
      );

      // Log queue stats
      const stats = await this.podcastQueueService.getJobStats();
      this.logger.log(
        `Queue stats - Pending: ${stats.pending}, Processing: ${stats.processing}, Completed: ${stats.completed}, Failed: ${stats.failed}`,
      );
    } catch (error) {
      this.logger.error('Error processing jobs', error.message);
    } finally {
      this.isProcessing = false;
    }
  }

  /**
   * Process a single job
   */
  private async processJob(jobId: number, podcastData: ITunesPodcast): Promise<void> {
    try {
      // Mark as processing
      await this.podcastQueueService.markJobAsProcessing(jobId);

      this.logger.debug(`Processing job ${jobId} for podcast: ${podcastData.trackName}`);

      // Check if podcast already exists
      const existingPodcast = await this.podcastRepository.findOne({
        where: { trackId: podcastData.trackId },
      });

      if (existingPodcast) {
        // Update existing podcast
        const updatedData = this.mapITunesPodcastToEntity(podcastData);
        Object.assign(existingPodcast, updatedData);
        await this.podcastRepository.save(existingPodcast);
        this.logger.debug(`Updated podcast: ${podcastData.trackName}`);
      } else {
        // Create new podcast
        const newPodcast = this.podcastRepository.create(
          this.mapITunesPodcastToEntity(podcastData),
        );
        await this.podcastRepository.save(newPodcast);
        this.logger.debug(`Created new podcast: ${podcastData.trackName}`);
      }

      // Mark job as completed
      await this.podcastQueueService.markJobAsCompleted(jobId);
    } catch (error) {
      this.logger.error(
        `Failed to process job ${jobId}: ${error.message}`,
        error.stack,
      );

      // Mark job as failed
      await this.podcastQueueService.markJobAsFailed(jobId, error.message);
    }
  }

  /**
   * Map iTunes podcast data to entity format
   */
  private mapITunesPodcastToEntity(itunesPodcast: ITunesPodcast): Partial<Podcast> {
    return {
      trackId: itunesPodcast.trackId,
      trackName: itunesPodcast.trackName,
      artistName: itunesPodcast.artistName,
      collectionName: itunesPodcast.collectionName,
      artworkUrl60: itunesPodcast.artworkUrl60,
      artworkUrl100: itunesPodcast.artworkUrl100,
      artworkUrl600: itunesPodcast.artworkUrl600,
      feedUrl: itunesPodcast.feedUrl,
      trackViewUrl: itunesPodcast.trackViewUrl,
      releaseDate: itunesPodcast.releaseDate
        ? new Date(itunesPodcast.releaseDate)
        : undefined,
      country: itunesPodcast.country,
      primaryGenreName: itunesPodcast.primaryGenreName,
      genreIds: itunesPodcast.genreIds || [],
      genres: itunesPodcast.genres || [],
      trackCount: itunesPodcast.trackCount,
      trackExplicitContent:
        itunesPodcast.trackExplicitness === 'explicit' ||
        itunesPodcast.collectionExplicitness === 'explicit',
      description: itunesPodcast.collectionName || '',
    };
  }
}

