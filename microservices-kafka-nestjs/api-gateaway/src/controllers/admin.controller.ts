import { Body, Controller, Logger, Post, UseGuards } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { AppService } from "src/app.service";
import {
  CreateBankDTO,
  CreateCustomerRepresentativeDTO,
  CreateDepartmentDirectorDTO,
  CreateDirectorDTO,
  CreateEmployeeRegistrationToBankDTO,
} from "src/dtos/api.dtos";
import { AuthGuard } from "src/guards/auth.guard";

@Controller("/admin")
@ApiTags("Admin")
export class AdminController {
  private readonly logger = new Logger(AdminController.name);

  constructor(private readonly appService: AppService) {}

  @Post("/createBank")
  @UseGuards(AuthGuard)
  createBank(@Body() createBankDTO: CreateBankDTO) {
    const { appService, logger } = this;
    logger.debug("[createBank] createBankDTO:", createBankDTO);
    return appService.sendCreateBankRequest(createBankDTO);
  }
  @Post("/createBankDirector")
  @UseGuards(AuthGuard)
  createDirector(@Body() createDirectorDTO: CreateDirectorDTO) {
    const { appService, logger } = this;
    logger.debug("[createDirector] createDirectorDTO:", createDirectorDTO);
    return appService.sendCreateDirectorRequest(createDirectorDTO);
  }
  @Post("/createBankDepartmentDirector")
  @UseGuards(AuthGuard)
  createBankDepartmentDirector(
    @Body() createDepartmentDirectorDTO: CreateDepartmentDirectorDTO,
  ) {
    const { appService, logger } = this;
    logger.debug(
      "[createBankDepartmentDirector] createDepartmentDirectorDTO:",
      createDepartmentDirectorDTO,
    );
    return appService.sendCreateDepartmentDirectorRequest(
      createDepartmentDirectorDTO,
    );
  }
  @Post("/createBankCustomerRepresentative")
  @UseGuards(AuthGuard)
  createCustomerRepresentative(
    @Body() createCustomerRepresentativeDTO: CreateCustomerRepresentativeDTO,
  ) {
    const { appService, logger } = this;
    logger.debug(
      "[createCustomerRepresentative] createCustomerRepresentativeDTO:",
      createCustomerRepresentativeDTO,
    );
    return appService.sendCreateCustomerRepresentativeRequest(
      createCustomerRepresentativeDTO,
    );
  }
  @Post("/createEmployeeRegistrationToBank")
  @UseGuards(AuthGuard)
  createEmployeeRegistrationToBank(
    @Body()
    createEmployeeRegistrationToBankDTO: CreateEmployeeRegistrationToBankDTO,
  ) {
    const { appService, logger } = this;
    logger.debug(
      "[createEmployeeRegistrationToBank] createEmployeeRegistrationToBankDTO:",
      createEmployeeRegistrationToBankDTO,
    );
    return appService.sendCreateEmployeeRegistrationToBankRequest(
      createEmployeeRegistrationToBankDTO,
    );
  }
}
