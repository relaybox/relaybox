import { Entity, Column, PrimaryGeneratedColumn, Index, Unique } from 'typeorm';

@Entity('credential_permissions')
@Unique('UQ_credential_permissions_credentialId_permission', ['credentialId', 'permission'])
@Index('IDX_credential_permissions_credentialId', ['credentialId'])
@Index('IDX_credential_permissions_keyId', ['keyId'])
export class CredentialPermission {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  credentialId: string;

  @Column()
  keyId: string;

  @Column()
  permission: string;

  @Column()
  createdAt: Date;

  @Column({ nullable: true })
  deletedAt: Date;
}
