import test from 'ava';
import { Password } from '../../src/libraries/password';

const newPassword = () => new Password('secret');

test('Password should hash', async (t) => {
  const password = newPassword();
  await t.notThrowsAsync(async () => {
    await password.hash();
  });
});

test('Password should verify', async (t) => {
  const password = newPassword();
  await t.notThrowsAsync(async () => {
    const hash = await password.hash();
    const ok = await password.verify(hash);
    t.true(ok, 'hash verified');
  });
});

test('Password should throw for invalid hash', async (t) => {
  const password = newPassword();
  const hash = await password.hash();
  ++hash.v;
  await t.throwsAsync(async () => {
    await password.verify(hash);
  });
});

test('Password should generate different hashes for same passwords', async (t) => {
  const password = newPassword();

  const hash1 = await password.hash();
  await t.notThrowsAsync(async () => {
    await password.verify(hash1);
  });

  const hash2 = await password.hash();
  await t.notThrowsAsync(async () => {
    await password.verify(hash2);
  });

  t.notDeepEqual(hash1, hash2);
});

test('Password should encrypt data', async (t) => {
  const password = newPassword();
  await t.notThrowsAsync(async () => {
    await password.encrypt(Buffer.from('hello world'));
  });
});

test('Password should decrypt data', async (t) => {
  const password = newPassword();
  await t.notThrowsAsync(async () => {
    const input = Buffer.from('hello world');
    const encrypted = await password.encrypt(input);
    const decrypted = await password.decrypt(encrypted);
    t.deepEqual(decrypted, input);
  });
});

test('Password should generate different encrypted data for same input', async (t) => {
  const password = newPassword();
  await t.notThrowsAsync(async () => {
    const input = Buffer.from('hello world');

    const encrypted1 = await password.encrypt(input);
    const decrypted1 = await password.decrypt(encrypted1);
    t.deepEqual(decrypted1, input);

    const encrypted2 = await password.encrypt(input);
    const decrypted2 = await password.decrypt(encrypted2);
    t.deepEqual(decrypted2, input);

    t.notDeepEqual(encrypted1, encrypted2);
  });
});

test('Password should throw for invalid encrypted data', async (t) => {
  const password = newPassword();
  const input = Buffer.from('hello world');
  const encrypted = await password.encrypt(input);
  ++encrypted.v;
  await t.throwsAsync(async () => {
    await password.decrypt(encrypted);
  });
});
