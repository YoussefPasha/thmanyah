export interface Podcast {
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
  releaseDate: string;
  country: string;
  primaryGenreName: string;
  genreIds: number[];
  genres: string[];
  trackCount: number;
  trackExplicitContent: boolean;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface PodcastListResponse {
  podcasts: Podcast[];
  total: number;
  limit: number;
  offset: number;
}

