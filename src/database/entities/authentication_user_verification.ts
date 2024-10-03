import { Entity, Column, CreateDateColumn, PrimaryGeneratedColumn, Unique } from 'typeorm';

enum VerificationType {
  REGISTER = 'register',
  PASSWORD_RESET = 'passwordReset'
}

@Entity('authentication_user_verification')
@Unique('UQ_authentication_user_verification_code', ['code'])
export class AuthenticationUserVerification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  uid: string;

  @Column()
  identityId: string;

  @Column()
  code: string;

  @Column({ default: VerificationType.REGISTER })
  type: string;

  @Column({ nullable: true })
  verifiedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @Column()
  expiresAt: Date;
}
