import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../../schemas/user.schema';
import { CreateUserDto } from '../../dto/create-user.dto';

@Injectable()
export class UserService {
    constructor(
        @InjectModel('User') private userModel: Model<UserDocument>
    ) {

    }

    async create(createUserDto: CreateUserDto): Promise<any> {
        try {
            const createdUser = new this.userModel(createUserDto);
            const user = await createdUser.save();
            return {status: 200, message:'success', data: user}
        } catch (error) {
            return { status:500,message:'failed', data: {}}
        }
    }

    async findAll(): Promise<any> {
        let users = [];
        try {
            users = await this.userModel.find().exec();
            return {status: 200, message:'success', data: users}
        } catch (error) {
            return { status:500,message:'failed', data:users}
        }
    }

    async deleteById(id: number): Promise<any>{
        try {
            const deleteOption = { id };
            const { deletedCount } =  await this.userModel.deleteOne(deleteOption);
            if( deletedCount === 0){
                return { status: 200, message:`user ${id} is not find`, data: {}}
            }else{
                return { status: 200, message:`user ${id} is delete`, data: {}}
            }
        } catch (error) {
            return { status: 500, message: 'server error', data: []}
        }
     
    }

    async updateById(createUserDto: CreateUserDto): Promise<any>{
        try {
            const { id } = createUserDto;
            const updateFliter = { id };
            const { modifiedCount } = await this.userModel.updateOne(updateFliter, createUserDto);
            if( modifiedCount === 1){
                return { status: 200, message:`user ${id} is updated`, data: {}}
            }else{
                return { status: 200, message:`user ${id} is not found`, data: {}}
            }
        } catch (error) {
            return { status: 500, message:'server error', data: {}}  
        }
        
    }
}
