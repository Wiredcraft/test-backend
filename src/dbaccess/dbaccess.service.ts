import { Injectable } from "@nestjs/common";
import UserDto from "@wiredcraft/users/dto/user.dto";
import { PrismaService } from "./prisma.service";

export const DB_ACCESS_SERVICE = "DB_ACCESS_SERVICE";

export interface DBAccess {
  create(userData: UserDto): Promise<UserDto>;
  findAll(): Promise<UserDto[] | []>;
  findById(id: string): Promise<UserDto | null>;
  update(id: string, userData: UserDto): Promise<UserDto>;
  delete(id: string): Promise<UserDto>;
}

@Injectable()
export class DBAccessService implements DBAccess {
  constructor(private readonly prisma: PrismaService) {}
  async create(userData: UserDto): Promise<UserDto> {
    return await this.prisma.user.create({ data: userData });
  }

  async findAll(): Promise<UserDto[]> {
    return this.prisma.user.findMany();
  }
  async findById(id: string): Promise<UserDto> {
    return await this.prisma.user.findUnique({ where: { id } });
  }
  update(id: string, userData: UserDto): Promise<UserDto> {
    return this.prisma.user.update({ where: { id }, data: userData });
  }
  delete(id: string): Promise<UserDto> {
    return this.prisma.user.delete({ where: { id } });
  }
}
