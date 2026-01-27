import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  UseGuards,
  Req,
} from "@nestjs/common";
import { SecretService } from "../services/secrets.service";
import { CreateSecret } from "../dtos";
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
} from "@nestjs/swagger";
import { JwtAuthGuard } from "src/guards/jwt/jwt.guard";
import { Request } from "express";

@Controller("secrets")
@UseGuards(JwtAuthGuard)
@ApiBearerAuth("access_token")
export class SecretController {
  constructor(private readonly SecretService: SecretService) {}

  @Get()
  @ApiOkResponse()
  @HttpCode(200)
  async listSecrets(@Req() request: Request) {
    const { userId } = request.user!;
    return this.SecretService.getSecrets(userId);
  }

  @Post("save")
  @ApiCreatedResponse()
  @HttpCode(201)
  async createSecret(@Req() request: Request, @Body() body: CreateSecret) {
    const { userId } = request.user!;
    return this.SecretService.saveSecret(body.title, body.secret, userId);
  }
}
