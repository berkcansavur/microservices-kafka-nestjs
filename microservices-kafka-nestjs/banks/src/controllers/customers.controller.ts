import { Body, Controller, Logger, UsePipes } from "@nestjs/common";
import { MessagePattern } from "@nestjs/microservices";
import { LoginUserDTO } from "src/dtos/auth.dto";
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
}
