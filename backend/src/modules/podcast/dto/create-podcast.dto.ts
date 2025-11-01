import { IsString, IsNumber, IsOptional, IsBoolean, IsArray } from 'class-validator';

export class CreatePodcastDto {
  @IsNumber()
  trackId: number;

  @IsString()
  trackName: string;

  @IsOptional()
  @IsString()
  artistName?: string;

  @IsOptional()
  @IsString()
  collectionName?: string;

  @IsOptional()
  @IsString()
  artworkUrl60?: string;

  @IsOptional()
  @IsString()
  artworkUrl100?: string;

  @IsOptional()
  @IsString()
  artworkUrl600?: string;

  @IsOptional()
  @IsString()
  feedUrl?: string;

  @IsOptional()
  @IsString()
  trackViewUrl?: string;

  @IsOptional()
  releaseDate?: Date;

  @IsOptional()
  @IsString()
  country?: string;

  @IsOptional()
  @IsString()
  primaryGenreName?: string;

  @IsOptional()
  @IsArray()
  genreIds?: number[];

  @IsOptional()
  @IsArray()
  genres?: string[];

  @IsOptional()
  @IsNumber()
  trackCount?: number;

  @IsOptional()
  @IsBoolean()
  trackExplicitContent?: boolean;

  @IsOptional()
  @IsString()
  description?: string;
}

