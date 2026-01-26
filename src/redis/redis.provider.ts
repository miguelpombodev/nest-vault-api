import { Provider } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import Redis from "ioredis";

export const RedisProvider: Provider = {
  provide: "REDIS_CLIENT",
  inject: [ConfigService],
  useFactory: (config: ConfigService) => {
    return new Redis({
      host: config.get("REDIS_HOST"),
      port: config.get<number>("REDIS_PORT"),
      password: config.get("REDIS_PASSWORD"),
    });
  },
};
