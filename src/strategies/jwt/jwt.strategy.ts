/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import { Injectable } from "@nestjs/common";
import { ExtractJwt, JwtFromRequestFunction, Strategy } from "passport-jwt";
import { ConfigService } from "@nestjs/config";
import {
  RequestTokenInformation,
  TokenPayload,
} from "src/providers/token-provider/token_payload.interface";
import { PassportStrategy } from "@nestjs/passport";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest:
        ExtractJwt.fromAuthHeaderAsBearerToken() as JwtFromRequestFunction,
      ignoreExpiration: false,
      secretOrKey: configService.get<string>("JWT_ACCESS_SECRET") as string,
    });
  }

  validate(payload: TokenPayload): RequestTokenInformation {
    return {
      userId: payload.sub,
      email: payload.email,
    };
  }
}
