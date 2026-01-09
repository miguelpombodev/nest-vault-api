import { Module } from "@nestjs/common";
import { FileProviderService } from "./services/file-provider/file-provider.service";

@Module({
  //   exports: [FileProviderService],
})
export class ProvidersModule {}
