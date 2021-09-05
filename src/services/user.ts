import UserGeoRepo, {
    UpdateUserGeoReply,
    ListNearbyReply,
} from "@/data/user_geo";
import { off } from "process";
import UserRepo, {
    CreateUserReply,
    UpdateUserReply,
    DeleteUserReply,
} from "../data/user";

import { redisClient } from "../db/redis";
import { UserEntity, UserGeoEntity } from "../models";

// maybe this should be singleton
function newUserRepo() {
    return new UserRepo();
}

function newUserGeoRepo() {
    return new UserGeoRepo();
}

// The assembly layer of business logic, similar to the domain layer of DDD
class userUsecase {
    async CreateUser(u: UserEntity): Promise<CreateUserReply> {
        return await newUserRepo().CreateUser(u);
    }

    async UpdateUser(id: string, u: UserEntity): Promise<UpdateUserReply> {
        return await newUserRepo().UpdateUser(id, u);
    }

    async DeleteUser(id: string): Promise<DeleteUserReply> {
        return await newUserRepo().DeleteUser(id);
    }

    async GetUser(id: string): Promise<UserEntity> {
        return await newUserRepo().GetUser(id);
    }
}

// user geo service
class userGeoUseCase {
    async UpdateUserGeo(
        _id: string,
        geo: [number]
    ): Promise<UpdateUserGeoReply> {
        // set geo
        if (geo.length) {
            await redisClient.set(`user_geo:${_id}`, JSON.stringify(geo));
            await redisClient.expire(`user_geo:${_id}`, 60 * 60 * 24);
        } else {
            // delete geo
            // remove cache
            await redisClient.del(`user_geo:${_id}`);
        }
        return await newUserGeoRepo().UpdateUserGeo(_id, geo);
    }

    async ListUserNearby(
        _id: string,
        distance: number,
        offset: number,
        limit: number
    ): Promise<ListNearbyReply> {
        let lnglat: number[] = [];

        const res = await redisClient.get(`user_geo:${_id}`);

        if (res) {
            // get value in redis
            const arr = JSON.parse(res);
            lnglat = arr;
        } else {
            // no value in redis get data in mongo
            const userGeo = await newUserGeoRepo().GetUserGeo(_id);
            lnglat = userGeo.geo as number[];
        }

        // no geo data , return directly
        if (lnglat.length == 0) {
            return {
                list: [],
                count: 0,
            };
        }

        return await newUserGeoRepo().ListUserNearby(
            _id,
            lnglat,
            distance,
            offset,
            limit
        );
    }
}

export function NewUserusecase() {
    return new userUsecase();
}

export function NewUserGeousecase() {
    return new userGeoUseCase();
}
