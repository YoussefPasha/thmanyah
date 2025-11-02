import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Podcast } from './entities/podcast.entity';
import { ITunesService } from '../itunes/itunes.service';
import { SearchPodcastDto } from './dto/search-podcast.dto';
import { FilterPodcastDto } from './dto/filter-podcast.dto';
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
    const { term, limit, offset, country, entity } = searchDto;
    const searchLimit = limit || 20;
    const searchOffset = offset || 0;

    this.logger.debug(`Searching for podcasts with term: ${term}, entity: ${entity}`);

    try {
      // Fetch from iTunes API
      const itunesResponse = await this.itunesService.searchPodcasts({
        term,
        country,
        entity,
        limit,
        offset,
      });

      this.logger.debug(`Found ${itunesResponse.resultCount} podcasts from iTunes`);

      // Save or update podcasts in database
      const podcasts = await this.savePodcasts(itunesResponse.results);

      return {
        podcasts: podcasts.map((podcast) => PodcastResponseDto.fromEntity(podcast)),
        total: itunesResponse.resultCount,
        limit: searchLimit,
        offset: searchOffset,
      };
    } catch (error) {
      this.logger.warn(
        `iTunes API search failed, falling back to database search: ${error.message}`,
      );

      // Fallback to database search
      const queryBuilder = this.podcastRepository.createQueryBuilder('podcast');

      // Search based on entity type
      if (entity === 'podcastAuthor') {
        // For podcast authors, search primarily in artistName
        queryBuilder.andWhere(
          'LOWER(podcast.artistName) LIKE LOWER(:term)',
          { term: `%${term}%` },
        );
      } else {
        // For podcasts (default), search in trackName, artistName, and description
        queryBuilder.andWhere(
          '(LOWER(podcast.trackName) LIKE LOWER(:term) OR LOWER(podcast.artistName) LIKE LOWER(:term) OR LOWER(podcast.description) LIKE LOWER(:term))',
          { term: `%${term}%` },
        );
      }

      // Filter by country if provided
      if (country) {
        queryBuilder.andWhere('podcast.country = :country', { country });
      }

      // Apply sorting and pagination
      queryBuilder.orderBy('podcast.createdAt', 'DESC');
      queryBuilder.skip(searchOffset).take(searchLimit);

      // Execute query
      const [podcasts, total] = await queryBuilder.getManyAndCount();

      this.logger.debug(`Found ${total} podcasts from database fallback (entity: ${entity})`);

      return {
        podcasts: podcasts.map((podcast: Podcast) => PodcastResponseDto.fromEntity(podcast)),
        total,
        limit: searchLimit,
        offset: searchOffset,
      };
    }
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

  async findAllWithFilters(filterDto: FilterPodcastDto): Promise<PodcastListResponseDto> {
    const {
      limit = 20,
      offset = 0,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
      genre,
      country,
      explicitContent,
      search,
      minTrackCount,
      maxTrackCount,
      releaseDateFrom,
      releaseDateTo,
    } = filterDto;

    this.logger.debug(`Finding podcasts with filters: ${JSON.stringify(filterDto)}`);

    const queryBuilder = this.podcastRepository.createQueryBuilder('podcast');

    // Apply filters
    if (genre) {
      queryBuilder.andWhere('podcast.primaryGenreName = :genre', { genre });
    }

    if (country) {
      queryBuilder.andWhere('podcast.country = :country', { country });
    }

    if (explicitContent !== undefined) {
      queryBuilder.andWhere('podcast.trackExplicitContent = :explicitContent', {
        explicitContent,
      });
    }

    if (search) {
      queryBuilder.andWhere(
        '(LOWER(podcast.trackName) LIKE LOWER(:search) OR LOWER(podcast.artistName) LIKE LOWER(:search) OR LOWER(podcast.description) LIKE LOWER(:search))',
        { search: `%${search}%` },
      );
    }

    if (minTrackCount !== undefined) {
      queryBuilder.andWhere('podcast.trackCount >= :minTrackCount', { minTrackCount });
    }

    if (maxTrackCount !== undefined) {
      queryBuilder.andWhere('podcast.trackCount <= :maxTrackCount', { maxTrackCount });
    }

    if (releaseDateFrom) {
      queryBuilder.andWhere('podcast.releaseDate >= :releaseDateFrom', { releaseDateFrom });
    }

    if (releaseDateTo) {
      queryBuilder.andWhere('podcast.releaseDate <= :releaseDateTo', { releaseDateTo });
    }

    // Apply sorting
    const sortField = `podcast.${sortBy}`;
    queryBuilder.orderBy(sortField, sortOrder);

    // Apply pagination
    queryBuilder.skip(offset).take(limit);

    // Execute query
    const [podcasts, total] = await queryBuilder.getManyAndCount();

    return {
      podcasts: podcasts.map((podcast) => PodcastResponseDto.fromEntity(podcast)),
      total,
      limit,
      offset,
    };
  }

  async getAllGenres(): Promise<{ genres: string[] }> {
    this.logger.debug('Fetching all unique genres');

    const result = await this.podcastRepository
      .createQueryBuilder('podcast')
      .select('DISTINCT podcast.primaryGenreName', 'genre')
      .where('podcast.primaryGenreName IS NOT NULL')
      .orderBy('podcast.primaryGenreName', 'ASC')
      .getRawMany();

    const genres = result.map((r) => r.genre).filter((g) => g);

    return { genres };
  }

  async getAllCountries(): Promise<{ countries: string[] }> {
    this.logger.debug('Fetching all unique countries');

    const result = await this.podcastRepository
      .createQueryBuilder('podcast')
      .select('DISTINCT podcast.country', 'country')
      .where('podcast.country IS NOT NULL')
      .orderBy('podcast.country', 'ASC')
      .getRawMany();

    const countries = result.map((r) => r.country).filter((c) => c);

    return { countries };
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
      releaseDate: itunesPodcast.releaseDate ? new Date(itunesPodcast.releaseDate) : undefined,
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

