import { Test, TestingModule } from "@nestjs/testing";
import { SecretController } from "./secrets.controller";

describe("SecretController", () => {
  let controller: SecretController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SecretController],
    }).compile();

    controller = module.get<SecretController>(SecretController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
