import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  UseGuards,
} from "@nestjs/common";
import { AuthGuard } from "src/common/guards/auth/auth.guard";
import { VaultService } from "../services/vault.service";
import { CreateSecret } from "../dtos/secrets";
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiSecurity,
} from "@nestjs/swagger";

@Controller("vault")
@ApiSecurity("x-vault-key")
@UseGuards(AuthGuard)
export class VaultController {
  constructor(private readonly vaultService: VaultService) {}

  @Get("secrets")
  @ApiOkResponse()
  @HttpCode(200)
  async listSecrets() {
    return this.vaultService.getSecrets();
  }

  @Post("secrets")
  @ApiCreatedResponse()
  @HttpCode(201)
  async createSecret(@Body() body: CreateSecret) {
    return this.vaultService.saveSecret(body.title, body.secret);
  }

  //   @Post('upload')
  //   async uploadAttachment(@Body() body: { name: string; content: string }) {
  //     // Simulando um arquivo vindo de uma string Base64 ou texto
  //     const buffer = Buffer.from(body.content, 'utf-8');
  //     return await this.vaultService.saveFile(body.name, buffer);
  //   }
}
