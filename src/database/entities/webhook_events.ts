import { Entity, Column, CreateDateColumn, PrimaryGeneratedColumn, Unique, Index } from 'typeorm';

@Entity('webhook_events')
export class WebhookEvents {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  type: string;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ default: true })
  enabled: boolean;

  @Column({ nullable: true })
  category: string;

  @Column()
  createdAt: Date;

  @Column({ nullable: true })
  updatedAt: Date;

  @Column({ nullable: true })
  deletedAt: Date;
}
