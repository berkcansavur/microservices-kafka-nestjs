import {
  Body,
  Controller,
  Post,
  Logger,
  Get,
  UseGuards,
  Param,
} from "@nestjs/common";
import { AppService } from "../app.service";
import {
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
  GetTransferDTO,
  LoginUserDTO,
  DeleteTransferDTO,
  GetAccountsLastActionsDTO,
  AccountIdDTO,
} from "../dtos/api.dtos";
import { ApiTags } from "@nestjs/swagger";
import { AddCustomerToRepresentativeDTO } from "../dtos/api.dtos";
import { AuthGuard } from "../guards/auth.guard";

@Controller()
@ApiTags("App")
export class AppController {
  private readonly logger = new Logger(AppController.name);
  constructor(private readonly appService: AppService) {}

  @Post("/loginCustomer")
  loginCustomer(@Body() loginUserDTO: LoginUserDTO) {
    const { appService } = this;
    return appService.sendLoginCustomerRequest(loginUserDTO);
  }
  @Post("/loginEmployee")
  loginEmployee(@Body() loginUserDTO: LoginUserDTO) {
    const { appService } = this;
    return appService.sendLoginEmployeeRequest(loginUserDTO);
  }
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
  @Post("/deleteTransferRecords")
  deleteTransferRecord(
    @Body()
    deleteTransferRecordsDTO: DeleteTransferDTO,
  ) {
    const { appService } = this;
    return appService.sendDeleteTransferRecordsRequest(
      deleteTransferRecordsDTO,
    );
  }
  @Post("/approveTransfer")
  approveTransfer(@Body() approveTransferRequestDTO: GetTransferDTO) {
    const { appService } = this;
    return appService.sendApproveTransferRequest(approveTransferRequestDTO);
  }
  @Post("/rejectTransfer")
  rejectTransfer(@Body() rejectTransferRequestDTO: GetTransferDTO) {
    const { appService } = this;
    return appService.sendRejectTransferRequest(rejectTransferRequestDTO);
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
  @Get("/getUserProfile/:userType/:userId")
  getUserProfile(
    @Param("userType") userType: string,
    @Param("userId") userId: string,
  ) {
    const { appService } = this;
    return appService.sendGetUsersProfileRequest({
      userType,
      userId,
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
  @Get("/getCustomersAccounts/:accountId")
  getAccountsTransfers(@Param("accountId") accountId: string) {
    const { appService } = this;
    return appService.sendGetAccountsTransfersRequest({
      accountId,
    });
  }
  @Get("/getAccount/:accountId")
  @UseGuards(AuthGuard)
  getAccount(@Param("accountId") accountId: AccountIdDTO) {
    const { appService, logger } = this;
    logger.debug("[getAccount] Request:", accountId);
    return appService.sendGetAccountRequest(accountId);
  }
  @Get("/getAccountsLastActions/:accountId/:actionCount")
  getAccountsLastActions(
    @Param("accountId") accountId: string,
    @Param("actionCount") actionCount: number,
  ) {
    const { appService } = this;
    this.logger.debug("[getAccountsLastActions]", accountId, actionCount);
    const getAccountsLastActionsDTO: GetAccountsLastActionsDTO = {
      accountId,
      actionCount,
    };
    return appService.sendGetAccountsLastActionsRequest({
      getAccountsLastActionsDTO,
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
