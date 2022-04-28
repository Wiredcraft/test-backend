import bcrypt from 'bcryptjs';

export const comparePwd = async (pwd: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(pwd, hash);
};

export const hashPwd = async (pwd: string, salt = 10): Promise<string> => {
  return bcrypt.hash(pwd, salt);
};
