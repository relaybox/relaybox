import { Entity, Column, PrimaryGeneratedColumn, Index, Unique } from 'typeorm';

@Entity('credentials')
@Unique('UQ_credentials_secretKey', ['secretKey'])
@Unique('UQ_credentials_keyId', ['keyId'])
@Unique('UQ_credentials_appId_friendlyName', ['appId', 'friendlyName'])
@Index('IDX_credentials_appId', ['appId'])
@Index('IDX_credentials_appPid', ['appPid'])
export class Credential {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  orgId: string;

  @Column('uuid')
  appId: string;

  @Column()
  appPid: string;

  @Column({ nullable: true })
  friendlyName: string;

  @Column()
  keyId: string;

  @Column()
  secretKey: string;

  @Column()
  createdAt: Date;

  @Column({ nullable: true })
  deletedAt: Date;

  @Column({ nullable: true })
  revokedAt: Date;
}
