import { Entity, Column, CreateDateColumn, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity('authentication_providers')
export class AuthenticationProviders {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  friendlyName: string;

  @Column('text', { array: true })
  defaultScopes: string[];

  @Column({ nullable: true })
  deletedAt: Date;
}
