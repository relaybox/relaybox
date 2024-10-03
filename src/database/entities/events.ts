import { Entity, Column, PrimaryGeneratedColumn, Index } from 'typeorm';

@Entity('events')
@Index('IDX_events_room', ['room'])
@Index('IDX_events_event', ['event'])
@Index('IDX_events_createdAt', ['createdAt'])
@Index('IDX_events_deletedAt', ['deletedAt'])
export class Event {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  appId: string;

  @Column()
  room: string;

  @Column()
  event: string;

  @Column()
  timestamp: Date;

  @Column({ type: 'jsonb' })
  data: any;

  @Column()
  createdAt: Date;

  @Column()
  updatedAt: Date;

  @Column({ nullable: true })
  deletedAt: Date;
}
