import {Redis} from "../database/Redis";
import {User as UserModel} from "../model/User";
import {genDbKey} from "../utility/Utility";

export const KEY_USER_ID = "User:ID:%ID%";

export const getUser = async (userId: string): Promise<UserModel | null> => {
  const result = await Redis.get().get(genDbKey(KEY_USER_ID, {"%ID%": userId}));

  if (result !== null) {
    return JSON.parse(result);
  } else {
    return null;
  }
};

export const createUser = async (user: UserModel): Promise<string> => {
  return await updateUser(user);
};

export const updateUser = async (user: UserModel): Promise<string> => {
  return await Redis.get().set(genDbKey(KEY_USER_ID, {"%ID%": user.id}), JSON.stringify(user));
};

export const deleteUser = async (userId: string): Promise<number> => {
  return await Redis.get().del([genDbKey(KEY_USER_ID, {"%ID%": userId})]);
};
