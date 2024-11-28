import { Entity, Column, PrimaryGeneratedColumn, Index, Unique } from 'typeorm';

@Entity('rooms')
@Index('IDX_rooms_appPid', ['appPid'])
@Index('IDX_rooms_roomId', ['roomId'])
@Index('IDX_rooms_createdAt', ['createdAt'])
@Unique('UQ_rooms_appPid_roomId', ['appPid', 'roomId'])
export class Room {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  appPid: string;

  @Column()
  roomId: string;

  @Column()
  visibility: string;

  @Column({ nullable: true })
  password: string;

  @Column({ nullable: true })
  salt: string;

  @Column()
  createdAt: Date;

  @Column()
  updatedAt: Date;

  @Column({ nullable: true })
  deletedAt: Date;
}
