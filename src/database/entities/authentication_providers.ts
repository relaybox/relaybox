import { Entity, Column, CreateDateColumn, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity('authentication_providers')
@Unique('UQ_authentication_providers_name', ['name'])
export class AuthenticationProvider {
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
