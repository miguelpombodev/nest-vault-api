import {
  BlobServiceClient,
  ContainerClient,
  ContainerCreateOptions,
  StorageSharedKeyCredential,
} from "@azure/storage-blob";
import { Injectable } from "@nestjs/common";
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

  constructor(private readonly configService: ConfigService) {
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

    return blobClient.url;
  }
}
