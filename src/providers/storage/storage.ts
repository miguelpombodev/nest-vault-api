import {
  BlobServiceClient,
  ContainerClient,
  ContainerCreateOptions,
  StorageSharedKeyCredential,
} from "@azure/storage-blob";
import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { SaveSecretFileDTO } from "src/files/dtos/responses";

@Injectable()
export class StorageService {
  private readonly blobContainersName = "files";
  private readonly blobServiceClient: BlobServiceClient;
  private readonly blobMaxRetriesOption = 5;
  private readonly blobCacheControl = "public, max-age=31536000";
  private readonly blobContainerCreationOptions: ContainerCreateOptions = {
    access: "container",
  };

  constructor(
    private readonly configService: ConfigService,
    private readonly logger: Logger,
  ) {
    const account = this.configService.get<string>("AZURE_STORAGE_ACCOUNT")!;
    const accountKey = this.configService.get<string>("AZURE_STORAGE_KEY")!;
    const endpoint = this.configService.get<string>(
      "AZURE_STORAGE_BLOB_ENDPOINT",
    )!;

    const credential = new StorageSharedKeyCredential(account, accountKey);

    this.blobServiceClient = new BlobServiceClient(endpoint, credential, {
      retryOptions: {
        maxTries: 3,
      },
    });
  }

  async getContainerClient(): Promise<ContainerClient> {
    const client = this.blobServiceClient.getContainerClient(
      this.blobContainersName,
    );

    await client.createIfNotExists(this.blobContainerCreationOptions);

    return client;
  }

  async uploadInStorage(
    client: ContainerClient,
    file: SaveSecretFileDTO,
  ): Promise<string> {
    const blobClient = client.getBlockBlobClient(file.Name);

    await blobClient.uploadData(file.Buffer, {
      blobHTTPHeaders: {
        blobContentType: file.Mimetype,
        blobCacheControl: this.blobCacheControl,
      },
    });

    this.logger.log(
      `A file called ${file.Name} was uploaded in a container called ${blobClient.containerName}`,
      StorageService.name,
    );

    return blobClient.url;
  }

  async deleteInStorage(
    client: ContainerClient,
    fileName: string,
  ): Promise<number | null> {
    const file = client.getBlobClient(fileName);

    if (!file) {
      this.logger.error(
        `There was a attempt to delete a file called ${fileName}, however it was not founded.`,
        StorageService.name,
      );
      return null;
    }

    const deleteFromStorageResult = await file.delete({
      deleteSnapshots: "include",
    });

    this.logger.log(
      `A file called ${fileName} was deleted from container called ${file.containerName}`,
      StorageService.name,
    );

    return deleteFromStorageResult._response.status;
  }
}
