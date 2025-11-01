import { Podcast } from '../entities/podcast.entity';

export class PodcastResponseDto {
  id: number;
  trackId: number;
  trackName: string;
  artistName: string;
  collectionName: string;
  artworkUrl60: string;
  artworkUrl100: string;
  artworkUrl600: string;
  feedUrl: string;
  trackViewUrl: string;
  releaseDate: Date;
  country: string;
  primaryGenreName: string;
  genreIds: number[];
  genres: string[];
  trackCount: number;
  trackExplicitContent: boolean;
  description: string;
  createdAt: Date;
  updatedAt: Date;

  static fromEntity(entity: Podcast): PodcastResponseDto {
    const dto = new PodcastResponseDto();
    dto.id = entity.id;
    dto.trackId = entity.trackId;
    dto.trackName = entity.trackName;
    dto.artistName = entity.artistName;
    dto.collectionName = entity.collectionName;
    dto.artworkUrl60 = entity.artworkUrl60;
    dto.artworkUrl100 = entity.artworkUrl100;
    dto.artworkUrl600 = entity.artworkUrl600;
    dto.feedUrl = entity.feedUrl;
    dto.trackViewUrl = entity.trackViewUrl;
    dto.releaseDate = entity.releaseDate;
    dto.country = entity.country;
    dto.primaryGenreName = entity.primaryGenreName;
    dto.genreIds = entity.genreIds;
    dto.genres = entity.genres;
    dto.trackCount = entity.trackCount;
    dto.trackExplicitContent = entity.trackExplicitContent;
    dto.description = entity.description;
    dto.createdAt = entity.createdAt;
    dto.updatedAt = entity.updatedAt;
    return dto;
  }
}

export class PodcastListResponseDto {
  podcasts: PodcastResponseDto[];
  total: number;
  limit: number;
  offset: number;
}

