import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsEmail } from "class-validator";

export class CreateUserDto {
  constructor(name: string, email: string, password: string) {
    this.name = name;
    this.email = email;
    this.password = password;
  }

  @ApiProperty()
  @IsNotEmpty({
    message: "User name cannot be empty",
  })
  @IsString({
    message: "User name must be a string",
  })
  name: string;

  @ApiProperty()
  @IsNotEmpty({
    message: "User email cannot be empty",
  })
  @IsString({
    message: "User email must be a string",
  })
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsNotEmpty({
    message: "User password cannot be empty",
  })
  @IsString({
    message: "User password must be a string",
  })
  password: string;
}
