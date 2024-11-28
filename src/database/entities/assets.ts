import { Entity, Column, Index, PrimaryColumn, Unique, PrimaryGeneratedColumn } from 'typeorm';

@Entity('assets')
@Index('IDX_assets_deletedAt', ['deletedAt'])
export class Asset {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  appPid: string;

  @Column()
  keyId: string;

  @Column()
  roomId: string;

  @Column({ nullable: true })
  clientId: string;

  @Column()
  name: string;

  @Column()
  type: string;

  @Column()
  size: number;

  @Column({ nullable: true })
  encoding: string;

  @Column()
  createdAt: Date;

  @Column()
  updatedAt: Date;

  @Column({ nullable: true })
  deletedAt: Date;
}
