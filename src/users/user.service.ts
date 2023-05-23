import { Injectable } from "@nestjs/common";

import { User } from ".prisma/client";

@Injectable()
export class UserService {
  constructor() {}

  async findAll(): Promise<User[]> {
    return [];
  }

  async findById(id: string): Promise<User | null> {
    return null;
  }

  async create(user: Partial<User>): Promise<User> {
    return {} as User;
  }

  async update(id: string, user: Partial<User>): Promise<User | null> {
    return null;
  }

  async delete(id: string): Promise<User | null> {
    return null;
  }
}
