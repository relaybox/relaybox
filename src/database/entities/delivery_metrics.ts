import { Entity, Column, PrimaryGeneratedColumn, Index, Unique } from 'typeorm';

@Entity('delivery_metrics')
@Index('IDX_delivery_metrics_appPid', ['appPid'])
@Index('IDX_delivery_metrics_keyId', ['keyId'])
@Index('IDX_delivery_metrics_uid', ['uid'])
@Index('IDX_delivery_metrics_recipientCount', ['recipientCount'])
@Index('IDX_delivery_metrics_event', ['event'])
@Index('IDX_delivery_metrics_nspRoomId', ['nspRoomId'])
@Index('IDX_delivery_metrics_requestId', ['requestId'])
@Index('IDX_delivery_metrics_createdAt', ['createdAt'])
@Index('IDX_delivery_metrics_dispatchedAt', ['dispatchedAt'])
@Index('IDX_delivery_metrics_receivedAt', ['receivedAt'])
export class DeliveryMetric {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  appId: string;

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

  @Column({ type: 'uuid', nullable: true })
  requestId: string;

  @Column({ nullable: true })
  socketId: string;

  @Column()
  recipientCount: number;

  @Column()
  event: string;

  @Column({ nullable: true })
  listener: string;

  @Column()
  nspRoomId: string;

  @Column({ nullable: true })
  createdAt: Date;

  @Column({ nullable: true })
  receivedAt: Date;

  @Column()
  dispatchedAt: Date;

  @Column()
  persistedAt: Date;

  @Column({ nullable: true })
  deletedAt: Date;
}
