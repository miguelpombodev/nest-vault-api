import "dotenv";
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { Observable } from "rxjs";

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    const apiKey = request.headers["x-vault-key"];

    if (!apiKey || apiKey !== process.env.API_KEY) {
      throw new UnauthorizedException("Invalid or missing API key");
    }

    return true;
  }
}
