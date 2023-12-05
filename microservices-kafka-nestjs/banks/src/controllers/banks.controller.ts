import { Controller, Logger, UsePipes } from "@nestjs/common";
import { BanksService } from "../services/banks.service";
import { MessagePattern } from "@nestjs/microservices";
import { ParseIncomingRequest } from "src/pipes/serialize-request-data.pipe";
import {
  CreateBankDTO,
  CreateEmployeeRegistrationToBankDTO,
  GetUserProfileDTO,
} from "../dtos/bank.dto";

@Controller("/banks")
export class BanksController {
  private readonly logger = new Logger(BanksController.name);
  constructor(private readonly bankService: BanksService) {}

  @MessagePattern("create-bank-event")
  @UsePipes(new ParseIncomingRequest())
  async createBankEvent(data: CreateBankDTO) {
    const { logger } = this;
    logger.debug(
      `[BanksController] Banks approveTransfer Incoming Data: ${JSON.stringify(
        data,
      )}`,
    );
    return await this.bankService.handleCreateBank({
      createBankDTO: data,
    });
  }
  @MessagePattern("create-employee-registration-to-bank-event")
  @UsePipes(new ParseIncomingRequest())
  async createEmployeeRegistrationToBank(
    data: CreateEmployeeRegistrationToBankDTO,
  ) {
    const { logger } = this;
    logger.debug(
      `[BanksController] Banks approveTransfer Incoming Data: ${JSON.stringify(
        data,
      )}`,
    );
    return await this.bankService.handleCreateEmployeeRegistrationToBank({
      employeeType: data.employeeType,
      employeeId: data.employeeId,
      bankId: data.bankId,
    });
  }
  @MessagePattern("get-user-profile-event")
  @UsePipes(new ParseIncomingRequest())
  async getUserProfile(data: GetUserProfileDTO) {
    const { logger, bankService } = this;
    logger.debug(
      `[BanksController] Banks getUserProfile Incoming Data: `,
      data,
    );
    const user = await bankService.getUserProfile({
      userType: data.userType,
      userId: data.userId,
    });
    const stingifedUser = JSON.stringify(user);
    logger.debug(
      `[BanksController] User: `,
      stingifedUser,
      "Parsed user:",
      JSON.parse(stingifedUser),
    );
    return JSON.parse(stingifedUser);
  }
}
