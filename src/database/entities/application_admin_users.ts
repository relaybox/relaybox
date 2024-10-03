import { Entity, Column, PrimaryGeneratedColumn, Index, Unique } from 'typeorm';

@Entity('application_admin_users')
@Unique('UQ_application_admin_users_appId_uid', ['appId', 'uid'])
@Index('IDX_application_admin_users_createdAt', ['createdAt'])
export class ApplicationAdminUser {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  orgId: string;

  @Column('uuid')
  appId: string;

  @Column('uuid')
  uid: string;

  @Column()
  createdAt: Date;

  @Column({ nullable: true })
  deletedAt: Date;

  @Column({ default: false })
  owner: boolean;
}
