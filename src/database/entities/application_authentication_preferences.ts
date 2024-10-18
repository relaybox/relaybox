import { Entity, Column, CreateDateColumn, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity('application_authentication_preferences')
export class ApplicationAuthenticationPreference {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', unique: true })
  appId: string;

  @Column({ type: 'bigint' })
  tokenExpiry: number;

  @Column({ type: 'bigint' })
  sessionExpiry: number;

  @Column()
  authStorageType: string;

  @Column({ nullable: true })
  passwordPattern: string;

  @Column()
  createdAt: Date;

  @Column({ nullable: true })
  updatedAt: Date;

  @Column({ nullable: true })
  deletedAt: Date;
}
