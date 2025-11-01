import {
  Controller,
  Get,
  Query,
  Param,
  ParseIntPipe,
  ValidationPipe,
  UseInterceptors,
} from '@nestjs/common';
import { PodcastService } from './podcast.service';
import { SearchPodcastDto } from './dto/search-podcast.dto';
import { PodcastResponseDto, PodcastListResponseDto } from './dto/podcast-response.dto';
import { TransformInterceptor } from '../../common/interceptors/transform.interceptor';

@Controller('podcasts')
@UseInterceptors(TransformInterceptor)
export class PodcastController {
  constructor(private readonly podcastService: PodcastService) {}

  @Get('search')
  async search(
    @Query(new ValidationPipe({ transform: true })) searchDto: SearchPodcastDto,
  ): Promise<PodcastListResponseDto> {
    return this.podcastService.search(searchDto);
  }

  @Get()
  async findAll(
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
    @Query('offset', new ParseIntPipe({ optional: true })) offset?: number,
  ): Promise<PodcastListResponseDto> {
    return this.podcastService.findAll(limit, offset);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<PodcastResponseDto> {
    return this.podcastService.findOne(id);
  }
}

