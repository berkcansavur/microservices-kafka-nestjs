import { NestFactory } from "@nestjs/core";
import { MicroserviceOptions, Transport } from "@nestjs/microservices";
import { TransfersModule } from "./transfers.module";

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    TransfersModule,
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          brokers: ["kafka:9092"],
        },
        consumer: {
          groupId: "transfers-consumer",
        },
      },
    },
  );
  app.listen();
}
bootstrap();
