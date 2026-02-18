import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from "@nestjs/common";
import { UserService } from "../service/user.service";
import { ApiBearerAuth, ApiOkResponse } from "@nestjs/swagger";
import { Response, Request } from "express";
import { UserResponse } from "../dtos/user-response.dto";
import { CreateUserDto } from "../dtos/create-user.dto";
import { JwtAuthGuard } from "src/guards/jwt/jwt.guard";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UserService) {}

  @Get()
  @ApiBearerAuth("access_token")
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ type: UserResponse })
  async getOneUser(
    @Req() request: Request,
    @Res() response: Response,
  ): Promise<Response> {
    const { userId } = request.user!;
    const user = await this.usersService.getOneUserById(userId);

    if (!user) {
      response
        .status(HttpStatus.NOT_FOUND)
        .send({ detail: "User does not exists" });
    }

    return response.status(HttpStatus.OK).send(user);
  }

  @Post()
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
