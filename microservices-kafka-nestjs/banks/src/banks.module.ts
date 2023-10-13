import { Module } from "@nestjs/common";
import { BanksService } from "./banks.service";
import { MongooseModule } from "@nestjs/mongoose";
import { Bank, BanksSchema } from "./schemas/banks.schema";
import { User, UserSchema } from "./schemas/customers.schema";
import { BanksRepository } from "./repositories/banks.repository";
import { BanksController } from "./banks.controller";
import { ConfigModule } from "@nestjs/config";
import { AutomapperModule } from "@automapper/nestjs";
import { classes } from "@automapper/classes";
import { ClientsModule, Transport } from "@nestjs/microservices";

@Module({
  imports: [
    ClientsModule.register([
      {
        name: "TRANSFER_SERVICE",
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: "bank-transfers",
            brokers: ["localhost:9092"],
          },
          consumer: {
            groupId: "transfers-consumer",
          },
        },
      },
      {
        name: "ACCOUNT_SERVICE",
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: "bank-accounts",
            brokers: ["localhost:9092"],
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
    BanksModule,
    AutomapperModule.forRoot({
      strategyInitializer: classes(),
    }),
    MongooseModule.forFeature([
      { name: Bank.name, schema: BanksSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],

  providers: [BanksService, BanksRepository],

  controllers: [BanksController],
})
export class BanksModule {}
