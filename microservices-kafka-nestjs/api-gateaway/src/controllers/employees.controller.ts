import { Body, Controller, Get, Logger, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { AppService } from "src/app.service";
import {
  AddCustomerToRepresentativeDTO,
  GetCustomersAccountsDTO,
  GetEmployeesCustomerTransactionsDTO,
  GetTransferDTO,
} from "src/dtos/api.dtos";

@Controller("employees")
@ApiTags("Employees")
export class EmployeesController {
  private readonly logger = new Logger(EmployeesController.name);

  constructor(private readonly appService: AppService) {}

  @Post("/approveTransfer")
  approveTransfer(@Body() approveTransferRequestDTO: GetTransferDTO) {
    const { appService, logger } = this;
    logger.debug(
      "[approveTransfer] approveTransferRequestDTO: ",
      approveTransferRequestDTO,
    );
    return appService.sendApproveTransferRequest(approveTransferRequestDTO);
  }
  @Post("/rejectTransfer")
  rejectTransfer(@Body() rejectTransferRequestDTO: GetTransferDTO) {
    const { appService, logger } = this;
    logger.debug(
      "[rejectTransfer] rejectTransferRequestDTO: ",
      rejectTransferRequestDTO,
    );
    return appService.sendRejectTransferRequest(rejectTransferRequestDTO);
  }
  @Post("/addCustomerToRepresentative")
  addCustomerToRepresentative(
    @Body() addCustomerToRepresentativeDTO: AddCustomerToRepresentativeDTO,
  ) {
    const { appService, logger } = this;
    logger.debug(
      "[addCustomerToRepresentative] addCustomerToRepresentativeDTO: ",
      addCustomerToRepresentativeDTO,
    );
    return appService.sendAddCustomerToRepresentativeRequest({
      addCustomerToRepresentativeDTO,
    });
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
  @Get("/getEmployeesCustomerRelatedTransactionsRequest")
  getEmployeesCustomerRelatedTransactionsRequest(
    @Body()
    getEmployeesCustomerTransactionsDTO: GetEmployeesCustomerTransactionsDTO,
  ) {
    const { appService, logger } = this;
    logger.debug(
      "[getEmployeesCustomerRelatedTransactionsRequest] getEmployeesCustomerTransactionsDTO: ",
      getEmployeesCustomerTransactionsDTO,
    );
    return appService.sendGetEmployeesCustomerRelatedTransactionsRequest({
      getEmployeesCustomerTransactionsDTO,
    });
  }
  @Get("/getAccountsLastActions")
  getAccountsLastActions(@Body() accountId: string, actionCount: number) {
    const { appService, logger } = this;
    logger.debug(
      "[getAccountsLastActions] accountId: ",
      accountId,
      " actionCount: ",
      actionCount,
    );
    return appService.sendGetAccountsLastActionsRequest({
      accountId,
      actionCount,
    });
  }
}
