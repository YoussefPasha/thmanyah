import { Test, TestingModule } from '@nestjs/testing';
import { PodcastController } from '../../../src/modules/podcast/podcast.controller';
import { PodcastService } from '../../../src/modules/podcast/podcast.service';

describe('PodcastController', () => {
  let controller: PodcastController;
  let service: PodcastService;

  const mockPodcastService = {
    search: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PodcastController],
      providers: [
        {
          provide: PodcastService,
          useValue: mockPodcastService,
        },
      ],
    }).compile();

    controller = module.get<PodcastController>(PodcastController);
    service = module.get<PodcastService>(PodcastService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('search', () => {
    it('should return search results', async () => {
      const mockResult = {
        podcasts: [],
        total: 0,
        limit: 20,
        offset: 0,
      };

      mockPodcastService.search.mockResolvedValue(mockResult);

      const result = await controller.search({ term: 'test', limit: 20, offset: 0 });

      expect(result).toEqual(mockResult);
      expect(service.search).toHaveBeenCalledWith({ term: 'test', limit: 20, offset: 0 });
    });
  });

  describe('findAll', () => {
    it('should return all podcasts', async () => {
      const mockResult = {
        podcasts: [],
        total: 0,
        limit: 20,
        offset: 0,
      };

      mockPodcastService.findAll.mockResolvedValue(mockResult);

      const result = await controller.findAll(20, 0);

      expect(result).toEqual(mockResult);
      expect(service.findAll).toHaveBeenCalledWith(20, 0);
    });
  });

  describe('findOne', () => {
    it('should return a single podcast', async () => {
      const mockPodcast = { id: 1, trackName: 'Test Podcast' };

      mockPodcastService.findOne.mockResolvedValue(mockPodcast);

      const result = await controller.findOne(1);

      expect(result).toEqual(mockPodcast);
      expect(service.findOne).toHaveBeenCalledWith(1);
    });
  });
});

