import { Entity, Column, PrimaryGeneratedColumn, Index, Unique } from 'typeorm';

@Entity('room_members')
@Index('IDX_room_members_appPid', ['appPid'])
@Index('IDX_room_members_roomId', ['roomId'])
@Index('IDX_room_members_clientId', ['clientId'])
@Index('IDX_room_members_createdAt', ['createdAt'])
@Index('IDX_room_members_memberType', ['memberType'])
@Index('IDX_room_members_roomInternalId', ['internalId'])
@Unique('UQ_room_members_appPid_roomId_uid', ['appPid', 'roomId', 'uid'])
export class RoomMember {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  appPid: string;

  @Column()
  roomId: string;

  @Column('uuid')
  internalId: string;

  @Column()
  uid: string;

  @Column({ nullable: true })
  clientId: string;

  @Column()
  memberType: string;

  @Column()
  createdAt: Date;

  @Column()
  updatedAt: Date;

  @Column({ nullable: true })
  deletedAt: Date;
}
