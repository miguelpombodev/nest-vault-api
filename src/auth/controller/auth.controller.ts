import { Body, Controller, HttpStatus, Post, Res } from "@nestjs/common";
import { ApiOkResponse } from "@nestjs/swagger";
import { Response } from "express";
import { LoginUser } from "../dtos/login-user";
import { AuthService } from "../services/auth.service";
import { UserService } from "src/users/service/user.service";

@Controller("auth")
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Post("login")
  @ApiOkResponse()
  async login(@Res() response: Response, @Body() body: LoginUser) {
    const checkUserIfExists = await this.userService.getOneUserByEmail(
      body.email,
    );

    if (!checkUserIfExists) {
      return response.status(HttpStatus.UNAUTHORIZED).send({
        detail: "User email or password are not registered, please check!",
      });
    }

    const loggedUserResult = await this.authService.loginOneUserAsync(
      body.password,
      checkUserIfExists,
    );

    if (!loggedUserResult) {
      return response.status(HttpStatus.UNAUTHORIZED).send({
        detail: "User email or password are not registered, please check!",
      });
    }

    return response.status(HttpStatus.OK).send(loggedUserResult);
  }
}
