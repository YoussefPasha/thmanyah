export interface IPodcast {
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
}

