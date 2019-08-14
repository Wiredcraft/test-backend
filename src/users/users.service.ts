import { Inject, Injectable } from "@nestjs/common";
import { MongooseModule, InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User } from "./interfaces/user.interface";
import { UserFollow } from "./interfaces/user-follow.interface";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { FollowUserDto } from "./dto/follow-user.dto";

@Injectable()
export class UserService {
    constructor(@InjectModel('User') private readonly userModel: Model<User>, @InjectModel('UserFollow') private readonly userFollowModel: Model<UserFollow>) { }

    async createOne(createUserDto: CreateUserDto): Promise<User> {
        return await new this.userModel(createUserDto).save();
    }

    async findOne(id: String): Promise<User> {
        return await this.userModel.findOne({ 'id': id });
    }

    async findOneAndUpdate(id: String, updateUserDto: UpdateUserDto): Promise<User> {
        return await this.userModel.findOneAndUpdate({ "id": id }, updateUserDto, { new: true });
    }

    async deleteOne(id: String) {
        return await this.userModel.deleteOne({ 'id': id });
    }

    async followOne(followUserDto: FollowUserDto): Promise<UserFollow> {
        return await new this.userFollowModel(followUserDto).save();
    }

    async unfollowOne(followUserDto: FollowUserDto) {
        return await this.userFollowModel.deleteOne({ 'from': followUserDto.from, 'to': followUserDto.to });
    }
}