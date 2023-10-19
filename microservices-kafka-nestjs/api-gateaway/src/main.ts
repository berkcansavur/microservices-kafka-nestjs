import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configOptions = new DocumentBuilder()
    .setTitle("Bank App API")
    .setDescription("Bank Application CRUD operations API")
    .setVersion("0.1.0")
    .build();
  const documentation = SwaggerModule.createDocument(app, configOptions);
  SwaggerModule.setup("api", app, documentation);
  await app.listen(3000);
}
bootstrap();
