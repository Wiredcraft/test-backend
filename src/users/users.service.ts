import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UsersService {
constructor(
  @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
){}

  save(user: CreateUserDto) {
    const createdUser = new this.userModel(user);
    return createdUser.save();
  }

  async query(params: {id:string}){
    const user = await this.userModel.findById(params.id);
    return user;
  }

  async update(id: string, params: Partial<CreateUserDto>){
    await this.userModel.updateOne({_id: id}, {
      $set: params
    })
  }

  async remove(id: string){
    await this.userModel.updateOne({_id: id}, {
      $set: {
        isDelete: 1,
        deletedAt: new Date()
      }
    })
  }
}
