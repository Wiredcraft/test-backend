import { Member } from './models';

export const initDB = async (options = {}) => {
  await Member.sync(options);
};
