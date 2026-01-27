import { Logger, Module } from "@nestjs/common";
import { FilesController } from "./controller/files.controller";
import { FilesService } from "./service/files.service";
import { StorageService } from "src/providers/storage/storage";

@Module({
  controllers: [FilesController],
  exports: [FilesService],
  providers: [FilesService, StorageService, Logger],
})
export class FilesModule {}
