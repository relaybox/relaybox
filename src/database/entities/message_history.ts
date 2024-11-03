import { Entity, Column, PrimaryGeneratedColumn, Index, PrimaryColumn } from 'typeorm';

@Entity('message_history')
@Index('IDX_message_history_roomId', ['roomId'])
@Index('IDX_message_history_event', ['event'])
@Index('IDX_message_history_requestId', ['requestId'])
@Index('IDX_message_history_appPid', ['appPid'])
@Index('IDX_message_history_createdAt', ['createdAt'])
export class MessageHistory {
  @PrimaryColumn('uuid')
  id: string;

  @Column()
  appPid: string;

  @Column()
  keyId: string;

  @Column({ nullable: true })
  uid: string;

  @Column({ nullable: true })
  clientId: string;

  @Column({ nullable: true })
  connectionId: string;

  @Column({ nullable: true })
  socketId: string;

  @Column()
  roomId: string;

  @Column()
  event: string;

  @Column()
  requestId: string;

  @Column({ type: 'jsonb' })
  body: any;

  @Column()
  createdAt: Date;

  @Column()
  updatedAt: Date;

  @Column({ nullable: true })
  deletedAt: Date;
}
