import { Test, TestingModule } from "@nestjs/testing";
import { UserService } from "./user.service";
import {
  DBAccess,
  DB_ACCESS_SERVICE,
} from "@wiredcraft/dbaccess/dbaccess.service";
import UserDto from "./dto/user.dto";

describe("UserService", () => {
  let service: UserService;
  let dbService: DBAccess;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: DB_ACCESS_SERVICE,
          useValue: {
            findAll: jest.fn(),
            findById: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    dbService = module.get<DBAccess>(DB_ACCESS_SERVICE);
  });

  describe("findAll", () => {
    it("should return an array of users", async () => {
      const users: UserDto[] = [
        {
          name: "mock user",
          dob: new Date("2022-01-01"),
          address: "my address",
          description: "hi",
        } as UserDto,
        {
          name: "mock user2",
          dob: new Date("2022-01-01"),
          address: "my address",
          description: "hi",
        } as UserDto,
      ];
      jest.spyOn(dbService, "findAll").mockResolvedValue(users);

      const result = await service.findAll();

      expect(result).toEqual(users);
      expect(dbService.findAll).toHaveBeenCalled();
    });
  });

  describe("findById", () => {
    it("should return a user by ID", async () => {
      const userId = "1";
      const user: UserDto = {
        id: "1",
        name: "mock user",
        dob: new Date("2022-01-01"),
        address: "my address",
        description: "hi",
      } as UserDto;
      jest.spyOn(dbService, "findById").mockResolvedValue(user);

      const result = await service.findById(userId);

      expect(result).toEqual(user);
      expect(dbService.findById).toHaveBeenCalledWith(userId);
    });

    it("should return null if user is not found", async () => {
      const userId = "1";
      jest.spyOn(dbService, "findById").mockResolvedValue(null);

      const result = await service.findById(userId);

      expect(result).toBeNull();
      expect(dbService.findById).toHaveBeenCalledWith(userId);
    });
  });

  describe("create", () => {
    it("should create a new user", async () => {
      const userData: UserDto = {
        id: "1",
        name: "mock user",
        dob: new Date("2022-01-01"),
        address: "my address",
        description: "hi",
      } as UserDto;
      const createdUser: UserDto = { id: "1", ...userData };
      jest.spyOn(dbService, "create").mockResolvedValue(createdUser);

      const result = await service.create(userData);

      expect(result).toEqual(createdUser);
      expect(dbService.create).toHaveBeenCalledWith(userData);
    });
  });

  describe("update", () => {
    it("should update a user", async () => {
      const userId = "1";
      const userData: UserDto = {
        id: "1",
        name: "mock user",
        dob: new Date("2022-01-01"),
        address: "my address",
        description: "hi",
      } as UserDto;
      const updatedUser: UserDto = { id: userId, ...userData };
      jest.spyOn(dbService, "update").mockResolvedValue(updatedUser);

      const result = await service.update(userId, userData);

      expect(result).toEqual(updatedUser);
      expect(dbService.update).toHaveBeenCalledWith(userId, userData);
    });
  });

  describe("delete", () => {
    it("should delete a user", async () => {
      const userId = "1";
      const deletedUser: UserDto = {
        id: "1",
        name: "mock user",
        dob: new Date("2022-01-01"),
        address: "my address",
        description: "hi",
      } as UserDto;
      jest.spyOn(dbService, "delete").mockResolvedValue(deletedUser);

      const result = await service.delete(userId);

      expect(result).toEqual(deletedUser);
      expect(dbService.delete).toHaveBeenCalledWith(userId);
    });
  });
});
