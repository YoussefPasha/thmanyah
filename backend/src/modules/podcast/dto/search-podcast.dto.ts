import { IsString, IsNotEmpty, IsOptional, IsNumber, Min, Max, IsIn } from 'class-validator';
import { Type } from 'class-transformer';

export class SearchPodcastDto {
  @IsString()
  @IsNotEmpty({ message: 'Search term is required' })
  term: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(200)
  limit?: number = 20;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  offset?: number = 0;

  @IsOptional()
  @IsString()
  country?: string = 'us';

  @IsOptional()
  @IsString()
  @IsIn(['podcast', 'podcastAuthor'], { 
    message: 'Entity must be either "podcast" or "podcastAuthor"' 
  })
  entity?: string = 'podcast';
}

