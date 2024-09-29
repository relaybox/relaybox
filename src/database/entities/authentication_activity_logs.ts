import { Entity, Column, CreateDateColumn, PrimaryGeneratedColumn, Unique, Index } from 'typeorm';

export enum AuthenticationActionResult {
  SUCCESS = 'SUCCESS',
  FAIL = 'FAIL'
}

@Entity('authentication_activity_logs')
@Index('IDX_authentication_activity_logs_uid', ['uid'])
@Index('IDX_authentication_activity_logs_identityId', ['identityId'])
@Index('IDX_authentication_activity_logs_action', ['action'])
@Index('IDX_authentication_activity_logs_appId', ['appId'])
export class AuthenticationActivityLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', nullable: true })
  uid: string;

  @Column({ type: 'uuid', nullable: true })
  identityId: string;

  @Column({ nullable: true })
  appId: string;

  @Column()
  ipAddress: string;

  @Column()
  action: string;

  @Column({ type: 'enum', enum: AuthenticationActionResult })
  actionResult: AuthenticationActionResult;

  @Column({ nullable: true })
  keyId: string;

  @Column({ nullable: true })
  errorMessage: string;

  @Column({ nullable: true })
  createdAt: Date;
}
