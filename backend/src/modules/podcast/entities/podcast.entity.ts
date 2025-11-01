import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity('podcasts')
export class Podcast {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'bigint', unique: true, name: 'track_id' })
  @Index()
  trackId: number;

  @Column({ type: 'varchar', length: 500, name: 'track_name' })
  trackName: string;

  @Column({ type: 'varchar', length: 255, nullable: true, name: 'artist_name' })
  artistName: string;

  @Column({ type: 'varchar', length: 500, nullable: true, name: 'collection_name' })
  collectionName: string;

  @Column({ type: 'varchar', length: 1000, nullable: true, name: 'artwork_url_60' })
  artworkUrl60: string;

  @Column({ type: 'varchar', length: 1000, nullable: true, name: 'artwork_url_100' })
  artworkUrl100: string;

  @Column({ type: 'varchar', length: 1000, nullable: true, name: 'artwork_url_600' })
  artworkUrl600: string;

  @Column({ type: 'text', nullable: true, name: 'feed_url' })
  feedUrl: string;

  @Column({ type: 'text', nullable: true, name: 'track_view_url' })
  trackViewUrl: string;

  @Column({ type: 'timestamp', nullable: true, name: 'release_date' })
  releaseDate: Date;

  @Column({ type: 'varchar', length: 10, nullable: true })
  country: string;

  @Column({ type: 'varchar', length: 100, nullable: true, name: 'primary_genre_name' })
  @Index()
  primaryGenreName: string;

  @Column({ type: 'simple-array', nullable: true, name: 'genre_ids' })
  genreIds: number[];

  @Column({ type: 'simple-array', nullable: true })
  genres: string[];

  @Column({ type: 'int', nullable: true, name: 'track_count' })
  trackCount: number;

  @Column({ type: 'boolean', default: false, name: 'track_explicit_content' })
  trackExplicitContent: boolean;

  @Column({ type: 'text', nullable: true })
  description: string;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  @Index()
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt: Date;
}

