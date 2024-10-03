import {
  Entity,
  Column,
  Index,
  Unique,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn
} from 'typeorm';

@Entity('authentication_users')
@Index('IDX_authentication_users_deletedAt', ['deletedAt'])
@Unique('UQ_authentication_users_appId_emailHash', ['appId', 'emailHash'])
@Unique('UQ_authentication_users_appId_username', ['appId', 'username'])
@Index('IDX_authentication_users_clientId', ['clientId'])
@Index('IDX_authentication_users_verifiedAt', ['verifiedAt'])
@Index('IDX_authentication_users_isOnline', ['isOnline'])
@Index('IDX_authentication_users_appId', ['appId'])
export class AuthenticationUser {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  orgId: string;

  @Column({ type: 'uuid' })
  appId: string;

  @Column()
  clientId: string;

  @Column()
  email: string;

  @Column()
  emailHash: string;

  @Column({ nullable: true })
  username: string;

  @Column({ nullable: true })
  firstName: string;

  @Column({ nullable: true })
  lastName: string;

  @Column({ default: false })
  authMfaEnabled: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ nullable: true })
  verifiedAt: Date;

  @Column({ nullable: true })
  deletedAt: Date;

  @Column({ nullable: true })
  isOnline: boolean;

  @Column({ nullable: true })
  lastOnline: Date;

  @Column({ nullable: true })
  onlineStatus: string;

  @Column({ nullable: true })
  status: string;

  @Column({ nullable: true })
  blockedAt: Date;
}
