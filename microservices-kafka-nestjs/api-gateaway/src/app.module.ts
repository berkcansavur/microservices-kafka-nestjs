import { MiddlewareConsumer, Module } from "@nestjs/common";
import { AppController } from "./controllers/app.controller";
import { AppService } from "./app.service";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { EmployeesController } from "./controllers/employees.controller";
import { CustomersController } from "./controllers/customers.controller";
import { AdminController } from "./controllers/admin.controller";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule } from "@nestjs/config";

@Module({
  imports: [
    ConfigModule.forRoot({}),
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
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply((req, res, next) => {
        res.setHeader("Access-Control-Allow-Origin", `http://localhost:4200`);
        res.setHeader("Access-Control-Allow-Credentials", "true");
        res.setHeader(
          "Access-Control-Allow-Headers",
          "Origin, X-Requested-With, Content-Type, Accept",
        );
        next();
      })
      .forRoutes("*");
  }
}
