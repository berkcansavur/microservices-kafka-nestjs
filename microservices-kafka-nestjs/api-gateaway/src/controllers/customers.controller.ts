import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  Post,
  UseGuards,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { AppService } from "src/app.service";
import {
  CreateAccountDTO,
  CreateCustomerDTO,
  CreateTransferDTO,
  GetAccountsLastActionsDTO,
  GetCustomersAccountsDTO,
  GetCustomersTransfersDTO,
  LoginUserDTO,
  MoneyTransferDTO,
} from "src/dtos/api.dtos";
import { AuthGuard } from "src/guards/auth.guard";

@Controller("/customers")
@ApiTags("Customers")
export class CustomersController {
  private readonly logger = new Logger(CustomersController.name);

  constructor(private readonly appService: AppService) {}

  @Post("/loginCustomer")
  loginCustomer(@Body() loginUserDTO: LoginUserDTO) {
    const { appService } = this;
    return appService.sendLoginCustomerRequest(loginUserDTO);
  }
  @Post("/createAccount")
  //@UseGuards(AuthGuard)
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
  @Get("/getCustomersTransfers/:customerId")
  getCustomersTransfers(@Param("customerId") customerId: string) {
    const getCustomersTransfersDTO: GetCustomersTransfersDTO = { customerId };
    const { appService, logger } = this;
    logger.debug(
      "[createTransfer] CreateGetTransfersRequestDTO: ",
      getCustomersTransfersDTO,
    );
    return appService.sendGetCustomersTransfersRequest({
      getCustomersTransfersDTO,
    });
  }
  @Get("/getCustomersAccounts/:customerId")
  // @UseGuards(AuthGuard)
  getCustomersAccounts(@Param("customerId") customerId: string) {
    const getCustomersAccountsDTO: GetCustomersAccountsDTO = { customerId };
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
  @UseGuards(AuthGuard)
  getAccount(@Body() accountId: string) {
    const { appService, logger } = this;
    logger.debug("[getAccount] accountId: ", accountId);
    return appService.sendGetAccountRequest(accountId);
  }
  @Get("/getAccountsLastActions")
  //@UseGuards(AuthGuard)
  getAccountsLastActions(
    @Body() getAccountsLastActionsDTO: GetAccountsLastActionsDTO,
  ) {
    const { appService, logger } = this;
    logger.debug(
      "[getAccountsLastActions] getAccountsLastActionsDTO: ",
      getAccountsLastActionsDTO,
    );
    return appService.sendGetAccountsLastActionsRequest({
      getAccountsLastActionsDTO,
    });
  }
  @Get("/getAccountsBalance")
  //@UseGuards(AuthGuard)
  getAccountsBalance(@Body() accountId: string) {
    const { appService, logger } = this;
    logger.debug("[getAccountsBalance] accountId: ", accountId);
    return appService.sendGetAccountsBalanceRequest(accountId);
  }
  @Get("/getAccountsBalanceOfCurrencyType")
  //@UseGuards(AuthGuard)
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
  //@UseGuards(AuthGuard)
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
  //@UseGuards(AuthGuard)
  createTransfer(@Body() createTransferRequestDTO: CreateTransferDTO) {
    const { appService, logger } = this;
    logger.debug(
      "[createTransfer] createTransferRequestDTO: ",
      createTransferRequestDTO,
    );
    return appService.sendCreateMoneyTransferRequest(createTransferRequestDTO);
  }
}
