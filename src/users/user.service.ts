import { Inject, Injectable } from "@nestjs/common";
import {
  DBAccess,
  DB_ACCESS_SERVICE,
} from "@wiredcraft/dbaccess/dbaccess.service";
import UserDto from "./dto/user.dto";
import paginationConfig from "@wiredcraft/config/pagniation.config";

@Injectable()
export class UserService {
  constructor(
    @Inject(DB_ACCESS_SERVICE)
    private readonly dbService: DBAccess
  ) {}

  async findAll(
    page: number = paginationConfig.defaultPage,
    perPage: number = paginationConfig.defaultPerPage
  ): Promise<UserDto[]> {
    return this.dbService.findAll(page, perPage);
  }

  async findById(id: string): Promise<UserDto | null> {
    return this.dbService.findById(id);
  }

  async create(userData: UserDto): Promise<UserDto> {
    return this.dbService.create(userData);
  }
  async update(id: string, userData: UserDto): Promise<UserDto> {
    return this.dbService.update(id, userData);
  }

  async delete(id: string): Promise<UserDto> {
    return this.dbService.delete(id);
  }
}
