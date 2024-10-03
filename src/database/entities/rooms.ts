import { Entity, Column, PrimaryGeneratedColumn, Index } from 'typeorm';

@Entity('rooms')
@Index('IDX_rooms_appId', ['appId'])
@Index('IDX_rooms_appPid', ['appPid'])
@Index('IDX_rooms_roomId', ['roomId'])
@Index('IDX_rooms_uid', ['uid'])
@Index('IDX_rooms_createdAt', ['createdAt'])
export class Room {
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
  createdAt: Date;

  @Column()
  updatedAt: Date;

  @Column({ nullable: true })
  deletedAt: Date;
}
