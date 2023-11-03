import { Body, Controller, Logger, UsePipes } from "@nestjs/common";
import { MessagePattern } from "@nestjs/microservices";
import { LoginUserDTO } from "src/dtos/auth.dto";
import {
  CreateBankCustomerRepresentativeDTO,
  CreateBankDepartmentDirectorDTO,
  CreateBankDirectorDTO,
  GetEmployeesCustomerTransactionsDTO,
} from "src/dtos/bank.dto";
import { ParseIncomingRequest } from "src/pipes/serialize-request-data.pipe";
import { AuthService } from "src/services/auth.service";
import { EmployeesService } from "src/services/employees.service";
import { EMPLOYEE_MODEL_TYPES } from "src/types/employee.types";

@Controller("/employees")
export class EmployeesController {
  private readonly logger = new Logger(EmployeesController.name);
  constructor(
    private readonly employeeService: EmployeesService,
    private readonly authService: AuthService,
  ) {}

  @MessagePattern("login-employee")
  @UsePipes(new ParseIncomingRequest())
  async login(@Body() user: LoginUserDTO) {
    const { logger, employeeService } = this;
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
    const authenticatedUser = await employeeService.setEmployeesAccessToken({
      userType: user.userType,
      authenticatedUserDTO: userToBeAuthenticate,
    });
    logger.debug(
      "[login] authenticatedUser: ",
      JSON.stringify(authenticatedUser),
    );
    return JSON.stringify(authenticatedUser);
  }
  @MessagePattern("create-bank-director-event")
  @UsePipes(new ParseIncomingRequest())
  async createBankDirectorEvent(data: CreateBankDirectorDTO) {
    const { logger } = this;
    logger.debug(
      `[BanksController] Banks createBankDirectorEvent Incoming Data: ${JSON.stringify(
        data,
      )}`,
    );
    return await this.employeeService.createEmployee({
      employeeType: EMPLOYEE_MODEL_TYPES.BANK_DIRECTOR,
      createEmployeeDTO: data,
    });
  }
  @MessagePattern("create-bank-department-director-event")
  @UsePipes(new ParseIncomingRequest())
  async createBankDepartmentDirectorEvent(
    data: CreateBankDepartmentDirectorDTO,
  ) {
    const { logger } = this;
    logger.debug(
      `[BanksController] Banks createBankDirectorEvent Incoming Data: ${JSON.stringify(
        data,
      )}`,
    );
    return await this.employeeService.createEmployee({
      employeeType: EMPLOYEE_MODEL_TYPES.BANK_DEPARTMENT_DIRECTOR,
      createEmployeeDTO: data,
    });
  }
  @MessagePattern("create-bank-customer-representative-event")
  @UsePipes(new ParseIncomingRequest())
  async createBankCustomerRepresentativeEvent(
    data: CreateBankCustomerRepresentativeDTO,
  ) {
    const { logger } = this;
    logger.debug(
      `[BanksController] Banks createBankCustomerRepresentativeEvent Incoming Data: ${JSON.stringify(
        data,
      )}`,
    );
    return await this.employeeService.createEmployee({
      employeeType: EMPLOYEE_MODEL_TYPES.BANK_CUSTOMER_REPRESENTATIVE,
      createEmployeeDTO: data,
    });
  }
  @MessagePattern("get-employees-customer-related-transactions")
  @UsePipes(new ParseIncomingRequest())
  async getEmployeesCustomerRelatedTransactions(
    data: GetEmployeesCustomerTransactionsDTO,
  ) {
    const { logger, employeeService } = this;
    logger.debug(
      `[BanksController] Banks createBankCustomerRepresentativeEvent Incoming Data: ${JSON.stringify(
        data,
      )}`,
    );
    return await employeeService.getEmployeesCustomerTransactions({
      employeeType: data.employeeType,
      employeeId: data.employeeId,
      customerId: data.customerId,
    });
  }
}
