import { Entity, Column, CreateDateColumn, PrimaryGeneratedColumn, Unique, Index } from 'typeorm';

@Entity('application_webhook_logs')
@Index('IDX_application_webhook_logs_webhookId', ['webhookId'])
@Index('IDX_application_webhook_logs_appId', ['appId'])
@Index('IDX_application_webhook_logs_status', ['status'])
@Unique('UQ_application_webhook_logs_webhookId_webhookRequestId_status', [
  'webhookId',
  'webhookRequestId',
  'status'
])
export class ApplicationWebhookLogs {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  webhookId: string;

  @Column({ type: 'uuid' })
  webhookRequestId: string;

  @Column({ type: 'uuid' })
  webhookEventId: string;

  @Column()
  appId: string;

  @Column()
  appPid: string;

  @Column()
  status: number;

  @Column()
  statusText: string;

  @Column()
  createdAt: Date;

  @Column({ nullable: true })
  updatedAt: Date;

  @Column({ nullable: true })
  deletedAt: Date;
}
