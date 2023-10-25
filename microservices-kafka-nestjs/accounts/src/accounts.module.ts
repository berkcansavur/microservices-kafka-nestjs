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
import { AccountProfile } from "./mapper/account.profile";
import { AccountStateMap } from "./states/account-state.map";
import { AccountStateFactory } from "./factories/account-state.factory";
import { AccountActionMap } from "./actions/account-action.map";
import { AccountActionFactory } from "./factories/account-action.factory";

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
  providers: [
    AccountService,
    AccountsRepository,
    AccountProfile,
    AccountStateMap,
    {
      provide: "ACCOUNT_STATE_FACTORY",
      useClass: AccountStateFactory,
    },
    AccountActionMap,
    {
      provide: "ACCOUNT_ACTION_FACTORY",
      useClass: AccountActionFactory,
    },
  ],
  controllers: [AccountsController],
})
export class AccountsModule {}
