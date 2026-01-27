import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "src/prisma/services/prisma.service";
import { StorageService } from "src/providers/storage/storage";
import { SaveSecretFileDTO } from "../dtos/responses";
import { SecretFile } from "@prisma/client";

@Injectable()
export class FilesService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly storageService: StorageService,
    private readonly logger: Logger,
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
    this.logger.log(
      `File ${file.Name} from user ${userId} has been upload in storage`,
      FilesService.name,
    );

    const entityId = await this.saveFileDataInDatabase(file, userId, fileUrl);

    this.logger.log(
      `File ${file.Name} from user ${userId} has been registered in database`,
      FilesService.name,
    );

    return entityId;
  }

  async deleteOneFileAsync(fileId: string): Promise<string | null> {
    const getFileDataResult = await this.getOneFileDataByIdInDatabase(fileId);

    if (!getFileDataResult) {
      return null;
    }

    const containerClient = await this.storageService.getContainerClient();
    await this.storageService.deleteInStorage(
      containerClient,
      getFileDataResult.filename,
    );

    await this.deleteOneFileByIdFromDatabase(fileId);

    return "success";
  }

  private async getOneFileDataByIdInDatabase(
    fileId: string,
  ): Promise<SecretFile | null> {
    const file = this.prismaService.secretFile.findFirst({
      where: {
        id: fileId,
      },
    });

    return file;
  }

  private async deleteOneFileByIdFromDatabase(fileId: string): Promise<void> {
    await this.prismaService.secretFile.delete({
      where: {
        id: fileId,
      },
    });

    this.logger.log(
      `File with Id ${fileId} has been deleted from database`,
      FilesService.name,
    );
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
