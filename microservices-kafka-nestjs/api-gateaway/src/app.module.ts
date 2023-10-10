import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ClientsModule, Transport } from "@nestjs/microservices";

@Module({
  imports: [
    ClientsModule.register([
      {
        name: "TRANSFER_SERVICE",
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: "transfers",
            brokers: ["localhost:9092"],
          },
          consumer: {
            groupId: "transfers-consumer",
          },
        },
      },
      {
        name: "BANK_SERVICE",
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: "banks",
            brokers: ["localhost:9092"],
          },
          consumer: {
            groupId: "banks-consumer",
          },
        },
      },
      {
        name: "ACCOUNT_SERVICE",
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: "accounts",
            brokers: ["localhost:9092"],
          },
          consumer: {
            groupId: "accounts-consumer",
          },
        },
      },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
