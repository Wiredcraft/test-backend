import { HttpException, Injectable, UnauthorizedException, ForbiddenException } from '@nestjs/common';
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

  async register(data: { username: string; password }) {
    const has = await this.model.countDocuments({ username: data.username });
    if (has) throw new ForbiddenException('Username conflict');
    const savePass = await this.encrypt(data.password);

    return this.create({ username: data.username, password: savePass });
  }

  async login(data: User) {
    return {
      token: this.jwtService.sign({ username: data.username, id: data._id }),
    };
  }

  async validateUser(data: { username: string; password: string }) {
    const user = await this.model.findOne({ username: data.username });
    if (!user) throw new Error('User not found');
    const passed = await bcrypt.compare(data.password, user.password);

    if (!passed) throw new UnauthorizedException('Invalid password');
    const { password, ...result } = user.toJSON();
    return result;
  }

  async validateUserByToken(token: string) {
    const payload = this.jwtService.decode(token);
    if (typeof payload === 'string') throw new UnauthorizedException('Invalid token');
    const user = await this.model.findById(payload.id);
    return user
  }
}
