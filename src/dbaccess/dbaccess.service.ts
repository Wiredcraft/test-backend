import { ConflictException, Injectable } from "@nestjs/common";
import UserDto from "@wiredcraft/users/dto/user.dto";
import { PrismaService } from "./prisma.service";

export const DB_ACCESS_SERVICE = "DB_ACCESS_SERVICE";

export interface DBAccess {
  create(userData: UserDto): Promise<UserDto>;
  findAll(page?: number, perPage?: number): Promise<UserDto[] | []>;
  findById(id: string): Promise<UserDto | null>;
  update(id: string, userData: UserDto): Promise<UserDto>;
  delete(id: string): Promise<UserDto>;
}

@Injectable()
export class DBAccessService implements DBAccess {
  constructor(private readonly prisma: PrismaService) {}
  async findUserByEmail(email: string) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
      select: { id: true, name: true, email: true },
    });
    return existingUser;
  }
  async create(userData: UserDto): Promise<UserDto> {
    const existingUser = await this.findUserByEmail(userData.email);
    if (existingUser) {
      throw new ConflictException("Email address is ready existed");
    }
    return await this.prisma.user.create({ data: userData });
  }

  async findAll(page, perPage): Promise<UserDto[]> {
    const skip = (page - 1) * perPage;
    return this.prisma.user.findMany({
      skip,
      take: perPage,
    });
  }
  async findById(id: string): Promise<UserDto> {
    return await this.prisma.user.findUnique({ where: { id } });
  }
  async update(id: string, userData: UserDto): Promise<UserDto> {
    const existingUser = await this.findUserByEmail(userData.email);
    if (existingUser && existingUser.id !== id) {
      throw new ConflictException("Email address is ready existed");
    }
    return this.prisma.user.update({ where: { id }, data: userData });
  }
  delete(id: string): Promise<UserDto> {
    return this.prisma.user.delete({ where: { id } });
  }
}
