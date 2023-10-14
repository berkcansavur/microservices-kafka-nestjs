import { Body, Controller, Post, Logger } from "@nestjs/common";
import { AppService } from "./app.service";
import {
  IncomingTransferRequestDTO,
  CreateTransferDTO,
  CreateAccountDTO,
  MoneyTransferDTO,
  CreateCustomerDTO,
  CreateBankDTO,
  CreateDirectorDTO,
  CreateCustomerRepresentativeDTO,
  CreateDepartmentDirectorDTO,
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
  @Post("/createCustomer")
  createCustomer(@Body() createCustomerRequestDTO: CreateCustomerDTO) {
    const { appService } = this;
    return appService.sendCreateCustomerRequest(createCustomerRequestDTO);
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
  @Post("/createBank")
  createBank(@Body() createBankDTO: CreateBankDTO) {
    const { appService } = this;
    return appService.sendCreateBankRequest(createBankDTO);
  }
  @Post("/createBankDirector")
  createDirector(@Body() createDirectorDTO: CreateDirectorDTO) {
    const { appService } = this;
    return appService.sendCreateDirectorRequest(createDirectorDTO);
  }
  @Post("/createBankDepartmentDirector")
  createBankDepartmentDirector(
    @Body() createDepartmentDirectorDTO: CreateDepartmentDirectorDTO,
  ) {
    const { appService } = this;
    return appService.sendCreateDepartmentDirectorRequest(
      createDepartmentDirectorDTO,
    );
  }
  @Post("/createBankCustomerRepresentative")
  createCustomerRepresentative(
    @Body() createCustomerRepresentativeDTO: CreateCustomerRepresentativeDTO,
  ) {
    const { appService } = this;
    return appService.sendCreateCustomerRepresentativeRequest(
      createCustomerRepresentativeDTO,
    );
  }
}
