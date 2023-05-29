const crypto = require("crypto");
import { Test, TestingModule } from "@nestjs/testing";
import { DBAccessModule } from "@wiredcraft/dbaccess/dbaccess.module";
import { PrismaService } from "@wiredcraft/dbaccess/prisma.service";
import { createPrismaMockService } from "@wiredcraft/mocks/prisma.mock.service";
import UserDto from "./dto/user.dto";
import { UserService } from "./user.service";
import { ConflictException } from "@nestjs/common";

//create random date for dob
function randomDate(start = new Date(2012, 0, 1), end = new Date()) {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
}

//helper to compare two user
function userEquals(u1: UserDto, u2: UserDto) {
  expect(u1.name).toBe(u2.name);
  expect(u1.email).toBe(u2.email);
  expect(u1.dob).toStrictEqual(u2.dob);
  expect(u1.address).toBe(u2.address);
  expect(u1.description).toBe(u2.description);
}

//helper to create userDto
function createUserDto() {
  const randomStr = crypto.randomUUID();
  return {
    name: randomStr,
    dob: randomDate(),
    email: `${randomStr}@wiredcard.com`,
    address: `${randomStr} address`,
    description: `hi this is ${randomStr}`,
  } as UserDto;
}
describe("UserService", () => {
  const dbName = "user_unit_test";
  let service: UserService;
  let prisma: PrismaService;
  let mongoReplSet;
  beforeAll(async () => {
    mongoReplSet = await createPrismaMockService(dbName);
    await mongoReplSet.waitUntilRunning();
    prisma = new PrismaService({
      datasources: {
        db: {
          url: mongoReplSet.getUri(dbName),
        },
      },
    });
    const module: TestingModule = await Test.createTestingModule({
      imports: [DBAccessModule],
      providers: [UserService],
    })
      .overrideProvider(PrismaService)
      .useValue(prisma)
      .compile();

    service = module.get<UserService>(UserService);
  }, 1000 * 30);
  beforeEach(async () => {
    await prisma.user.deleteMany();
    await prisma.$disconnect();
    await prisma.$connect();
  });
  afterAll(async () => {
    await prisma.$disconnect();
    await mongoReplSet.stop();
  }, 1000 * 30);
  describe("create", () => {
    it("should create user success", async () => {
      const newUser = createUserDto();

      const createdUser = await service.create(newUser);
      expect(createdUser.id).toBeDefined();
      userEquals(newUser, createdUser);
    });
    it("should create user failed, duplicated email address", async () => {
      const newUser = createUserDto();

      const newUser2 = createUserDto();
      newUser2.email = newUser.email;

      await service.create(newUser);
      try {
        await service.create(newUser2);
      } catch (error) {
        expect(error).toBeInstanceOf(ConflictException);
        expect(error.message).toBe("Email address is ready existed");
      }
    });
  });
  describe("update", () => {
    it("should update success", async () => {
      const updatedName = "updated User";
      const createdUser = await service.create(createUserDto());
      createdUser.name = updatedName;
      delete createdUser.createAt;
      delete createdUser.updateAt;

      const updatedUser = await service.update(createdUser.id, createdUser);
      expect(updatedUser.updateAt).not.toStrictEqual(updatedUser.createAt);
      expect(updatedUser.name).toBe("updated User");
    });
    it("should update failed, duplicated email", async () => {
      const createdUser1 = await service.create(createUserDto());
      const createdUser2 = await service.create(createUserDto());
      try {
        //try to update with existed email address should fail
        createdUser2.email = createdUser1.email;
        await service.update(createdUser2.id, createdUser2);
      } catch (error) {
        expect(error).toBeInstanceOf(ConflictException);
        expect(error.message).toBe("Email address is ready existed");
      }
    });
  });
  describe("findAll", () => {
    it("should return empty array", async () => {
      const users = await service.findAll();
      expect(users).toHaveLength(0);
    });

    it("should return 3", async () => {
      const total = 3;
      for (let i = 1; i <= 3; i++) {
        await service.create(createUserDto());
      }
      const users = await service.findAll();
      expect(users).toHaveLength(3);
    });
  });

  describe("delete", () => {
    it("should delete success", async () => {
      const createdUser = await service.create(createUserDto());
      await service.delete(createdUser.id);
      const findUser = await service.findById(createdUser.id);
      expect(findUser).toBeNull();
    });
  });
});
