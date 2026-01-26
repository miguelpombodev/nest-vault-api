import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/services/prisma.service";
import { SecretResponse } from "../dtos/get-secret.dto";

@Injectable()
export class SecretService {
  constructor(private readonly prismaService: PrismaService) {}

  async getSecrets(userId: string): Promise<SecretResponse[]> {
    const getUserSecretsQueryResult = await this.prismaService.secret.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const secrets = getUserSecretsQueryResult.map(
      (row) =>
        new SecretResponse(row.id, row.title, row.value, row.description),
    );

    return secrets;
  }

  async saveSecret(
    title: string,
    secret: string,
    userId: string,
  ): Promise<string> {
    const result = await this.prismaService.secret.create({
      data: {
        title,
        value: secret,
        userId,
      },
    });

    return result.id;
  }
}
