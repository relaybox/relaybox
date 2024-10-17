import { Entity, Column, PrimaryGeneratedColumn, Index } from 'typeorm';

@Entity('application_webhooks')
@Index('IDX_application_webhooks_url', ['url'])
@Index('IDX_application_webhooks_appPid', ['appPid'])
@Index('IDX_application_webhooks_enabled', ['enabled'])
@Index('IDX_application_webhooks_deletedAt', ['deletedAt'])
export class ApplicationWebhook {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  appId: string;

  @Column()
  appPid: string;

  @Column()
  name: string;

  @Column()
  url: string;

  @Column({ unique: true })
  signingKey: string;

  @Column({ default: false })
  enabled: boolean;

  @Column({ type: 'jsonb', nullable: true })
  headers: Record<string, string>;

  @Column()
  createdAt: Date;

  @Column({ nullable: true })
  updatedAt: Date;

  @Column({ nullable: true })
  deletedAt: Date;
}
