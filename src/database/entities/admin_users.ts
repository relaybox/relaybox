import { Entity, Column, Index, PrimaryColumn, Unique } from 'typeorm';

@Entity('admin_users')
@Index('IDX_admin_users_deletedAt', ['deletedAt'])
export class AdminUser {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ unique: true })
  hashId: string;

  @Column({ nullable: true, unique: true })
  username: string;

  @Column({ nullable: true })
  lastOnline: Date;

  @Column({ nullable: true })
  confirmed: Date;

  @Column({ nullable: true })
  verified: Date;

  @Column({ nullable: true })
  authComplete: Date;

  @Column({ nullable: true })
  termsAgreed: Date;

  @Column()
  createdAt: Date;

  @Column({ nullable: true })
  deletedAt: Date;

  @Column({ default: false })
  mfaEnabled: boolean;

  @Column({ nullable: true })
  provider: string;

  @Column({ default: 1 })
  pricingPlan: number;
}
