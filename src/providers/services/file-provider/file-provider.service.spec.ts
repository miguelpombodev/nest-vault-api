import { Test, TestingModule } from "@nestjs/testing";
import { FileProviderService } from "./file-provider.service";

describe("FileProviderService", () => {
  let service: FileProviderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FileProviderService],
    }).compile();

    service = module.get<FileProviderService>(FileProviderService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
