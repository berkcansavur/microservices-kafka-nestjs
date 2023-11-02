import { Injectable, Logger } from "@nestjs/common";
import { CustomersService } from "./customers.service";
import { EmployeesService } from "./employees.service";

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private readonly customerService: CustomersService,
    private readonly employeeService: EmployeesService,
  ) {}
  async validateUser({}) {}
}
