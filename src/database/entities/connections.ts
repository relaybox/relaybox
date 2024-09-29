import { Entity, Column, PrimaryGeneratedColumn, Index, Unique } from 'typeorm';

@Entity('connections')
@Unique('UQ_connections_connectionId_connectionEventType', ['connectionId', 'connectionEventType'])
@Index('IDX_connections_appId', ['appId'])
@Index('IDX_connections_appPid', ['appPid'])
@Index('IDX_connections_createdAt', ['createdAt'])
export class Connection {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  appId: string;

  @Column()
  appPid: string;

  @Column()
  uid: string;

  @Column({ nullable: true })
  clientId: string;

  @Column()
  connectionId: string;

  @Column()
  socketId: string;

  @Column()
  connectionEventType: string;

  @Column()
  connectionChange: number;

  @Column()
  createdAt: Date;
}
