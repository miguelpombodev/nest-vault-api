import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { SecretModule } from "./secrets/secrets.module";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { PrismaModule } from "./prisma/prisma.module";
import { ProvidersModule } from "./providers/providers.module";
import { LoggerMiddleware } from "./common/middlewares/logger/logger.middleware";
import { UsersModule } from "./users/users.module";
import { AuthModule } from "./auth/auth.module";
import { RedisModule } from "./redis/redis.module";
import { FilesModule } from "./files/files.module";
import { WinstonModule } from "nest-winston";
import { format } from "winston";
import * as winston from "winston";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env",
    }),
    /*
      Once we configure Winston as main logger, we can inject the built-in
      NestJS Logger class into our services and controllers, that Winstow will
      be used under the hood.
    */
    WinstonModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        transports: [
          new winston.transports.Console({
            level: configService.get<string>("LOG_LEVEL", "info"),
            format: format.combine(
              format.timestamp(),
              format.colorize(),
              format.simple(),
            ),
          }),
        ],
      }),
      inject: [ConfigService],
    }),
    SecretModule,
    PrismaModule,
    ProvidersModule,
    UsersModule,
    AuthModule,
    RedisModule,
    FilesModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(LoggerMiddleware).forRoutes("path");
  }
}
