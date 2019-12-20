import { Injectable } from '@nestjs/common';
import { InjectModel } from "@nestjs/mongoose";
import { Model } from 'mongoose';
import { genSaltSync, hashSync } from 'bcrypt';
import { CreateUserDto } from "./dto/create-user.dto";
import {UpdateUserDto} from "./dto/update-user.dto";
import {User} from "./models/user.m";

@Injectable()
export class UserService {
    constructor(@InjectModel('User') private readonly userModel: Model<User>) {}

    async create(createUserDto: CreateUserDto): Promise<User> {
        const salt = genSaltSync(10);
        createUserDto.password = hashSync(createUserDto.password, salt);
        let createdUser = new this.userModel(createUserDto);
        return await createdUser.save();
    }

    async findById(id: string): Promise<User> {
        return await this.userModel.findById(id).lean();
    }

    async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
        return await this.userModel.findByIdAndUpdate(id, updateUserDto, {new: true}).lean();
    }

    async remove(id: string): Promise<User> {
        return await this.userModel.findByIdAndDelete(id);
    }
}

