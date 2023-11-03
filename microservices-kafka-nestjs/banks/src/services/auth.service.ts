import { Injectable, Logger } from "@nestjs/common";
import { CustomersService } from "./customers.service";
import { EmployeesService } from "./employees.service";
import { JwtService } from "@nestjs/jwt";
import {
  AuthenticatedUserDTO,
  CurrentUserDTO,
  LoginUserDTO,
} from "src/dtos/auth.dto";
import { InjectMapper } from "@automapper/nestjs";
import { Mapper } from "@automapper/core";
import { Utils } from "src/utils/utils";
import { USER_TYPES } from "src/constants/banks.constants";
import {
  BankCustomerRepresentative,
  BankDepartmentDirector,
  BankDirector,
} from "src/schemas/employee-schema";
import { Customer } from "src/schemas/customers.schema";
import {
  UserCouldNotValidatedException,
  UserNotFoundException,
} from "src/exceptions";
import { promisify } from "util";
import { scrypt as _scrypt } from "crypto";
const scrypt = promisify(_scrypt);
@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly utils = new Utils();
  constructor(
    @InjectMapper() private readonly AuthMapper: Mapper,
    private readonly customerService: CustomersService,
    private readonly employeeService: EmployeesService,
    private jwtTokenService: JwtService,
  ) {}
  async getUserToValidate({
    email,
    userType,
  }: {
    email: string;
    userType: USER_TYPES;
  }): Promise<
    | Customer
    | BankDepartmentDirector
    | BankDirector
    | BankCustomerRepresentative
  > {
    const { utils, employeeService, customerService, logger } = this;
    logger.debug("[getUserToValidate] userType:", userType, "email:", email);
    if (userType === USER_TYPES.CUSTOMER) {
      return await customerService.getCustomerByEmail({ email });
    }
    const employeeType = utils.getEmployeeModelType(userType);
    logger.debug("[getUserToValidate] employeeType:", employeeType);
    return await employeeService.getEmployeeByEmail({
      employeeType,
      email,
    });
  }
  async validateUser({
    loginUserDto,
  }: {
    loginUserDto: LoginUserDTO;
  }): Promise<CurrentUserDTO> {
    const { AuthMapper } = this;
    const { userType, email, password } = loginUserDto;
    const user = await this.getUserToValidate({
      email,
      userType,
    });
    if (!user) {
      throw new UserNotFoundException();
    }
    const [salt, sortedHash] = user.password.split(".");
    const hashedPart = (await scrypt(password, salt, 32)) as Buffer;
    if (sortedHash === hashedPart.toString("hex")) {
      const mappedUser = AuthMapper.map<
        | Customer
        | BankDirector
        | BankDepartmentDirector
        | BankCustomerRepresentative,
        CurrentUserDTO
      >(
        user,
        Customer ||
          BankDirector ||
          BankDepartmentDirector ||
          BankCustomerRepresentative,
        CurrentUserDTO,
      );
      return mappedUser;
    }
    throw new UserCouldNotValidatedException();
  }
  async loginWithCredentials({
    user,
  }: {
    user: CurrentUserDTO;
  }): Promise<AuthenticatedUserDTO> {
    const payload = {
      sub: user.userId,
      email: user.userEmail,
    };
    const accessToken = this.jwtTokenService.sign(payload);
    const authenticatedUser = new AuthenticatedUserDTO();
    authenticatedUser.access_token = accessToken;
    authenticatedUser.userId = user.userId;
    authenticatedUser.userEmail = user.userEmail;
    authenticatedUser.userName = user.userName;
    return authenticatedUser;
  }
}
