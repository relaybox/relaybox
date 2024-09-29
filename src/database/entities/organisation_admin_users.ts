import { Entity, Column, PrimaryGeneratedColumn, Index, Unique } from 'typeorm';

@Entity('organisation_admin_users')
@Unique('UQ_organisation_admin_users_orgId_uid', ['orgId', 'uid'])
@Index('IDX_organisation_admin_users_createdAt', ['createdAt'])
export class OrganisationAdminUser {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  orgId: string;

  @Column('uuid')
  uid: string;

  @Column()
  createdAt: Date;

  @Column({ nullable: true })
  deletedAt: Date;

  @Column({ default: false })
  owner: boolean;
}
