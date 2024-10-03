import { Entity, Column, CreateDateColumn, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity('authentication_user_mfa_factors')
@Unique('UQ_authentication_user_mfa_factors_uid_type', ['uid', 'type'])
export class AuthenticationUserMfaFactors {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  uid: string;

  @Column()
  type: string;

  @Column()
  secret: string;

  @Column()
  salt: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ nullable: true })
  verifiedAt: Date;

  @Column({ nullable: true })
  lastUsedAt: Date;

  @Column({ nullable: true })
  deletedAt: Date;
}
