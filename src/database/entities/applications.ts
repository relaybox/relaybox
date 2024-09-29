import { Entity, Column, PrimaryGeneratedColumn, Index, Unique } from 'typeorm';

@Entity('applications')
@Unique('UQ_applications_pid', ['pid'])
@Unique('UQ_applications_orgId_name', ['orgId', 'name'])
export class Application {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  pid: string;

  @Column('uuid')
  orgId: string;

  @Column()
  name: string;

  @Column()
  createdAt: Date;

  @Column({ nullable: true })
  updatedAt: Date;

  @Column({ nullable: true })
  deletedAt: Date;

  @Column({ default: 24 })
  historyTtlHours: number;
}
