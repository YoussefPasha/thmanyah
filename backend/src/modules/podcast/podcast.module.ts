import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PodcastController } from './podcast.controller';
import { PodcastService } from './podcast.service';
import { PodcastQueueService } from './podcast-queue.service';
import { PodcastWorkerService } from './podcast-worker.service';
import { Podcast } from './entities/podcast.entity';
import { PodcastJob } from './entities/podcast-job.entity';
import { ITunesModule } from '../itunes/itunes.module';

@Module({
  imports: [TypeOrmModule.forFeature([Podcast, PodcastJob]), ITunesModule],
  controllers: [PodcastController],
  providers: [PodcastService, PodcastQueueService, PodcastWorkerService],
  exports: [PodcastService, PodcastQueueService],
})
export class PodcastModule {}

