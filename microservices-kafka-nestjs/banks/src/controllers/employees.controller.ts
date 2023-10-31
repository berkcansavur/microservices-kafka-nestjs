import { Controller, Logger, UsePipes } from "@nestjs/common";
import { MessagePattern } from "@nestjs/microservices";
import {
  CreateBankCustomerRepresentativeDTO,
  CreateBankDepartmentDirectorDTO,
  CreateBankDirectorDTO,
} from "src/dtos/bank.dto";
import { ParseIncomingRequest } from "src/pipes/serialize-request-data.pipe";
import { EmployeesService } from "src/services/employees.service";
import { EMPLOYEE_MODEL_TYPES } from "src/types/employee.types";

@Controller("/employees")
export class EmployeesController {
  private readonly logger = new Logger(EmployeesController.name);
  constructor(private readonly employeeService: EmployeesService) {}
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
}
