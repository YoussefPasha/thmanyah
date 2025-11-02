import { IsString, IsOptional, IsNumber, Min, Max, IsEnum, IsBoolean } from 'class-validator';
import { Type, Transform } from 'class-transformer';

export enum PodcastSortBy {
  CREATED_AT = 'createdAt',
  RELEASE_DATE = 'releaseDate',
  TRACK_NAME = 'trackName',
  ARTIST_NAME = 'artistName',
  TRACK_COUNT = 'trackCount',
}

export enum SortOrder {
  ASC = 'ASC',
  DESC = 'DESC',
}

export class FilterPodcastDto {
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
  @IsEnum(PodcastSortBy)
  sortBy?: PodcastSortBy = PodcastSortBy.CREATED_AT;

  @IsOptional()
  @IsEnum(SortOrder)
  sortOrder?: SortOrder = SortOrder.DESC;

  @IsOptional()
  @IsString()
  genre?: string;

  @IsOptional()
  @IsString()
  country?: string;

  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  explicitContent?: boolean;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  minTrackCount?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  maxTrackCount?: number;
}

