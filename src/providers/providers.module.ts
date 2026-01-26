import { Module } from "@nestjs/common";
import { FileProviderService } from "./file-provider/file-provider.service";
import { HashProviderService } from "./hash-provider/hash.provider.service";
import { TokenProviderService } from "./token-provider/token.provider.service";
import { JwtService } from "@nestjs/jwt";

@Module({
  providers: [
    FileProviderService,
    HashProviderService,
    TokenProviderService,
    JwtService,
  ],
  exports: [FileProviderService, HashProviderService, TokenProviderService],
})
export class ProvidersModule {}
