import { Injectable, UnauthorizedException } from "@nestjs/common";
import { HashProviderService } from "src/providers/hash-provider/hash.provider.service";
import { TokenProviderService } from "src/providers/token-provider/token.provider.service";
import { User } from "@prisma/client";
import { TokenResult } from "src/providers/token-provider/token_result.interface";
import { RefreshTokenRepository } from "../tokens/refresh_token.repository";

@Injectable()
export class AuthService {
  private readonly refreshTtlForSevenDays = 7 * 24 * 60 * 60;
  constructor(
    private readonly hashService: HashProviderService,
    private readonly tokenProvider: TokenProviderService,
    private readonly refreshTokenRepository: RefreshTokenRepository,
  ) {}

  async loginOneUserAsync(
    bodyPassword: string,
    user: User,
  ): Promise<TokenResult | null> {
    const isPasswordsMatching = await this.hashService.compare(
      bodyPassword,
      user.password,
    );

    if (!isPasswordsMatching) {
      return null;
    }

    const payload = this.tokenProvider.buildTokenPayload(user);
    const accessToken = await this.tokenProvider.generateAccessToken(payload);
    const refreshToken = await this.tokenProvider.generateRefreshToken(payload);

    await this.refreshTokenRepository.save(
      user.id,
      refreshToken,
      this.refreshTtlForSevenDays,
    );

    return {
      accessToken,
      refreshToken,
    };
  }

  async refresh(refreshToken: string) {
    const tokenPayload = await this.tokenProvider.verifyToken(
      refreshToken,
      "refresh",
    );

    const isValid = await this.refreshTokenRepository.validate(
      tokenPayload.email,
      refreshToken,
    );

    if (!isValid) {
      throw new UnauthorizedException("Invalid refresh token");
    }

    await this.refreshTokenRepository.revoke(tokenPayload.sub);

    const newAccessToken =
      await this.tokenProvider.generateAccessToken(tokenPayload);
    const newRefreshToken =
      await this.tokenProvider.generateRefreshToken(tokenPayload);

    await this.refreshTokenRepository.save(
      tokenPayload.sub,
      newRefreshToken,
      this.refreshTtlForSevenDays,
    );

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }
}
