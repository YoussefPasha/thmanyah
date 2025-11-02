import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PodcastService } from '../../../src/modules/podcast/podcast.service';
import { Podcast } from '../../../src/modules/podcast/entities/podcast.entity';
import { ITunesService } from '../../../src/modules/itunes/itunes.service';

describe('PodcastService', () => {
  let service: PodcastService;
  let repository: Repository<Podcast>;
  let itunesService: ITunesService;

  const mockQueryBuilder = {
    andWhere: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    take: jest.fn().mockReturnThis(),
    getManyAndCount: jest.fn(),
  };

  const mockRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    findAndCount: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder),
  };

  const mockITunesService = {
    searchPodcasts: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PodcastService,
        {
          provide: getRepositoryToken(Podcast),
          useValue: mockRepository,
        },
        {
          provide: ITunesService,
          useValue: mockITunesService,
        },
      ],
    }).compile();

    service = module.get<PodcastService>(PodcastService);
    repository = module.get<Repository<Podcast>>(getRepositoryToken(Podcast));
    itunesService = module.get<ITunesService>(ITunesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('search', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should search and return podcasts', async () => {
      const mockSearchResult = {
        resultCount: 1,
        results: [
          {
            trackId: 123456,
            trackName: 'Test Podcast',
            artistName: 'Test Artist',
            collectionName: 'Test Collection',
            country: 'US',
            primaryGenreName: 'Technology',
            releaseDate: '2024-01-01',
            trackCount: 100,
          },
        ],
      };

      mockITunesService.searchPodcasts.mockResolvedValue(mockSearchResult);
      mockRepository.findOne.mockResolvedValue(null);
      mockRepository.create.mockReturnValue(mockSearchResult.results[0]);
      mockRepository.save.mockResolvedValue(mockSearchResult.results[0]);

      const result = await service.search({
        term: 'test',
        limit: 20,
        offset: 0,
      });

      expect(result).toBeDefined();
      expect(result.podcasts).toBeDefined();
      expect(itunesService.searchPodcasts).toHaveBeenCalled();
    });

    it('should fallback to database search when iTunes API fails - podcast entity', async () => {
      mockITunesService.searchPodcasts.mockRejectedValue(new Error('iTunes API failed'));
      
      const mockPodcasts = [
        {
          id: 1,
          trackId: 123,
          trackName: 'Test Podcast',
          artistName: 'Test Artist',
          country: 'US',
        },
      ];
      
      mockQueryBuilder.getManyAndCount.mockResolvedValue([mockPodcasts, 1]);

      const result = await service.search({
        term: 'test',
        limit: 20,
        offset: 0,
        entity: 'podcast',
      });

      expect(result).toBeDefined();
      expect(result.podcasts).toHaveLength(1);
      expect(result.total).toBe(1);
      expect(mockRepository.createQueryBuilder).toHaveBeenCalledWith('podcast');
      
      // Verify it searches in trackName, artistName, and description for podcast entity
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        '(LOWER(podcast.trackName) LIKE LOWER(:term) OR LOWER(podcast.artistName) LIKE LOWER(:term) OR LOWER(podcast.description) LIKE LOWER(:term))',
        { term: '%test%' },
      );
    });

    it('should fallback to database search when iTunes API fails - podcastAuthor entity', async () => {
      mockITunesService.searchPodcasts.mockRejectedValue(new Error('iTunes API failed'));
      
      const mockPodcasts = [
        {
          id: 1,
          trackId: 123,
          trackName: 'Test Podcast',
          artistName: 'Test Author',
          country: 'US',
        },
      ];
      
      mockQueryBuilder.getManyAndCount.mockResolvedValue([mockPodcasts, 1]);

      const result = await service.search({
        term: 'author',
        limit: 20,
        offset: 0,
        entity: 'podcastAuthor',
      });

      expect(result).toBeDefined();
      expect(result.podcasts).toHaveLength(1);
      expect(result.total).toBe(1);
      expect(mockRepository.createQueryBuilder).toHaveBeenCalledWith('podcast');
      
      // Verify it searches only in artistName for podcastAuthor entity
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'LOWER(podcast.artistName) LIKE LOWER(:term)',
        { term: '%author%' },
      );
    });

    it('should apply country filter in database fallback', async () => {
      mockITunesService.searchPodcasts.mockRejectedValue(new Error('iTunes API failed'));
      
      const mockPodcasts = [
        {
          id: 1,
          trackId: 123,
          trackName: 'Test Podcast',
          artistName: 'Test Artist',
          country: 'CA',
        },
      ];
      
      mockQueryBuilder.getManyAndCount.mockResolvedValue([mockPodcasts, 1]);

      await service.search({
        term: 'test',
        limit: 20,
        offset: 0,
        country: 'ca',
        entity: 'podcast',
      });

      // Verify country filter is applied
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'podcast.country = :country',
        { country: 'ca' },
      );
    });
  });

  describe('findAll', () => {
    it('should return paginated podcasts', async () => {
      const mockPodcasts = [
        { id: 1, trackName: 'Podcast 1' },
        { id: 2, trackName: 'Podcast 2' },
      ];

      mockRepository.findAndCount.mockResolvedValue([mockPodcasts, 2]);

      const result = await service.findAll(20, 0);

      expect(result).toBeDefined();
      expect(result.podcasts).toHaveLength(2);
      expect(result.total).toBe(2);
    });
  });

  describe('findOne', () => {
    it('should return a single podcast', async () => {
      const mockPodcast = { id: 1, trackName: 'Test Podcast' };
      mockRepository.findOne.mockResolvedValue(mockPodcast);

      const result = await service.findOne(1);

      expect(result).toBeDefined();
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('should throw NotFoundException when podcast not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow();
    });
  });
});

