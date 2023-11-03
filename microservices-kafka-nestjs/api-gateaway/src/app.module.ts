import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { EmployeesController } from "./controllers/employees.controller";
import { CustomersController } from "./controllers/customers.controller";
import { AdminController } from "./controllers/admin.controller";
import { JwtModule } from "@nestjs/jwt";

@Module({
  imports: [
    JwtModule.register({}),
    ClientsModule.register([
      {
        name: "BANK_SERVICE",
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: "app-banks",
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
            clientId: "app-accounts",
            brokers: ["kafka:9092"],
          },
          consumer: {
            groupId: "accounts-consumer",
          },
        },
      },
    ]),
  ],
  controllers: [
    AppController,
    EmployeesController,
    CustomersController,
    AdminController,
  ],
  providers: [AppService],
})
export class AppModule {}
