import { Module } from "@nestjs/common";
import { BanksService } from "./services/banks.service";
import { MongooseModule } from "@nestjs/mongoose";
import { Bank, BanksSchema } from "./schemas/banks.schema";
import { Customer, CustomerSchema } from "./schemas/customers.schema";
import { BanksRepository } from "./repositories/banks.repository";
import { BanksController } from "./controllers/banks.controller";
import { EmployeesController } from "./controllers/employees.controller";
import { CustomersController } from "./controllers/customers.controller";
import { ConfigModule } from "@nestjs/config";
import { AutomapperModule } from "@automapper/nestjs";
import { classes } from "@automapper/classes";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { CustomerAuth, CustomerAuthSchema } from "./schemas/auth.schema";
import {
  BankCustomerRepresentativeSchema,
  BankDirector,
  BankDirectorSchema,
  BankCustomerRepresentative,
  BankDepartmentDirector,
  BankDepartmentDirectorSchema,
} from "./schemas/employee-schema";
import { CustomersService } from "./services/customers.service";
import { CustomersRepository } from "./repositories/customer.repository";
import { EmployeeModelMap } from "./employee-models/employee-model.map";
import { EmployeeModelFactory } from "src/factories/employee-model.factory";
import { EmployeesService } from "./services/employees.service";
import { EmployeesRepository } from "./repositories/employees.repository";
import { BankProfile } from "./mapper/bank-profile";
import { AuthService } from "./services/auth.service";
import { AuthProfile } from "./mapper/auth-profile";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { LocalStrategy } from "./auth/local-strategy";
import { JwtStrategy } from "./auth/jwt-strategy";
import { SessionSerializer } from "./auth/session-serializer";
import { JWT_SECRET } from "./constants/banks.constants";

@Module({
  imports: [
    PassportModule.register({ session: true }),
    JwtModule.register({
      secret: JWT_SECRET,
      signOptions: { expiresIn: "3600s" },
    }),
    ClientsModule.register([
      {
        name: "TRANSFER_SERVICE",
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: "bank-transfers",
            brokers: ["kafka:9092"],
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
    BanksModule,
    AutomapperModule.forRoot({
      strategyInitializer: classes(),
    }),
    MongooseModule.forFeature([
      { name: Bank.name, schema: BanksSchema },
      { name: Customer.name, schema: CustomerSchema },
      { name: CustomerAuth.name, schema: CustomerAuthSchema },
      { name: BankDirector.name, schema: BankDirectorSchema },
      {
        name: BankDepartmentDirector.name,
        schema: BankDepartmentDirectorSchema,
      },
      {
        name: BankCustomerRepresentative.name,
        schema: BankCustomerRepresentativeSchema,
      },
    ]),
  ],

  providers: [
    BanksService,
    AuthService,
    EmployeesService,
    CustomersService,
    LocalStrategy,
    JwtStrategy,
    SessionSerializer,
    BanksRepository,
    EmployeesRepository,
    CustomersRepository,
    EmployeeModelMap,
    {
      provide: "EMPLOYEE_MODEL_FACTORY",
      useClass: EmployeeModelFactory,
    },
    AuthProfile,
    BankProfile,
  ],

  controllers: [BanksController, EmployeesController, CustomersController],
})
export class BanksModule {}
