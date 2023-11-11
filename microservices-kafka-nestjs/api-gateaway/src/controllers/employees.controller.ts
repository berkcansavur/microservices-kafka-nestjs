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
  AddCustomerToRepresentativeDTO,
  GetCustomersAccountsDTO,
  GetEmployeeDTO,
  GetEmployeesCustomerTransactionsDTO,
  GetTransferDTO,
  LoginUserDTO,
} from "src/dtos/api.dtos";
import { AuthGuard } from "src/guards/auth.guard";
import { USER_TYPES } from "types/app-types";

@Controller("/employees")
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
  @Get(
    "/getEmployeesCustomerRelatedTransactions/:employeeType/:employeeId/:customerId",
  )
  @UseGuards(AuthGuard)
  getEmployeesCustomerRelatedTransactionsRequest(
    @Param("employeeType") employeeType: USER_TYPES,
    @Param("employeeId") employeeId: string,
    @Param("customerId") customerId: string,
  ) {
    const { appService, logger } = this;

    const getEmployeesCustomerTransactionsDTO: GetEmployeesCustomerTransactionsDTO =
      { employeeId, employeeType, customerId };
    logger.debug(
      "[getEmployeesCustomerRelatedTransactionsRequest] getEmployeesCustomerTransactionsDTO: ",
      getEmployeesCustomerTransactionsDTO,
      "emp id:",
      employeeId,
    );
    return appService.sendGetEmployeesCustomerRelatedTransactionsRequest({
      getEmployeesCustomerTransactionsDTO,
    });
  }
  @Get("/getEmployeesTransactions/:employeeType/:employeeId")
  @UseGuards(AuthGuard)
  getEmployeesTransactionsRequest(
    @Param("employeeType") employeeType: USER_TYPES,
    @Param("employeeId") employeeId: string,
  ) {
    const { appService, logger } = this;

    const getEmployeeDTO: GetEmployeeDTO = {
      employeeId,
      employeeType,
    };
    logger.debug(
      "[getEmployeesCustomerRelatedTransactionsRequest] getEmployeesCustomerTransactionsDTO: ",
      getEmployeeDTO,
      "emp id:",
      employeeId,
    );
    return appService.sendGetEmployeesTransactionsRequest({
      getEmployeeDTO,
    });
  }
  @Get("/searchCustomer/:searchText")
  @UseGuards(AuthGuard)
  searchCustomer(@Param("searchText") searchText: string) {
    const { appService, logger } = this;

    logger.debug(
      "[getEmployeesCustomerRelatedTransactionsRequest] searchText: ",
      searchText,
    );
    return appService.sendSearchCustomerRequest({
      searchText,
    });
  }
}
