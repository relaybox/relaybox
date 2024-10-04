import {
  createCipheriv,
  createDecipheriv,
  createHmac,
  pbkdf2Sync,
  randomBytes,
  scryptSync,
  timingSafeEqual
} from 'crypto';

const EMULATOR = process.env.EMULATOR === 'true';
const AUTH_ENCRYPTION_KEY = process.env.AUTH_ENCRYPTION_KEY || '';
const AUTH_ENCRYPTION_SALT = process.env.AUTH_ENCRYPTION_SALT || '';
const AUTH_HMAC_KEY = process.env.AUTH_HMAC_KEY || '';
const AUTH_ENCRYPTION_ALGORITHM = 'aes-256-gcm';
const SALT_LENGTH = 16;
const SECRET_LENGTH = 32;
const ITERATIONS = 100000;
const KEY_LENGTH = 64;

enum Encoding {
  BASE64 = 'base64',
  HEX = 'hex',
  UTF8 = 'utf-8'
}

enum Digest {
  SHA256 = 'sha256',
  SHA512 = 'sha512'
}

/**
 * TODO: Implement key versioning strategy
 *
 * Implement flow that incrementally updates
 * values with new key version as users authenticate
 * Potentially move key versioning to kms for cloud hosted apps
 */
export function getKeyVersion() {
  return 1;
}

export function encrypt(value: string, salt?: string): string {
  const encryptionSalt = salt || AUTH_ENCRYPTION_SALT;

  if ((!AUTH_ENCRYPTION_KEY || !encryptionSalt) && !EMULATOR) {
    throw new Error('Missing required encryption key or salt');
  }

  const key = scryptSync(AUTH_ENCRYPTION_KEY, encryptionSalt, 32);
  const iv = randomBytes(12);
  const cipher = createCipheriv(AUTH_ENCRYPTION_ALGORITHM, key, iv);
  const encrypted = Buffer.concat([cipher.update(value, Encoding.UTF8), cipher.final()]);
  const authTag = cipher.getAuthTag();
  const encryptedString = `${iv.toString(Encoding.HEX)}:${authTag.toString(
    Encoding.HEX
  )}:${encrypted.toString(Encoding.HEX)}`;

  return Buffer.from(encryptedString).toString(Encoding.BASE64);
}

export function decrypt(encryptedValue: string, salt?: string): string {
  const decryptionSalt = salt || AUTH_ENCRYPTION_SALT;

  if ((!AUTH_ENCRYPTION_KEY || !decryptionSalt) && !EMULATOR) {
    throw new Error('Missing required encryption key or salt');
  }

  const encryptedString = Buffer.from(encryptedValue, Encoding.BASE64).toString(Encoding.UTF8);

  const [ivHex, authTagHex, encryptedHex] = encryptedString.split(':');

  if (!ivHex || !authTagHex || !encryptedHex) {
    throw new Error('Invalid encrypted data format');
  }

  const iv = Buffer.from(ivHex, Encoding.HEX);
  const authTag = Buffer.from(authTagHex, Encoding.HEX);
  const encrypted = Buffer.from(encryptedHex, Encoding.HEX);
  const key = scryptSync(AUTH_ENCRYPTION_KEY, decryptionSalt, 32);
  const decipher = createDecipheriv(AUTH_ENCRYPTION_ALGORITHM, key, iv);

  decipher.setAuthTag(authTag);

  const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);

  return decrypted.toString();
}

export function generateHash(value: string): string {
  const hmac = createHmac(Digest.SHA256, AUTH_HMAC_KEY);
  hmac.update(value);
  return hmac.digest(Encoding.HEX);
}

export function generateSalt(): string {
  return randomBytes(SALT_LENGTH).toString(Encoding.HEX);
}

export function generateSecret(): string {
  return randomBytes(SECRET_LENGTH).toString(Encoding.HEX);
}

export function strongHash(password: string, salt: string): string {
  const hash = pbkdf2Sync(password, salt, ITERATIONS, KEY_LENGTH, Digest.SHA512).toString(
    Encoding.HEX
  );

  return hash;
}

export function verifyStrongHash(password: string, storedHash: string, salt: string): boolean {
  const hash = pbkdf2Sync(password, salt, ITERATIONS, KEY_LENGTH, Digest.SHA512).toString(
    Encoding.HEX
  );

  return timingSafeEqual(Buffer.from(hash, Encoding.HEX), Buffer.from(storedHash, Encoding.HEX));
}
