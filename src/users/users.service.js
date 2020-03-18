import { Injectable, Dependencies } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';

@Injectable()
@Dependencies(getModelToken('User'))
export class UsersService {
  constructor(userModel) {
    this.userModel = userModel;
  }

  async create(id, { name, dob, address, description }) {
    const user = this.userModel({
      id,
      name,
      dob,
      address,
      description,
    });
    return user.save();
  }

  async getById(id) {
    const user = await this.userModel.findOne({ id }).exec();
    return user;
  }
}
