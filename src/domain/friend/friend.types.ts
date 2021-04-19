import { User } from '../user/user.types';

export interface Friend {
  userId: string;
  otherUserId: string;
  user?: User;
  otherUser?: User;
}

export class CreateFriendDto {
  userId: string;
  otherUserId: string;
}
