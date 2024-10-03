import {
  createCipheriv,
  createDecipheriv,
  createHmac,
  pbkdf2Sync,
  randomBytes,
  scryptSync,
  timingSafeEqual
} from 'crypto';

const AUTH_ENCRYPTION_KEY = process.env.AUTH_ENCRYPTION_KEY || '';
const AUTH_ENCRYPTION_SALT = process.env.AUTH_ENCRYPTION_SALT || '';
const AUTH_HMAC_KEY = process.env.AUTH_HMAC_KEY || '';
const AUTH_ENCRYPTION_ALGORITHM = 'aes-256-cbc';
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

export function encrypt(value: string, salt?: string): string {
  const encryptionSalt = salt || AUTH_ENCRYPTION_SALT;
  const key = scryptSync(AUTH_ENCRYPTION_KEY, encryptionSalt, 32);
  const iv = randomBytes(16);
  const cipher = createCipheriv(AUTH_ENCRYPTION_ALGORITHM, key, iv);
  const encrypted = Buffer.concat([cipher.update(value), cipher.final()]);
  const encryptedString = `${iv.toString(Encoding.HEX)}:${encrypted.toString(Encoding.HEX)}`;

  return Buffer.from(encryptedString).toString(Encoding.BASE64);
}

export function decrypt(encryptedValue: string, salt?: string): string {
  const decryptionSalt = salt || AUTH_ENCRYPTION_SALT;
  const encryptedString = Buffer.from(encryptedValue, Encoding.BASE64).toString(Encoding.UTF8);
  const [ivHex, encryptedHex] = encryptedString.split(':');
  const key = scryptSync(AUTH_ENCRYPTION_KEY, decryptionSalt, 32);

  const decipher = createDecipheriv(
    AUTH_ENCRYPTION_ALGORITHM,
    key,
    Buffer.from(ivHex, Encoding.HEX)
  );

  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(encryptedHex, Encoding.HEX)),
    decipher.final()
  ]);

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

export function getKeyVersion() {
  return 1;
}
