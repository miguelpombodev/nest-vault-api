import { Injectable } from "@nestjs/common";
import { TokenPayload } from "./token_payload.interface";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { User } from "@prisma/client";

@Injectable()
export class TokenProviderService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  buildTokenPayload(user: User) {
    return {
      sub: user.id,
      email: user.email,
    };
  }

  async generateAccessToken(payload: TokenPayload): Promise<string> {
    return await this.jwtService.signAsync<TokenPayload>(payload, {
      secret: this.configService.get("JWT_ACCESS_SECRET"),
      expiresIn: this.configService.get("JWT_ACCESS_EXPIRES_IN", "15m"),
    });
  }

  async generateRefreshToken(payload: TokenPayload): Promise<string> {
    return await this.jwtService.signAsync<TokenPayload>(payload, {
      secret: this.configService.get("JWT_REFRESH_SECRET"),
      expiresIn: this.configService.get("JWT_REFRESH_EXPIRES_IN", "7D"),
    });
  }

  async verifyToken(
    token: string,
    tokenType: "access" | "refresh",
  ): Promise<TokenPayload> {
    const payload = await this.jwtService.verifyAsync<TokenPayload>(token, {
      secret:
        tokenType === "access"
          ? this.configService.get("JWT_ACCESS_SECRET")
          : this.configService.get("JWT_REFRESH_SECRET"),
    });

    return payload;
  }
}
