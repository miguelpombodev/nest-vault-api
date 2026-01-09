import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { VaultModule } from "./vault/vault.module";
import { FileProviderService } from "./providers/services/file-provider/file-provider.service";
import { ConfigModule } from "@nestjs/config";
import { PrismaModule } from "./prisma/prisma.module";
import { ProvidersModule } from "./providers/providers.module";
import { LoggerMiddleware } from "./common/middlewares/logger/logger.middleware";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    VaultModule,
    PrismaModule,
    ProvidersModule,
  ],
  controllers: [],
  providers: [FileProviderService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(LoggerMiddleware).forRoutes("*");
  }
}
