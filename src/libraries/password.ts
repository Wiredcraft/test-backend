import crypto from 'crypto';

const randomBits = (n: number) => crypto.randomBytes(n / 8);

const kdfV1 = (
  password: crypto.BinaryLike,
  salt: crypto.BinaryLike,
  bits: number
): Promise<Buffer> => {
  const options = {
    N: 16384,
    r: 8,
    p: 1,
  };
  return new Promise((resolve, reject) => {
    crypto.scrypt(password, salt, bits / 8, options, (err: Error | null, derivedKey: Buffer) => {
      if (err) {
        reject(err);
      } else {
        resolve(derivedKey);
      }
    });
  });
};

export interface PasswordHashResult {
  v: number;
  salt: string;
  hash: string;
}

type PasswordVerifyOptions = PasswordHashResult;

export interface PasswordEncryptResult {
  v: number;
  salt: string;
  iv: string;
  tag: string;
  data: string;
}

type PasswordDecryptOptions = PasswordEncryptResult;

class InvalidPasswordVersion extends Error {
  constructor(v: number) {
    super(`Invalid password version, expected: ${v}`);
  }
}

export class Password {
  constructor(private password: string) {}

  async hash(): Promise<PasswordHashResult> {
    // sha
    const sha256 = crypto.createHash('sha256');
    sha256.update(this.password);
    const digest = sha256.digest();
    // kdf
    const salt = randomBits(128);
    const hash = await kdfV1(digest, salt, 256);
    return { v: 1, salt: salt.toString('hex'), hash: hash.toString('hex') };
  }

  async verify(options: PasswordVerifyOptions): Promise<boolean> {
    if (options.v !== 1) {
      throw new InvalidPasswordVersion(1);
    }
    // sha
    const sha256 = crypto.createHash('sha256');
    sha256.update(this.password);
    const digest = sha256.digest();
    // kdf
    const salt = Buffer.from(options.salt, 'hex');
    const actualHash = await kdfV1(digest, salt, 256);
    const expectedHash = Buffer.from(options.hash, 'hex');
    return actualHash.equals(expectedHash);
  }

  async encrypt(data: Buffer): Promise<PasswordEncryptResult> {
    const salt = randomBits(128);
    const key = await kdfV1(this.password, salt, 256);
    const iv = randomBits(256);
    const aes = crypto.createCipheriv('aes-256-gcm', key, iv);
    const encrypted = Buffer.concat([aes.update(data), aes.final()]);
    const tag = aes.getAuthTag();
    return {
      v: 1,
      salt: salt.toString('hex'),
      iv: iv.toString('hex'),
      tag: tag.toString('hex'),
      data: encrypted.toString('hex'),
    };
  }

  async decrypt(options: PasswordDecryptOptions): Promise<Buffer> {
    if (options.v !== 1) {
      throw new InvalidPasswordVersion(1);
    }
    const salt = Buffer.from(options.salt, 'hex');
    const iv = Buffer.from(options.iv, 'hex');
    const tag = Buffer.from(options.tag, 'hex');
    const encrypted = Buffer.from(options.data, 'hex');
    const key = await kdfV1(this.password, salt, 256);
    const aes = crypto.createDecipheriv('aes-256-gcm', key, iv).setAuthTag(tag);
    return Buffer.concat([aes.update(encrypted), aes.final()]);
  }
}
