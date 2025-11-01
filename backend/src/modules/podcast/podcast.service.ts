import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Podcast } from './entities/podcast.entity';
import { ITunesService } from '../itunes/itunes.service';
import { SearchPodcastDto } from './dto/search-podcast.dto';
import { PodcastResponseDto, PodcastListResponseDto } from './dto/podcast-response.dto';
import { ITunesPodcast } from './interfaces/itunes-response.interface';

@Injectable()
export class PodcastService {
  private readonly logger = new Logger(PodcastService.name);

  constructor(
    @InjectRepository(Podcast)
    private podcastRepository: Repository<Podcast>,
    private itunesService: ITunesService,
  ) {}

  async search(searchDto: SearchPodcastDto): Promise<PodcastListResponseDto> {
    const { term, limit, offset, country } = searchDto;

    this.logger.debug(`Searching for podcasts with term: ${term}`);

    // Fetch from iTunes API
    const itunesResponse = await this.itunesService.searchPodcasts({
      term,
      country,
      limit,
      offset,
    });

    this.logger.debug(`Found ${itunesResponse.resultCount} podcasts from iTunes`);

    // Save or update podcasts in database
    const podcasts = await this.savePodcasts(itunesResponse.results);

    return {
      podcasts: podcasts.map((podcast) => PodcastResponseDto.fromEntity(podcast)),
      total: itunesResponse.resultCount,
      limit,
      offset,
    };
  }

  async findAll(limit: number = 20, offset: number = 0): Promise<PodcastListResponseDto> {
    this.logger.debug(`Finding all podcasts with limit: ${limit}, offset: ${offset}`);

    const [podcasts, total] = await this.podcastRepository.findAndCount({
      take: limit,
      skip: offset,
      order: { createdAt: 'DESC' },
    });

    return {
      podcasts: podcasts.map((podcast) => PodcastResponseDto.fromEntity(podcast)),
      total,
      limit,
      offset,
    };
  }

  async findOne(id: number): Promise<PodcastResponseDto> {
    this.logger.debug(`Finding podcast with id: ${id}`);

    const podcast = await this.podcastRepository.findOne({ where: { id } });

    if (!podcast) {
      throw new NotFoundException(`Podcast not found with id: ${id}`);
    }

    return PodcastResponseDto.fromEntity(podcast);
  }

  private async savePodcasts(itunesPodcasts: ITunesPodcast[]): Promise<Podcast[]> {
    const savedPodcasts: Podcast[] = [];

    for (const itunesPodcast of itunesPodcasts) {
      try {
        const podcastData = this.mapITunesPodcastToEntity(itunesPodcast);

        // Check if podcast already exists
        let podcast = await this.podcastRepository.findOne({
          where: { trackId: itunesPodcast.trackId },
        });

        if (podcast) {
          // Update existing podcast
          Object.assign(podcast, podcastData);
          podcast = await this.podcastRepository.save(podcast);
          this.logger.debug(`Updated podcast: ${podcast.trackName}`);
        } else {
          // Create new podcast
          podcast = this.podcastRepository.create(podcastData);
          podcast = await this.podcastRepository.save(podcast);
          this.logger.debug(`Created new podcast: ${podcast.trackName}`);
        }

        savedPodcasts.push(podcast);
      } catch (error) {
        this.logger.error(
          `Failed to save podcast: ${itunesPodcast.trackName}`,
          error.message,
        );
      }
    }

    return savedPodcasts;
  }

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
      releaseDate: itunesPodcast.releaseDate ? new Date(itunesPodcast.releaseDate) : null,
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

