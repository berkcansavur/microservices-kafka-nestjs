import { NestFactory } from "@nestjs/core";
import { AccountsModule } from "./accounts.module";
import { MicroserviceOptions, Transport } from "@nestjs/microservices";

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AccountsModule,
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          brokers: ["kafka:9092"],
        },
        consumer: {
          groupId: "accounts-consumer",
        },
      },
    },
  );
  app.listen();
}
bootstrap();
