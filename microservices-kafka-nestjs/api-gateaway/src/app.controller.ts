import { Body, Controller, Post, Logger } from "@nestjs/common";
import { AppService } from "./app.service";
import {
  IncomingTransferRequestDTO,
  CreateTransferDTO,
  CreateAccountDTO,
  MoneyTransferDTO,
} from "./dtos/api.dtos";

@Controller()
export class AppController {
  private readonly logger = new Logger(AppController.name);
  constructor(private readonly appService: AppService) {}

  @Post("/createTransfer")
  createTransfer(@Body() createTransferRequestDTO: CreateTransferDTO) {
    const { appService } = this;
    return appService.sendCreateMoneyTransferRequest(createTransferRequestDTO);
  }
  @Post("/createAccount")
  createAccount(@Body() createAccountRequestDTO: CreateAccountDTO) {
    const { appService } = this;
    return appService.sendCreateAccountRequest(createAccountRequestDTO);
  }

  @Post("/approveTransfer")
  approveTransfer(
    @Body() approveTransferRequestDTO: IncomingTransferRequestDTO,
  ) {
    const { appService } = this;
    return appService.sendApproveTransferRequest(approveTransferRequestDTO);
  }
  @Post("/transferMoneyToAccount")
  transferMoneyToAccount(@Body() transferMoneyToAccountDTO: MoneyTransferDTO) {
    const { appService } = this;
    return appService.sendTransferMoneyToAccountRequest(
      transferMoneyToAccountDTO,
    );
  }
}
