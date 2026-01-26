import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { SecretModule } from "./secrets/secrets.module";
import { ConfigModule } from "@nestjs/config";
import { PrismaModule } from "./prisma/prisma.module";
import { ProvidersModule } from "./providers/providers.module";
import { LoggerMiddleware } from "./common/middlewares/logger/logger.middleware";
import { UsersModule } from "./users/users.module";
import { AuthModule } from "./auth/auth.module";
import { RedisModule } from "./redis/redis.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env",
    }),
    SecretModule,
    PrismaModule,
    ProvidersModule,
    UsersModule,
    AuthModule,
    RedisModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(LoggerMiddleware).forRoutes("path");
  }
}
