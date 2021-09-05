import { User, UserEntity } from "../models";

import { pick } from "lodash";

const Allow_Update_Column = ["address", "name", "dob", "description"];

interface IUserRepo {
    CreateUser(u: UserEntity): Promise<CreateUserReply>;
    UpdateUser(id: string, u: UserEntity): Promise<UpdateUserReply>;
    DeleteUser(id: string): Promise<DeleteUserReply>;
    GetUser(id: string): Promise<UserEntity>;
    ListUserByIds(ids: string[]): Promise<UserEntity[]>;
}

export interface CreateUserReply {
    _id: string;
}

export interface UpdateUserReply {
    _id: string;
    ok: boolean;
}

export interface DeleteUserReply {
    _id: string;
    ok: boolean;
}

export interface ListUserReply {
    list: UserEntity[];
    count: number;
}

//  data access, including encapsulation of cache, db, etc.
class UserRepo implements IUserRepo {
    async ListUserByIds(ids: string[]): Promise<UserEntity[]> {
        const res = await User.find({
            _id: {
                $in: ids,
            },
        });

        console.log("rrrr", res);

        return res;
    }
    async CreateUser(u: UserEntity): Promise<CreateUserReply> {
        const doc = new User({
            ...u,
        });
        await doc.save();
        return {
            _id: doc._id,
        };
    }
    async UpdateUser(_id: string, u: any): Promise<UpdateUserReply> {
        const res = await User.where({ _id: _id }).update({
            $set: {
                ...pick(u, Allow_Update_Column),
            },
        });

        return {
            _id: _id,
            ok: !!res.matchedCount,
        };
    }
    async DeleteUser(_id: string): Promise<DeleteUserReply> {
        const res = await User.deleteOne({ _id: _id });
        return {
            _id: _id,
            ok: !!res.deletedCount,
        };
    }
    async GetUser(_id: string): Promise<UserEntity> {
        const res = await User.findById(_id);
        return res as UserEntity;
    }
}

export default UserRepo;
