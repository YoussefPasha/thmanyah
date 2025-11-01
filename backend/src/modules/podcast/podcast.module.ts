import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PodcastController } from './podcast.controller';
import { PodcastService } from './podcast.service';
import { Podcast } from './entities/podcast.entity';
import { ITunesModule } from '../itunes/itunes.module';

@Module({
  imports: [TypeOrmModule.forFeature([Podcast]), ITunesModule],
  controllers: [PodcastController],
  providers: [PodcastService],
  exports: [PodcastService],
})
export class PodcastModule {}

