import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  HttpStatus,
  Param,
  Post,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiConsumes } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/guards/jwt/jwt.guard";
import { FilesService } from "../service/files.service";
import { Request, Response } from "express";
import { FileInterceptor } from "@nestjs/platform-express";
import { SaveSecretFileDTO } from "../dtos/responses";
import { UploadData } from "../dtos";

@Controller("files")
@UseGuards(JwtAuthGuard)
@ApiBearerAuth("access_token")
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post("save")
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    schema: {
      type: "object",
      required: ["file"],
      properties: {
        file: {
          type: "string",
          format: "binary",
        },
        description: {
          type: "string",
          example: "Meu IR de 2024",
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor("file"))
  async saveOneFileAsync(
    @Req() request: Request,
    @UploadedFile() uploadedFile: UploadData,
    @Res() response: Response,
    @Body("description") description?: string,
  ) {
    if (!uploadedFile) {
      throw new BadRequestException("File is required");
    }

    const { userId } = request.user!;

    const file = new SaveSecretFileDTO(
      uploadedFile.originalname,
      uploadedFile.mimetype,
      uploadedFile.buffer,
      userId,
      description ?? null,
    );

    await this.filesService.saveFileAsync(file, userId);

    return response.status(HttpStatus.CREATED).send();
  }

  @Delete("delete/{:fileId}")
  async deleteOneSecretFileAsync(
    @Res() response: Response,
    @Param("fileId") fileId: string,
  ) {
    const tryToDeleteFileFromStorage =
      await this.filesService.deleteOneFileAsync(fileId);

    if (!tryToDeleteFileFromStorage) {
      return response.status(HttpStatus.CONFLICT).send({
        detail: "Something went wrong trying to delete the requested file",
      });
    }

    return response.send({ detail: "File deleted successfully" });
  }
}
