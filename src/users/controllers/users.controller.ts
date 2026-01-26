import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Res,
  UseGuards,
} from "@nestjs/common";
import { UserService } from "../service/user.service";
import { ApiOkResponse, ApiParam } from "@nestjs/swagger";
import { Response } from "express";
import { UserResponse } from "../dtos/user-response.dto";
import { CreateUserDto } from "../dtos/create-user.dto";
import { JwtAuthGuard } from "src/guards/jwt/jwt.guard";

@Controller("users")
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UserService) {}

  @Get(":id")
  @ApiOkResponse({ type: UserResponse })
  @ApiParam({
    name: "id",
    description: "The ID of the user",
    type: String,
    required: true,
  })
  async getOneUser(
    @Res() response: Response,
    @Param("id") id: string,
  ): Promise<Response> {
    const user = await this.usersService.getOneUserById(id);

    if (!user) {
      response
        .status(HttpStatus.NOT_FOUND)
        .send({ detail: "User does not exists" });
    }

    return response.status(HttpStatus.OK).send(user);
  }

  @Post(":id")
  @ApiOkResponse()
  async saveUser(@Res() response: Response, @Body() body: CreateUserDto) {
    const checkUser = await this.usersService.getOneUserByEmail(body.email);

    if (checkUser) {
      return response
        .status(HttpStatus.CONFLICT)
        .send({ detail: "User already exists" });
    }

    await this.usersService.saveOneUser(body);

    return response.status(HttpStatus.CREATED).send();
  }
}
