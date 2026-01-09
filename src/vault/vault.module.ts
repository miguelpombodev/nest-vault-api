import { Module } from "@nestjs/common";
import { VaultController } from "src/vault/controllers/vault.controller";
import { VaultService } from "./services/vault.service";

@Module({
  controllers: [VaultController],
  providers: [VaultService],
  exports: [VaultService],
})
export class VaultModule {}
