import { Test, TestingModule } from "@nestjs/testing";
import { UserService } from "./user.service";
import { DBAccessModule } from "../dbaccess/dbaccess.module";

describe("UserService", () => {
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DBAccessModule],
      providers: [UserService],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
