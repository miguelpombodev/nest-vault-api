import { Module } from "@nestjs/common";
import { AuthController } from "./controller/auth.controller";
import { AuthService } from "./services/auth.service";
import { HashProviderService } from "src/providers/hash-provider/hash.provider.service";
import { UserService } from "src/users/service/user.service";
import { TokenProviderService } from "src/providers/token-provider/token.provider.service";
import { JwtModule } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { RefreshTokenRepository } from "./tokens/refresh_token.repository";
import { JwtStrategy } from "src/strategies/jwt/jwt.strategy";

@Module({
  imports: [
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>("JWT_SECRET"),
        signOptions: { expiresIn: "60s" },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    HashProviderService,
    UserService,
    TokenProviderService,
    RefreshTokenRepository,
    JwtStrategy,
  ],
})
export class AuthModule {}
