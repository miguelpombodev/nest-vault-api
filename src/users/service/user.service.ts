import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/services/prisma.service";
import { UserResponse } from "../dtos/user-response.dto";
import { CreateUserDto } from "../dtos/create-user.dto";
import { HashProviderService } from "src/providers/hash-provider/hash.provider.service";
import { User } from "@prisma/client";

@Injectable()
export class UserService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly hashService: HashProviderService,
  ) {}

  async getOneUserById(id: string): Promise<UserResponse | null> {
    const result = await this.prismaService.user.findUnique({
      where: {
        id,
      },
      include: {
        secrets: true,
        files: {
          where: {
            isHidden: false,
          },
          select: {
            filename: true,
            url: true,
            extension: true,
            mimeType: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    if (!result) {
      return null;
    }

    const user = new UserResponse(
      result.id,
      result.name,
      result.email,
      result.secrets,
      result.files,
    );

    return user;
  }

  async getOneUserByEmail(email: string): Promise<User | null> {
    const result = await this.prismaService.user.findUnique({
      where: {
        email,
      },
      include: {
        secrets: true,
        files: {
          where: {
            isHidden: false,
          },
          select: {
            filename: true,
            url: true,
            extension: true,
            mimeType: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    if (!result) {
      return null;
    }

    return result;
  }

  async saveOneUser(user: CreateUserDto): Promise<string> {
    const hashedUserPassword = await this.hashService.hash(user.password);

    const result = await this.prismaService.user.create({
      data: {
        name: user.name,
        email: user.email,
        password: hashedUserPassword,
      },
    });

    return result.id;
  }
}
