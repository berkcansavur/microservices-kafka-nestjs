import { Body, Controller, Logger, UsePipes } from "@nestjs/common";
import { MessagePattern } from "@nestjs/microservices";
import { LoginUserDTO } from "src/dtos/auth.dto";
import { CreateCustomerDTO } from "src/dtos/bank.dto";
import { AddAccountDTO, SearchTextDTO } from "src/dtos/customer.dto";
import { ParseIncomingRequest } from "src/pipes/serialize-request-data.pipe";
import { AuthService } from "src/services/auth.service";
import { CustomersService } from "src/services/customers.service";

@Controller("/customers")
export class CustomersController {
  private readonly logger = new Logger(CustomersController.name);
  constructor(
    private readonly customerService: CustomersService,
    private readonly authService: AuthService,
  ) {}

  @MessagePattern("login-customer")
  @UsePipes(new ParseIncomingRequest())
  async login(@Body() user: LoginUserDTO) {
    const { logger, customerService } = this;
    logger.debug("[login] user: LoginUserDTO: ", user);
    const validatedUser = await this.authService.validateUser({
      loginUserDto: user,
    });
    logger.debug("[login] validatedUser: ", user);
    const userToBeAuthenticate = await this.authService.loginWithCredentials({
      user: validatedUser,
    });
    logger.debug(
      "[login] userToBeAuthenticate: ",
      JSON.stringify(userToBeAuthenticate),
    );
    const authenticatedUser = await customerService.setCustomersAccessToken({
      authenticatedUserDTO: userToBeAuthenticate,
    });
    logger.debug(
      "[login] authenticatedUser: ",
      JSON.stringify(authenticatedUser),
    );
    return JSON.stringify(authenticatedUser);
  }
  @MessagePattern("create-customer-event")
  @UsePipes(new ParseIncomingRequest())
  async create(data: CreateCustomerDTO) {
    const { logger, customerService } = this;
    logger.debug(
      `[BanksController] Banks approveTransfer Incoming Data: ${JSON.stringify(
        data,
      )}`,
    );
    const customer = await customerService.create({
      createCustomerDTO: data,
    });
    return customer;
  }
  @MessagePattern("search-customer")
  @UsePipes(new ParseIncomingRequest())
  async find(@Body() query: SearchTextDTO) {
    const { logger, customerService } = this;
    logger.debug("[login] user: LoginUserDTO: ", query);
    const searchResult = await customerService.filterCustomerByQuery({ query });
    logger.debug("[login] searchResult: ", searchResult);
    return JSON.stringify(searchResult);
  }
  @MessagePattern("get-customer")
  @UsePipes(new ParseIncomingRequest())
  async get(@Body() customerId: string) {
    const { logger, customerService } = this;
    logger.debug("[login] user: LoginUserDTO: ", customerId);
    const customer = await customerService.getCustomer({ customerId });
    logger.debug("[login] searchResult: ", customer);
    return JSON.stringify(customer);
  }
  @MessagePattern("add-transaction-to-customer")
  @UsePipes(new ParseIncomingRequest())
  async addTransaction(@Body() customerId: string) {
    const { logger, customerService } = this;
    logger.debug("[addTransaction] customerId: ", customerId);
    const customer = await customerService.getCustomer({ customerId });
    logger.debug("[addTransaction] customer: ", customer);
    return JSON.stringify(customer);
  }
  @MessagePattern("add-account-to-customer")
  @UsePipes(new ParseIncomingRequest())
  async addAccount(@Body() data: AddAccountDTO) {
    const { logger, customerService } = this;
    const { customerId, accountId } = data;
    logger.debug("[addAccount] user: LoginUserDTO: ", customerId);
    const customer = await customerService.addAccount({
      customerId,
      accountId,
    });
    logger.debug("[login] searchResult: ", customer);
    return JSON.stringify(customer);
  }
}
