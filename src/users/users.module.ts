import { Module } from "@nestjs/common";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { DBAccessModule } from "@wiredcraft/dbaccess/dbaccess.module";

@Module({
  imports: [DBAccessModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UsersModule {}
