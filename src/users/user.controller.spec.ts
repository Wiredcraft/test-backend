import { Test, TestingModule } from "@nestjs/testing";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import UserDto from "./dto/user.dto";
import { DBAccessModule } from "@wiredcraft/dbaccess/dbaccess.module";

describe("UserController", () => {
  let controller: UserController;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DBAccessModule],
      controllers: [UserController],
      providers: [UserService],
    }).compile();

    controller = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
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
      jest.spyOn(userService, "findAll").mockResolvedValue(users);

      const result = await controller.findAll();

      expect(result).toEqual(users);
      expect(userService.findAll).toHaveBeenCalled();
    });
  });

  describe("findById", () => {
    it("should return a user by ID", async () => {
      const userId = "1";
      const user: UserDto = {
        name: "mock user",
        dob: new Date("2022-01-01"),
        address: "my address",
        description: "hi",
      } as UserDto;
      jest.spyOn(userService, "findById").mockResolvedValue(user);

      const result = await controller.findById(userId);

      expect(result).toEqual(user);
      expect(userService.findById).toHaveBeenCalledWith(userId);
    });

    it("should return null if user is not found", async () => {
      const userId = "1";
      jest.spyOn(userService, "findById").mockResolvedValue(null);

      const result = await controller.findById(userId);

      expect(result).toBeNull();
      expect(userService.findById).toHaveBeenCalledWith(userId);
    });
  });

  describe("create", () => {
    it("should create a new user", async () => {
      const userData: UserDto = {
        name: "mock user",
        dob: new Date("2022-01-01"),
        address: "my address",
        description: "hi",
      } as UserDto;
      const createdUser: UserDto = { id: "1", ...userData };
      jest.spyOn(userService, "create").mockResolvedValue(createdUser);

      const result = await controller.create(userData);

      expect(result).toEqual(createdUser);
      expect(userService.create).toHaveBeenCalledWith(userData);
    });
  });

  describe("update", () => {
    it("should update a user", async () => {
      const userId = "1";
      const userData: UserDto = {
        name: "mock user",
        dob: new Date("2022-01-01"),
        address: "my address",
        description: "hi",
      } as UserDto;
      const updatedUser: UserDto = { id: userId, ...userData };
      jest.spyOn(userService, "update").mockResolvedValue(updatedUser);

      const result = await controller.update(userId, userData);

      expect(result).toEqual(updatedUser);
      expect(userService.update).toHaveBeenCalledWith(userId, userData);
    });
  });

  describe("delete", () => {
    it("should delete a user", async () => {
      const userId = "1";
      const deletedUser: UserDto = {
        name: "mock user",
        dob: new Date("2022-01-01"),
        address: "my address",
        description: "hi",
      } as UserDto;
      jest.spyOn(userService, "delete").mockResolvedValue(deletedUser);

      const result = await controller.delete(userId);

      expect(result).toEqual(deletedUser);
      expect(userService.delete).toHaveBeenCalledWith(userId);
    });
  });
});
