import * as db from '@/cli/db';
import { AppDataSource } from '@/database/data-source';
import { input } from '@inquirer/prompts';
import { generateHash } from '@/lib/encryption';
import { AuthenticationUser } from '@/database/entities/authentication_users';

export async function verifyAuthUser() {
  try {
    await db.initialize();

    const authenticationUserRepository = AppDataSource.getRepository(AuthenticationUser);

    const email = await input({ message: 'Enter email:' });
    const hashedEmail = generateHash(email);
    const now = new Date().toISOString();

    const authenticationUser = await authenticationUserRepository.findOne({
      where: {
        emailHash: hashedEmail
      }
    });

    if (!authenticationUser) {
      console.log('Authentication user not found');
      return;
    }

    const verifications = await AppDataSource.query(
      `SELECT * FROM authentication_user_verification 
       WHERE uid = $1 
       AND "verifiedAt" IS NULL 
       AND type = $2 
       AND "expiresAt" > $3 
       LIMIT 1`,
      [authenticationUser.id, 'register', now]
    );

    if (verifications.length) {
      console.log('Verification code:', verifications[0].code);
    } else {
      console.log('Verification code not found');
    }
  } catch (err) {
    console.log('Error verifying authentication user:', err);
  } finally {
    await db.end();
  }
}

export async function getResetPasswordverificationCode() {
  try {
    await db.initialize();

    const authenticationUserRepository = AppDataSource.getRepository(AuthenticationUser);

    const email = await input({
      message: 'Enter email:'
    });

    const hashedEmail = generateHash(email);
    const now = new Date().toISOString();

    const authenticationUser = await authenticationUserRepository.findOne({
      where: {
        emailHash: hashedEmail
      }
    });

    if (!authenticationUser) {
      console.log('Authentication user not found');
      return;
    }

    const verifications = await AppDataSource.query(
      `SELECT * FROM authentication_user_verification 
       WHERE uid = $1 
       AND "verifiedAt" IS NULL 
       AND type = $2 
       AND "expiresAt" > $3 
       LIMIT 1`,
      [authenticationUser.id, 'passwordReset', now]
    );

    if (verifications.length) {
      console.log('Password reset code:', verifications[0].code);
    } else {
      console.log('Password reset code not found');
    }
  } catch (err) {
    console.log('Error getting password reset code:', err);
  } finally {
    await db.end();
  }
}
