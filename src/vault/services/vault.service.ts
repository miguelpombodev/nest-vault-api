import { Injectable } from "@nestjs/common";
import type { Secret } from "@prisma/client";
import { PrismaService } from "src/prisma/services/prisma.service";
// import path from 'path';
// import * as fs from 'fs/promises';

@Injectable()
export class VaultService {
  constructor(private readonly prismaService: PrismaService) {}

  async getSecrets(): Promise<Secret[]> {
    const secrets = await this.prismaService.secret.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return secrets;
  }

  async saveSecret(title: string, secret: string): Promise<string> {
    const result = await this.prismaService.secret.create({
      data: {
        title,
        value: secret,
      },
    });

    return result.id;
  }
}
