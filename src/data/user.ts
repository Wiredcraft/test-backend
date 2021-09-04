import { User } from "../models";

interface UserRepo {
    // db
    CreateUser(u: User): Promise<CreateUserReply>;
    UpdateUser(u: User): UpdateUserReply;
    DeleteUser(id: string): DeleteUserReply;
    GetUser(id: string): User;
    ListUser(q: ListUserRequest): [User];
}

export interface User {
    id: string;
    name: String; // String is shorthand for {type: String}
    dob?: String;
    address?: String;
    description?: String;
    createdAt?: Date;
}

export interface CreateUserReply {
    id: string;
}

export interface UpdateUserReply {
    id: string;
}

export interface DeleteUserReply {
    ok: boolean;
}

export interface ListUserRequest {
    offset: number;
    limit: number;
    name?: string;
}

class userRepo implements UserRepo {
    async CreateUser(u: User): Promise<CreateUserReply> {
        const doc = new User({
            ...u,
        });

        await doc.save();

        return {
            id: doc.id,
        } as CreateUserReply;
    }
    UpdateUser(u: any): UpdateUserReply {
        throw new Error("Method not implemented.");
    }
    DeleteUser(id: string): DeleteUserReply {
        throw new Error("Method not implemented.");
    }
    GetUser(id: string): User {
        throw new Error("Method not implemented.");
    }
    ListUser(q: ListUserRequest): [User] {
        throw new Error("Method not implemented.");
    }
}

export default userRepo;
