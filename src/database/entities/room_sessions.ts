import { Entity, Column, PrimaryGeneratedColumn, Index } from 'typeorm';

@Entity('room_sessions')
@Index('IDX_room_sessions_appId', ['appId'])
@Index('IDX_room_sessions_appPid', ['appPid'])
@Index('IDX_room_sessions_roomId', ['roomId'])
@Index('IDX_room_sessions_nspRoomId', ['nspRoomId'])
@Index('IDX_room_sessions_uid', ['uid'])
@Index('IDX_room_sessions_createdAt', ['createdAt'])
@Index('IDX_room_sessions_joinedAt', ['joinedAt'])
@Index('IDX_room_sessions_leftAt', ['leftAt'])
export class RoomSession {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  appId: string;

  @Column()
  appPid: string;

  @Column()
  roomId: string;

  @Column()
  nspRoomId: string;

  @Column()
  uid: string;

  @Column({ nullable: true })
  clientId: string;

  @Column()
  connectionId: string;

  @Column()
  socketId: string;

  @Column()
  joinedAt: Date;

  @Column({ nullable: true })
  leftAt: Date;

  @Column()
  createdAt: Date;

  @Column()
  updatedAt: Date;
}
