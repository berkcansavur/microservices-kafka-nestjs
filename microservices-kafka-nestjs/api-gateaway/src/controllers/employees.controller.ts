import { Body, Controller, Get, Logger, Post, UseGuards } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { AppService } from "src/app.service";
import {
  AddCustomerToRepresentativeDTO,
  GetCustomersAccountsDTO,
  GetEmployeesCustomerTransactionsDTO,
  GetTransferDTO,
  LoginUserDTO,
} from "src/dtos/api.dtos";
import { AuthGuard } from "src/guards/auth.guard";

@Controller("employees")
@ApiTags("Employees")
export class EmployeesController {
  private readonly logger = new Logger(EmployeesController.name);

  constructor(private readonly appService: AppService) {}

  @Post("/loginEmployee")
  loginEmployee(@Body() loginUserDTO: LoginUserDTO) {
    const { appService } = this;
    return appService.sendLoginEmployeeRequest(loginUserDTO);
  }

  @Post("/approveTransfer")
  @UseGuards(AuthGuard)
  approveTransfer(@Body() approveTransferRequestDTO: GetTransferDTO) {
    const { appService, logger } = this;
    logger.debug(
      "[approveTransfer] approveTransferRequestDTO: ",
      approveTransferRequestDTO,
    );
    return appService.sendApproveTransferRequest(approveTransferRequestDTO);
  }
  @Post("/rejectTransfer")
  @UseGuards(AuthGuard)
  rejectTransfer(@Body() rejectTransferRequestDTO: GetTransferDTO) {
    const { appService, logger } = this;
    logger.debug(
      "[rejectTransfer] rejectTransferRequestDTO: ",
      rejectTransferRequestDTO,
    );
    return appService.sendRejectTransferRequest(rejectTransferRequestDTO);
  }
  @Post("/addCustomerToRepresentative")
  @UseGuards(AuthGuard)
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
  @UseGuards(AuthGuard)
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
  @UseGuards(AuthGuard)
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
  @UseGuards(AuthGuard)
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
