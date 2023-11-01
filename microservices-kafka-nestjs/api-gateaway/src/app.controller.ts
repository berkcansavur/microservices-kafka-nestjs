import { Body, Controller, Post, Logger, Get } from "@nestjs/common";
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
  CreateEmployeeRegistrationToBankDTO,
  GetCustomersAccountsDTO,
  GetEmployeesCustomerTransactionsDTO,
} from "./dtos/api.dtos";
import { ApiTags } from "@nestjs/swagger";
import { AddCustomerToRepresentativeDTO } from "./dtos/api.dtos";

@Controller()
@ApiTags("App")
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
  @Post("/createEmployeeRegistrationToBank")
  createEmployeeRegistrationToBank(
    @Body()
    createEmployeeRegistrationToBankDTO: CreateEmployeeRegistrationToBankDTO,
  ) {
    const { appService } = this;
    return appService.sendCreateEmployeeRegistrationToBankRequest(
      createEmployeeRegistrationToBankDTO,
    );
  }
  @Post("/addCustomerToRepresentative")
  addCustomerToRepresentative(
    @Body() addCustomerToRepresentativeDTO: AddCustomerToRepresentativeDTO,
  ) {
    const { appService } = this;
    return appService.sendAddCustomerToRepresentativeRequest({
      addCustomerToRepresentativeDTO,
    });
  }
  @Get("/getCustomersAccounts")
  getCustomersAccounts(
    @Body() getCustomersAccountsDTO: GetCustomersAccountsDTO,
  ) {
    const { appService } = this;
    return appService.sendGetCustomersAccountsRequest({
      getCustomersAccountsDTO,
    });
  }
  @Get("/getAccount")
  getAccount(@Body() accountId: string) {
    const { appService } = this;
    return appService.sendGetAccountRequest(accountId);
  }
  @Get("/getAccountsLastActions")
  getAccountsLastActions(@Body() accountId: string, actionCount: number) {
    const { appService } = this;
    return appService.sendGetAccountsLastActionsRequest({
      accountId,
      actionCount,
    });
  }
  @Get("/getAccountsBalance")
  getAccountsBalance(@Body() accountId: string) {
    const { appService } = this;
    return appService.sendGetAccountsBalanceRequest(accountId);
  }
  @Get("/getAccountsBalanceOfCurrencyType")
  getAccountsBalanceOfCurrencyType(
    @Body() accountId: string,
    currencyType: string,
  ) {
    const { appService } = this;
    return appService.sendGetAccountsCurrencyBalanceRequest({
      accountId,
      currencyType,
    });
  }
  @Get("/getEmployeesCustomerRelatedTransactionsRequest")
  getEmployeesCustomerRelatedTransactionsRequest(
    @Body()
    getEmployeesCustomerTransactionsDTO: GetEmployeesCustomerTransactionsDTO,
  ) {
    const { appService } = this;
    return appService.sendGetEmployeesCustomerRelatedTransactionsRequest({
      getEmployeesCustomerTransactionsDTO,
    });
  }
}
