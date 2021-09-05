import { User, UserGeo, UserGeoEntity } from "../models";
import mongoose from "mongoose";
import { redisClient } from "../db/redis";

export interface UpdateUserGeoReply {
    _id: string;
    ok?: boolean;
    geo?: number[];
}

export interface ListNearbyReply {
    list: UserGeoEntity[];
    count: number;
}

export interface GetUserGeoReply {
    _id: string;
    geo?: number[];
}

interface IUserGeoRepo {
    // db
    GetUserGeo(id: string): Promise<GetUserGeoReply>;
    UpdateUserGeo(id: string, geo: number[]): Promise<UpdateUserGeoReply>;
    ListUserNearby(
        id: string,
        lnglat: number[],
        distance: number,
        offset: number,
        limit: number
    ): Promise<ListNearbyReply>;
    // redis

    GetUserGeoCache(id: string): Promise<number[]>;
    SetUserGeoCache(id: string, geo: number[]): any;
    DeleteUserGeoCache(id: string): any;
}

const USER_GEO_REDIS_PREFIX = "user_geo:";

class UserGeoRepo implements IUserGeoRepo {
    async GetUserGeoCache(id: string): Promise<number[]> {
        let lnglat: number[] = [];
        const res = await redisClient.get(`${USER_GEO_REDIS_PREFIX}${id}`);
        lnglat = JSON.parse(res);
        return lnglat;
    }
    async SetUserGeoCache(_id: string, geo: number[]) {
        await redisClient.set(
            `${USER_GEO_REDIS_PREFIX}${_id}`,
            JSON.stringify(geo)
        );
        await redisClient.expire(
            `${USER_GEO_REDIS_PREFIX}${_id}`,
            60 * 60 * 24
        );
    }
    async DeleteUserGeoCache(id: string) {
        await redisClient.del(`${USER_GEO_REDIS_PREFIX}${id}`);
    }
    async GetUserGeo(id: string): Promise<GetUserGeoReply> {
        const res = await UserGeo.findOne({
            user_id: id,
        });

        return res as GetUserGeoReply;
    }
    async ListUserNearby(
        id: string,
        lnglat: number[],
        distance: number,
        offset: number,
        limit: number
    ): Promise<ListNearbyReply> {
        const res = await UserGeo.aggregate([
            {
                $geoNear: {
                    near: {
                        type: "Point",
                        coordinates: [lnglat[0], lnglat[1]],
                    },
                    distanceField: "distance", // 距离数值字段名
                    spherical: true,
                    maxDistance: distance || 1000, // (Int类型的最大距离--米，例如500，1000),
                },
            },
            {
                $match: {
                    _id: { $ne: new mongoose.Types.ObjectId(id) },
                },
            },
            // pagination skip
            {
                $skip: offset,
            },
            // pagination limit
            {
                $limit: limit,
            },
        ]);

        const count = await UserGeo.aggregate([
            {
                $geoNear: {
                    near: {
                        type: "Point",
                        coordinates: [
                            lnglat[0], //用户经度
                            lnglat[1], //用户纬度
                        ],
                    },
                    distanceField: "distance", // 距离数值字段名
                    spherical: true,
                    maxDistance: 1000,
                },
            },
            {
                $match: {
                    _id: { $ne: new mongoose.Types.ObjectId(id) },
                },
            },
            {
                $group: { _id: null, count: { $sum: 1 } },
            },
        ]);

        return {
            list: res,
            count: count.length ? count[0].count : 0,
        };
    }

    async UpdateUserGeo(
        _id: string,
        geo: [number]
    ): Promise<UpdateUserGeoReply> {
        const res = await UserGeo.updateOne(
            { _id: _id },
            {
                $set: {
                    geo: geo,
                },
            },
            { upsert: true }
        );

        return {
            _id: _id,
            geo: geo,
            ok: !!res.matchedCount,
        };
    }
}

export default UserGeoRepo;
