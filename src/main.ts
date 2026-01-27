import { config } from "dotenv";
config();

import { Logger, ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AppModule } from "./app.module";
import { WINSTON_MODULE_NEST_PROVIDER } from "nest-winston";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
  const logger = app.get(Logger);

  // Set API prefix
  app.setGlobalPrefix("api/v1");

  /*
    Global Pipes: Activate DTO automatic validation using class-validator
    'whitelist: true': remove properies that are not in DTO
    'transform: true': automatically convert types, ex: string to number
   */
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Setting automatic Swagger API documentation
  const config = new DocumentBuilder()
    .setTitle("Nexus Vault API")
    .setDescription("Digital Vault system for secrets and attachments")
    .setVersion("1.0")
    .addTag("Vault")
    .addBearerAuth(
      {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        name: "JWT",
        in: "header",
      },
      "access_token",
    )
    .build();

  const swaggerDocument = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("docs", app, swaggerDocument);

  const port = process.env.PORT || 3000;
  await app.listen(port);

  logger.log(
    "info",
    `Application is running on: http://localhost:${port}/api/v1`,
  );
  logger.log("info", `Swagger documentation: http://localhost:${port}/docs`);
}

bootstrap().catch((err) => {
  console.error(err);
  process.exit(1);
});
