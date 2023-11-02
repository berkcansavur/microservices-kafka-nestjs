import { Body, Controller, Get, Logger, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { AppService } from "src/app.service";
import {
  CreateAccountDTO,
  CreateCustomerDTO,
  CreateTransferDTO,
  GetCustomersAccountsDTO,
  MoneyTransferDTO,
} from "src/dtos/api.dtos";

@Controller("/customers")
@ApiTags("Customers")
export class CustomersController {
  private readonly logger = new Logger(CustomersController.name);

  constructor(private readonly appService: AppService) {}

  @Post("/createAccount")
  createAccount(@Body() createAccountRequestDTO: CreateAccountDTO) {
    const { appService, logger } = this;
    logger.debug(
      "[createAccount] createAccountRequestDTO: ",
      createAccountRequestDTO,
    );
    return appService.sendCreateAccountRequest(createAccountRequestDTO);
  }
  @Post("/createCustomer")
  createCustomer(@Body() createCustomerRequestDTO: CreateCustomerDTO) {
    const { appService, logger } = this;
    logger.debug(
      "[createCustomer] createCustomerRequestDTO: ",
      createCustomerRequestDTO,
    );
    return appService.sendCreateCustomerRequest(createCustomerRequestDTO);
  }
  @Get("/getCustomersAccounts")
  getCustomersAccounts(
    @Body() getCustomersAccountsDTO: GetCustomersAccountsDTO,
  ) {
    const { appService, logger } = this;
    logger.debug(
      "[getCustomersAccounts] getCustomersAccountsDTO: ",
      getCustomersAccountsDTO,
    );
    return appService.sendGetCustomersAccountsRequest({
      getCustomersAccountsDTO,
    });
  }
  @Get("/getAccount")
  getAccount(@Body() accountId: string) {
    const { appService, logger } = this;
    logger.debug("[getAccount] accountId: ", accountId);
    return appService.sendGetAccountRequest(accountId);
  }
  @Get("/getAccountsLastActions")
  getAccountsLastActions(@Body() accountId: string, actionCount: number) {
    const { appService, logger } = this;
    logger.debug(
      "[getAccountsLastActions] accountId: ",
      accountId,
      "actionCount: ",
      actionCount,
    );
    return appService.sendGetAccountsLastActionsRequest({
      accountId,
      actionCount,
    });
  }
  @Get("/getAccountsBalance")
  getAccountsBalance(@Body() accountId: string) {
    const { appService, logger } = this;
    logger.debug("[getAccountsBalance] accountId: ", accountId);
    return appService.sendGetAccountsBalanceRequest(accountId);
  }
  @Get("/getAccountsBalanceOfCurrencyType")
  getAccountsBalanceOfCurrencyType(
    @Body() accountId: string,
    currencyType: string,
  ) {
    const { appService, logger } = this;
    logger.debug("[getAccountsBalanceOfCurrencyType] accountId: ", accountId);
    return appService.sendGetAccountsCurrencyBalanceRequest({
      accountId,
      currencyType,
    });
  }
  @Post("/transferMoneyToAccount")
  transferMoneyToAccount(@Body() transferMoneyToAccountDTO: MoneyTransferDTO) {
    const { appService, logger } = this;
    logger.debug(
      "[transferMoneyToAccount] transferMoneyToAccountDTO: ",
      transferMoneyToAccountDTO,
    );
    return appService.sendTransferMoneyToAccountRequest(
      transferMoneyToAccountDTO,
    );
  }
  @Post("/createTransfer")
  createTransfer(@Body() createTransferRequestDTO: CreateTransferDTO) {
    const { appService, logger } = this;
    logger.debug(
      "[createTransfer] createTransferRequestDTO: ",
      createTransferRequestDTO,
    );
    return appService.sendCreateMoneyTransferRequest(createTransferRequestDTO);
  }
}
