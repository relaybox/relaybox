import { Entity, Column, CreateDateColumn, PrimaryGeneratedColumn, Unique, Index } from 'typeorm';

@Entity('application_webhook_events')
@Index('IDX_application_webhook_events_webhookId', ['webhookId'])
@Index('IDX_application_webhook_events_webhookEventId', ['webhookEventId'])
@Unique('UQ_application_webhook_events_webhookId_webhookEventId', ['webhookId', 'webhookEventId'])
export class ApplicationWebhookEvent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  appId: string;

  @Column()
  appPid: string;

  @Column({ type: 'uuid' })
  webhookId: string;

  @Column({ type: 'uuid' })
  webhookEventId: string;

  @Column()
  createdAt: Date;

  @Column({ nullable: true })
  updatedAt: Date;

  @Column({ nullable: true })
  deletedAt: Date;
}
