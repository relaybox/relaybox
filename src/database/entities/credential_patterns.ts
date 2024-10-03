import { Entity, Column, PrimaryGeneratedColumn, Index, Unique } from 'typeorm';

@Entity('credential_patterns')
@Unique('UQ_credential_patterns_credentialId_pattern', ['credentialId', 'pattern'])
@Index('IDX_credential_patterns_credentialId', ['credentialId'])
@Index('IDX_credential_patterns_keyId', ['keyId'])
@Index('IDX_credential_patterns_pattern', ['pattern'])
export class CredentialPattern {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  credentialId: string;

  @Column()
  keyId: string;

  @Column()
  pattern: string;

  @Column()
  createdAt: Date;

  @Column({ nullable: true })
  deletedAt: Date;
}
