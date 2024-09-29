import { Entity, Column, CreateDateColumn, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity('authentication_user_mfa_challenges')
export class AuthenticationUserMfaChallenges {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  factorId: string;

  @Column({ type: 'uuid' })
  uid: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ type: 'bigint' })
  expiresAt: number;

  @Column({ nullable: true })
  verifiedAt: Date;
}
