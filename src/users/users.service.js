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

  async update(id, { name, dob, address, description }) {
    const user = await this.userModel.findOne({ id }).exec();
    if (!user) {
      return null;
    }
    user.name = name;
    user.dob = dob;
    user.address = address;
    user.description = description;
    return user.save();
  }

  async delete(id) {
    const user = await this.userModel.findOne({ id }).exec();
    if (!user) {
      return;
    }
    await user.remove();
  }
}
