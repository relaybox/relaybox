import {
  Entity,
  Column,
  Index,
  Unique,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn
} from 'typeorm';

enum Provider {
  EMAIL = 'email',
  GOOGLE = 'google',
  FACEBOOK = 'facebook',
  GITHUB = 'github',
  APPLE = 'apple'
}

@Entity('authentication_user_identities')
@Index('IDX_authentication_user_identities_deletedAt', ['deletedAt'])
@Unique('UQ_authentication_user_identities_uid_emailHash_provider', [
  'uid',
  'emailHash',
  'provider'
])
@Index('IDX_authentication_user_identities_verifiedAt', ['verifiedAt'])
@Index('IDX_authentication_user_identities_uid', ['uid'])
@Index('IDX_authentication_user_identities_emailHash', ['emailHash'])
@Index('IDX_authentication_user_identities_provider', ['provider'])
export class AuthenticationUserIdentity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  uid: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  phoneNumber: string;

  @Column({ nullable: true })
  emailHash: string;

  @Column({ nullable: true })
  password: string;

  @Column({ nullable: true })
  salt: string;

  @Column({ nullable: true })
  keyVersion: number;

  @Column({ default: Provider.EMAIL })
  provider: string;

  @Column({ nullable: true })
  providerId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ nullable: true })
  verifiedAt: Date;

  @Column({ nullable: true })
  deletedAt: Date;

  @Column({ nullable: true })
  lastLoginAt: Date;
}
