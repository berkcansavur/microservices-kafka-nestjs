import { Module } from "@nestjs/common";
import { TransferProfile } from "./mapper/transfer-profile";
import { TransfersService } from "./transfers.service";
import { MongooseModule } from "@nestjs/mongoose";
import { Transfer, TransferSchema } from "./schemas/transfer.schema";
import { TransferStateMap } from "./states/transfer-state.map";
import { TransfersRepository } from "./repositories/transfers.repository";
import { TransfersController } from "./transfers.controller";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { ConfigModule } from "@nestjs/config";
import { AutomapperModule } from "@automapper/nestjs";
import { classes } from "@automapper/classes";
import { TransferStateFactory } from "src/factories/transfer-state.factory";

@Module({
  imports: [
    ClientsModule.register([
      {
        name: "BANK_SERVICE",
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: "banks",
            brokers: ["kafka:9092"],
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
            clientId: "bank-accounts",
            brokers: ["kafka:9092"],
          },
          consumer: {
            groupId: "accounts-consumer",
          },
        },
      },
    ]),
    ConfigModule.forRoot({}),
    MongooseModule.forRoot(
      `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.duok4hv.mongodb.net/?retryWrites=true&w=majority`,
    ),
    TransfersModule,
    AutomapperModule.forRoot({
      strategyInitializer: classes(),
    }),
    MongooseModule.forFeature([
      { name: Transfer.name, schema: TransferSchema },
    ]),
  ],
  providers: [
    TransferStateMap,
    TransferProfile,
    TransfersRepository,
    {
      provide: "TRANSFER_STATE_FACTORY",
      useClass: TransferStateFactory,
    },
    TransfersService,
  ],
  controllers: [TransfersController],
})
export class TransfersModule {}
