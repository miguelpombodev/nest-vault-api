import { Module } from "@nestjs/common";
import { UsersController } from "./controllers/users.controller";
import { UserService } from "./service/user.service";
import { FileProviderService } from "src/providers/file-provider/file-provider.service";
import { HashProviderService } from "src/providers/hash-provider/hash.provider.service";

@Module({
  controllers: [UsersController],
  providers: [UserService, FileProviderService, HashProviderService],
})
export class UsersModule {}
