import { Entity, Column, CreateDateColumn, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity('application_authentication_providers')
@Unique('UQ_application_authentication_providers_appId_providerId', ['appId', 'providerId'])
export class ApplicationAuthenticationProvider {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  appId: string;

  @Column({ type: 'uuid' })
  providerId: string;

  @Column()
  clientId: string;

  @Column()
  clientSecret: string;

  @Column()
  salt: string;

  @Column({ nullable: true })
  redirectUri: string;

  @Column('text', { array: true, nullable: true })
  customScopes: string[];

  @Column({ default: true })
  enabled: boolean;

  @Column()
  createdAt: Date;

  @Column({ nullable: true })
  updatedAt: Date;

  @Column({ nullable: true })
  deletedAt: Date;
}
