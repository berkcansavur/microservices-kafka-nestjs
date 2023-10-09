import { Module } from "@nestjs/common";
import { AccountsController } from "./accounts.controller";
import { AccountService } from "./accounts.service";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { ConfigModule } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { AutomapperModule } from "@automapper/nestjs";
import { classes } from "@automapper/classes";
import { Account, AccountSchema } from "./schemas/account.schema";
import { AccountsRepository } from "./accounts.repository";

@Module({
  imports: [
    ClientsModule.register([
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
    ]),
    ConfigModule.forRoot({}),
    MongooseModule.forRoot(
      `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.duok4hv.mongodb.net/?retryWrites=true&w=majority`,
    ),
    AccountsModule,
    AutomapperModule.forRoot({
      strategyInitializer: classes(),
    }),
    MongooseModule.forFeature([{ name: Account.name, schema: AccountSchema }]),
  ],
  providers: [AccountService, AccountsRepository],
  controllers: [AccountsController],
})
export class AccountsModule {}
