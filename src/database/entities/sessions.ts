import { Entity, Column, PrimaryGeneratedColumn, Index, Unique } from 'typeorm';

@Entity('sessions')
@Unique('UQ_sessions_uid_connectionId', ['uid', 'connectionId'])
@Index('IDX_sessions_appPid', ['appPid'])
@Index('IDX_sessions_keyId', ['keyId'])
@Index('IDX_sessions_uid', ['uid'])
@Index('IDX_sessions_clientId', ['clientId'])
@Index('IDX_sessions_createdAt', ['createdAt'])
@Index('IDX_sessions_disconnectedAt', ['disconnectedAt'])
export class Session {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  appId: string;

  @Column()
  appPid: string;

  @Column()
  keyId: string;

  @Column()
  uid: string;

  @Column({ nullable: true })
  clientId: string;

  @Column()
  connectionId: string;

  @Column()
  socketId: string;

  @Column()
  createdAt: Date;

  @Column()
  updatedAt: Date;

  @Column({ nullable: true })
  deletedAt: Date;

  @Column({ nullable: true })
  disconnectedAt: Date;
}
