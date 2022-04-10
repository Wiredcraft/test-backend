import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { BaseService } from '../base.service';
import { User } from './user.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService extends BaseService<User> {
  protected readonly omitFields = ['password'];
  constructor(
    @InjectModel(User.name) protected readonly model: Model<User>,
    protected readonly jwtService: JwtService,
  ) {
    super();
  }
  private async encrypt(password: string) {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  }

  async register(data: { userName: string; password }) {
    const has = await this.model.countDocuments({ userName: data.userName });
    if (has) throw new HttpException('UserName conflict', 403);
    const savePass = await this.encrypt(data.password);

    return this.create({ userName: data.userName, password: savePass });
  }

  async login(data: User) {
    return {
      token: this.jwtService.sign({ userName: data.userName, id: data._id }),
    };
  }

  async validateUser(data: { userName: string; password: string }) {
    const user = await this.model.findOne({ userName: data.userName });
    if (!user) throw new Error('User not found');
    await bcrypt.compare(data.password, user.password);
    const { password, ...result } = user;
    return result;
  }

  async validateUserByToken(token: string) {
    const payload = this.jwtService.decode(token);
    if (typeof payload === 'string') throw new Error('Invalid token');
    const user = await this.model.findById(payload.id);
    return user
  }
}
