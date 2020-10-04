import {Redis} from "../database/Redis";
import {genDbKey} from "../utility/Utility";

export const KEY_USER_FOLLOWER_ID = "User:Follower:%ID%";
export const KEY_USER_FOLLOWING_ID = "User:Following:%ID%";

export const followUser = async (userId: string, targetId: string) => {
  await Redis.get().sadd(genDbKey(KEY_USER_FOLLOWER_ID, {"%ID%": targetId}), userId);
  await Redis.get().sadd(genDbKey(KEY_USER_FOLLOWING_ID, {"%ID%": userId}), targetId);
};

export const unfollowUser = async (userId: string, targetId: string) => {
  await Redis.get().srem(genDbKey(KEY_USER_FOLLOWER_ID, {"%ID%": targetId}), userId);
  await Redis.get().srem(genDbKey(KEY_USER_FOLLOWING_ID, {"%ID%": userId}), targetId);
};

export const getFollowers = async (userId: string) => {
  return await Redis.get().smembers(genDbKey(KEY_USER_FOLLOWER_ID, {"%ID%": userId}));
};

export const getFollowing = async (userId: string) => {
  return await Redis.get().smembers(genDbKey(KEY_USER_FOLLOWING_ID, {"%ID%": userId}));
};
