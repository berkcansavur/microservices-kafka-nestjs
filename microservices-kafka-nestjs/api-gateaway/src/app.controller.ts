import { Body, Controller, Post } from "@nestjs/common";
import { AppService } from "./app.service";
import {
  IncomingTransferRequestDTO,
  CreateTransferDTO,
  CreateAccountDTO,
} from "./dtos/api.dtos";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post("/createTransfer")
  createTransfer(@Body() createTransferRequestDTO: CreateTransferDTO) {
    const { appService } = this;
    appService.createMoneyTransferRequest(createTransferRequestDTO);
  }
  @Post("/createAccount")
  createAccount(@Body() createAccountRequestDTO: CreateAccountDTO) {
    const { appService } = this;
    appService.createAccountRequest(createAccountRequestDTO);
  }

  @Post("/approveTransfer")
  approveTransfer(
    @Body() approveTransferRequestDTO: IncomingTransferRequestDTO,
  ) {
    const { appService } = this;
    appService.approveTransfer(approveTransferRequestDTO);
  }
}
