import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

export type JobStatus = 'pending' | 'processing' | 'completed' | 'failed';

@Entity('podcast_jobs')
@Index(['status', 'createdAt'])
export class PodcastJob {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'bigint', name: 'track_id' })
  @Index()
  trackId: number;

  @Column({ type: 'varchar', length: 500, name: 'track_name' })
  trackName: string;

  @Column({ type: 'jsonb', name: 'podcast_data' })
  podcastData: any;

  @Column({
    type: 'varchar',
    length: 20,
    default: 'pending',
  })
  @Index()
  status: JobStatus;

  @Column({ type: 'int', default: 0 })
  attempts: number;

  @Column({ type: 'int', default: 3, name: 'max_attempts' })
  maxAttempts: number;

  @Column({ type: 'text', nullable: true })
  error: string;

  @Column({ type: 'timestamp', nullable: true, name: 'last_attempt_at' })
  lastAttemptAt: Date;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt: Date;

  @Column({ type: 'timestamp', nullable: true, name: 'completed_at' })
  completedAt: Date;
}

