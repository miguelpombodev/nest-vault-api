import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/services/prisma.service";
import { StorageService } from "src/providers/storage/storage";
import { SaveSecretFileDTO } from "../dtos/responses";

@Injectable()
export class FilesService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly storageService: StorageService,
  ) {}

  async saveFileAsync(
    file: SaveSecretFileDTO,
    userId: string,
  ): Promise<string> {
    const containerClient = await this.storageService.getContainerClient();

    const fileUrl = await this.storageService.uploadInStorage(
      containerClient,
      file,
    );

    const entityId = await this.saveFileDataInDatabase(file, userId, fileUrl);

    return entityId;
  }

  private async saveFileDataInDatabase(
    file: SaveSecretFileDTO,
    userId: string,
    fileUrl: string,
  ): Promise<string> {
    const saveQueryResultEntity = await this.prismaService.secretFile.create({
      data: {
        userId,
        extension: file.Extension,
        url: fileUrl,
        mimeType: file.Mimetype,
        filename: file.Name,
        description: file.Description,
      },
    });

    return saveQueryResultEntity.id;
  }
}
