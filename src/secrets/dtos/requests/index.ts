import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateSecret {
  constructor(title: string, secret: string, description?: string) {
    this.title = title;
    this.secret = secret;
    this.description = description;
  }
  @ApiProperty()
  @IsNotEmpty({
    message: "Secret value cannot be empty",
  })
  @IsString({
    message: "Secret title must be a string",
  })
  title: string;

  @ApiProperty()
  @IsNotEmpty({
    message: "Secret value cannot be empty",
  })
  @IsString({
    message: "Secret value must be a string",
  })
  secret: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  description?: string;
}
