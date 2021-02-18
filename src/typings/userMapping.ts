export interface UserMapping {
  id: number;
  userId: number;
  followerId: number;
  createdAt: Date
}

export const USERMAPPING = 'user_mapping';