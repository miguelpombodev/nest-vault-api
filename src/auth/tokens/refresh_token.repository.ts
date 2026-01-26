import { Inject } from "@nestjs/common";
import Redis from "ioredis";
import { HashProviderService } from "src/providers/hash-provider/hash.provider.service";

export class RefreshTokenRepository {
  constructor(
    private readonly hashService: HashProviderService,
    @Inject("REDIS_CLIENT") private readonly redis: Redis,
  ) {}

  async save(email: string, token: string, ttlSeconds: number) {
    const hashedToken = await this.hashService.hash(token);

    await this.redis.set(
      `refresh_token:${email}`,
      hashedToken,
      "EX",
      ttlSeconds,
    );
  }

  async validate(email: string, token: string): Promise<boolean> {
    const stored = await this.redis.get(`refresh_token:${email}`);

    if (!stored) return false;

    return this.hashService.compare(token, stored);
  }

  async revoke(userId: string): Promise<void> {
    await this.redis.del(`refresh_token:${userId}`);
  }
}
