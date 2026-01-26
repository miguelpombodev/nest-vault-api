import { Injectable } from "@nestjs/common";
import { compare, hash } from "bcrypt";

@Injectable()
export class HashProviderService {
  salt = 10;

  async hash(valuetoBeHashed: string): Promise<string> {
    const hashedString = await hash(valuetoBeHashed, this.salt);

    return hashedString;
  }

  async compare(rawValue: string, hashedValue: string): Promise<boolean> {
    const isMatch = await compare(rawValue, hashedValue);

    return isMatch;
  }
}
