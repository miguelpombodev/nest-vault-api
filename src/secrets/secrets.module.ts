import { Module } from "@nestjs/common";
import { SecretController } from "src/secrets/controllers/secrets.controller";
import { SecretService } from "./services/secrets.service";

@Module({
  controllers: [SecretController],
  providers: [SecretService],
  exports: [SecretService],
})
export class SecretModule {}
