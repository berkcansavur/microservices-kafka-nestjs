import { Body, Controller, Inject, Post, Logger } from "@nestjs/common";
import { AppService } from "./app.service";
import {
  IncomingTransferRequestDTO,
  CreateTransferDTO,
  CreateAccountDTO,
} from "./dtos/api.dtos";
import { ClientKafka } from "@nestjs/microservices";

@Controller()
export class AppController {
  private readonly logger = new Logger(AppController.name);
  constructor(
    private readonly appService: AppService,
    @Inject("ACCOUNT_SERVICE") private readonly accountClient: ClientKafka,
  ) {}

  @Post("/createTransfer")
  createTransfer(@Body() createTransferRequestDTO: CreateTransferDTO) {
    const { appService } = this;
    appService.createMoneyTransferRequest(createTransferRequestDTO);
  }
  @Post("/createAccount")
  createAccount(@Body() createAccountRequestDTO: CreateAccountDTO) {
    const { appService } = this;
    return appService.createAccountRequest(createAccountRequestDTO);
  }

  @Post("/approveTransfer")
  approveTransfer(
    @Body() approveTransferRequestDTO: IncomingTransferRequestDTO,
  ) {
    const { appService } = this;
    return appService.approveTransfer(approveTransferRequestDTO);
  }
}
