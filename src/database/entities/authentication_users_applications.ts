import { Entity, Column, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity('authentication_users_applications')
@Unique('UQ_authentication_users_applications', ['orgId', 'appId', 'uid'])
export class AuthenticationUsersApplication {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  uid: string;

  @Column({ type: 'uuid' })
  orgId: string;

  @Column({ type: 'uuid' })
  appId: string;

  @Column()
  createdAt: Date;

  @Column({ nullable: true })
  updatedAt: Date;

  @Column({ nullable: true })
  deletedAt: Date;
}
